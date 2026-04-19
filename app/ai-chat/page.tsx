'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  event?: {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    category: string;
    imageUrl: string;
    price: string;
    attendees: number;
    matchedInterests: string[];
    matchScore: number;
  };
  bookingConfirmed?: boolean;
}

interface UserProfile {
  name: string;
  mood: string;
  interests: string[];
  location: string;
}

export default function AIChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState<'greeting' | 'suggesting' | 'confirming' | 'booking' | 'done'>('greeting');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [suggestedEvent, setSuggestedEvent] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [bookingId, setBookingId] = useState<string>('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Load user profile from localStorage
    const savedUser = localStorage.getItem('watcha_current_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setUserProfile({
        name: user.name,
        mood: user.mood,
        interests: user.interests,
        location: user.location,
      });
      startConversation(user);
    } else {
      // Redirect to home if no user profile
      router.push('/');
    }
  }, [router]);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const startConversation = (user: any) => {
    // Initial greeting
    setTimeout(() => {
      addMessage({
        id: Date.now().toString(),
        type: 'ai',
        content: `Hi ${user.name}! 👋 I'm your AI event assistant. I can see you're feeling ${user.mood} and interested in ${user.interests.slice(0, 3).join(', ')}${user.interests.length > 3 ? '...' : ''}. Let me find the perfect event for you in ${user.location}!`,
      });
      setCurrentStep('suggesting');
      
      // Fetch suggested event after a short delay
      setTimeout(() => {
        fetchSuggestedEvent();
      }, 1500);
    }, 500);
  };

  const fetchSuggestedEvent = async () => {
    if (!userProfile) return;

    setIsTyping(true);
    try {
      const response = await fetch('/api/suggest-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: userProfile.mood,
          interests: userProfile.interests,
          location: userProfile.location,
        }),
      });

      const data = await response.json();
      if (data.success && data.events.length > 0) {
        const bestMatch = data.events.reduce((best: any, event: any) => 
          event.matchScore > best.matchScore ? event : best
        );
        setSuggestedEvent(bestMatch);
        
        setTimeout(() => {
          addMessage({
            id: Date.now().toString(),
            type: 'ai',
            content: `I found a fantastic event that matches your interests perfectly! 🎉`,
            event: bestMatch,
          });
          setCurrentStep('confirming');
          setIsTyping(false);
        }, 1000);
      } else {
        addMessage({
          id: Date.now().toString(),
          type: 'ai',
          content: "I couldn't find any events matching your criteria right now. Would you like to try different interests or check back later?",
        });
        setIsTyping(false);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      addMessage({
        id: Date.now().toString(),
        type: 'ai',
        content: "Sorry, I encountered an error while searching for events. Please try again later.",
      });
      setIsTyping(false);
    }
  };

  const handleUserResponse = async (response: string) => {
    addMessage({
      id: Date.now().toString(),
      type: 'user',
      content: response,
    });

    if (response === 'yes_book') {
      setIsTyping(true);
      setCurrentStep('booking');
      
      try {
        const bookingResponse = await fetch('/api/book-event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventId: suggestedEvent.id,
            userId: userProfile?.name || 'guest',
            event: suggestedEvent,
          }),
        });

        const bookingData = await bookingResponse.json();
        setBookingId(bookingData.bookingId);

        setTimeout(() => {
          addMessage({
            id: Date.now().toString(),
            type: 'ai',
            content: `🎊 Amazing! I've successfully booked your spot for "${suggestedEvent.title}"! Your booking ID is ${bookingData.bookingId}. You're all set for ${suggestedEvent.date} at ${suggestedEvent.time}. See you there!`,
            bookingConfirmed: true,
          });
          setCurrentStep('done');
          setIsTyping(false);
        }, 1500);
      } catch (error) {
        console.error('Error booking event:', error);
        addMessage({
          id: Date.now().toString(),
          type: 'ai',
          content: "Sorry, I encountered an error while booking. Please try again.",
        });
        setIsTyping(false);
      }
    } else if (response === 'no_book') {
      setTimeout(() => {
        addMessage({
          id: Date.now().toString(),
          type: 'ai',
          content: "No problem! Would you like me to suggest another event, or would you prefer to browse all events yourself?",
        });
        setIsTyping(false);
      }, 500);
    } else if (response === 'suggest_another') {
      setCurrentStep('suggesting');
      fetchSuggestedEvent();
    } else if (response === 'browse_events') {
      router.push('/events');
    }
  };

  const handleViewConfirmation = () => {
    if (bookingId && suggestedEvent) {
      router.push(`/booking-confirmation?bookingId=${bookingId}`);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Music: 'bg-purple-100 text-purple-700',
      Art: 'bg-pink-100 text-pink-700',
      Sports: 'bg-green-100 text-green-700',
      Technology: 'bg-blue-100 text-blue-700',
      Food: 'bg-orange-100 text-orange-700',
      Travel: 'bg-teal-100 text-teal-700',
      Gaming: 'bg-indigo-100 text-indigo-700',
      Photography: 'bg-rose-100 text-rose-700',
      Reading: 'bg-amber-100 text-amber-700',
      Fitness: 'bg-lime-100 text-lime-700',
      Dancing: 'bg-fuchsia-100 text-fuchsia-700',
      Movies: 'bg-slate-100 text-slate-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-pink-200">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">W</span>
              </div>
              <span className="text-2xl font-bold text-pink-600">Watcha</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/dashboard" className="px-4 py-2 text-pink-600 hover:text-pink-700 font-medium transition-colors">
                Dashboard
              </Link>
              <Link href="/events" className="px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 font-medium transition-colors">
                Find Events
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-pink-500 text-xl">🤖</span>
              </div>
              <div>
                <h2 className="text-white font-semibold text-lg">AI Event Assistant</h2>
                <p className="text-pink-100 text-sm">Finding your perfect event</p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  
                  {/* Event Card */}
                  {message.event && (
                    <div className="mt-4 bg-white rounded-xl shadow-lg overflow-hidden">
                      <img
                        src={message.event.imageUrl}
                        alt={message.event.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(message.event.category)}`}>
                            {message.event.category}
                          </span>
                          <span className="text-green-600 font-semibold">{message.event.price}</span>
                        </div>
                        <h3 className="font-bold text-lg text-gray-800 mb-2">{message.event.title}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{message.event.description}</p>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {message.event.date}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {message.event.time}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {message.event.location}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {message.event.attendees} interested
                          </span>
                          <span className="text-sm text-pink-600 font-medium">
                            {Math.round(message.event.matchScore * 100)}% match
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Booking Confirmation Actions */}
                  {message.bookingConfirmed && (
                    <div className="mt-4 space-y-2">
                      <button
                        onClick={handleViewConfirmation}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all"
                      >
                        🎫 View Booking Confirmation
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            {currentStep === 'confirming' && !isTyping && suggestedEvent && (
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => handleUserResponse('yes_book')}
                  className="bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 px-6 rounded-xl font-medium hover:from-pink-600 hover:to-pink-700 transition-all"
                >
                  ✅ Yes, book it for me!
                </button>
                <button
                  onClick={() => handleUserResponse('no_book')}
                  className="bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-300 transition-all"
                >
                  ❌ No, show me something else
                </button>
              </div>
            )}

            {/* Alternative Actions */}
            {currentStep === 'done' && !isTyping && (
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => handleUserResponse('suggest_another')}
                  className="bg-pink-100 text-pink-700 py-3 px-6 rounded-xl font-medium hover:bg-pink-200 transition-all"
                >
                  🔄 Find another event
                </button>
                <button
                  onClick={() => handleUserResponse('browse_events')}
                  className="bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-300 transition-all"
                >
                  📋 Browse all events
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
