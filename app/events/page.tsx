'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Event {
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
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState('Happy');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Music', 'Art']);
  const [location, setLocation] = useState('London');

  const interests = [
    'Music', 'Art', 'Sports', 'Technology', 'Food', 'Travel',
    'Gaming', 'Photography', 'Reading', 'Fitness', 'Dancing', 'Movies'
  ];

  const moods = [
    'Happy', 'Calm', 'Excited', 'Curious', 'Adventurous', 'Relaxed', 'Social', 'Creative'
  ];

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/suggest-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: selectedMood,
          interests: selectedInterests,
          location,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setEvents(data.events);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

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
      Yoga: 'bg-cyan-100 text-cyan-700',
      Writing: 'bg-violet-100 text-violet-700',
      Nature: 'bg-emerald-100 text-emerald-700',
      Science: 'bg-sky-100 text-sky-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-pink-200">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">W</span>
              </div>
              <span className="text-2xl font-bold text-pink-600">Watcha</span>
            </Link>
            <div className="flex space-x-4">
              <Link href="/" className="px-4 py-2 text-pink-600 hover:text-pink-700 font-medium transition-colors">
                Home
              </Link>
              <Link href="/ai-chat" className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 font-medium transition-all">
                🤖 AI Assistant
              </Link>
              <Link href="/dashboard" className="px-4 py-2 text-pink-600 hover:text-pink-700 font-medium transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-pink-800 mb-4">
            Discover Events for You
          </h1>
          <p className="text-xl text-pink-600">
            AI-powered recommendations based on your mood and interests
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Mood Selection */}
            <div>
              <label className="block text-sm font-medium text-pink-600 mb-3">Your Mood</label>
              <div className="flex flex-wrap gap-2">
                {moods.map((mood) => (
                  <button
                    key={mood}
                    onClick={() => setSelectedMood(mood)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedMood === mood
                        ? 'bg-pink-500 text-white'
                        : 'bg-pink-50 text-pink-600 hover:bg-pink-100'
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-pink-600 mb-3">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500 text-pink-700"
                placeholder="Enter your location"
              />
            </div>
          </div>

          {/* Interests */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-pink-600 mb-3">Your Interests</label>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedInterests.includes(interest)
                      ? 'bg-pink-500 text-white'
                      : 'bg-pink-50 text-pink-600 hover:bg-pink-100'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={fetchEvents}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-lg font-bold rounded-full hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Finding Events...' : 'Find Events'}
          </button>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-500 border-t-transparent"></div>
          </div>
        ) : events.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getCategoryColor(event.category)}`}>
                      {event.category}
                    </span>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-pink-600">
                      {event.matchScore}% Match
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-pink-800 mb-2">{event.title}</h3>
                  <p className="text-pink-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-pink-600">
                      <span className="mr-2">📅</span>
                      <span>{event.date} at {event.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-pink-600">
                      <span className="mr-2">📍</span>
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-pink-600">
                      <span className="mr-2">💰</span>
                      <span>{event.price}</span>
                    </div>
                    <div className="flex items-center text-sm text-pink-600">
                      <span className="mr-2">👥</span>
                      <span>{event.attendees} attending</span>
                    </div>
                  </div>

                  {event.matchedInterests.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-pink-500 mb-2">Matched Interests</p>
                      <div className="flex flex-wrap gap-1">
                        {event.matchedInterests.map((interest, idx) => (
                          <span key={idx} className="px-2 py-1 bg-pink-50 text-pink-600 rounded-full text-xs">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button className="w-full py-3 bg-pink-500 text-white rounded-full font-medium hover:bg-pink-600 transition-colors">
                    Join Event
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-pink-600 text-lg">No events found. Try adjusting your preferences!</p>
          </div>
        )}
      </div>
    </div>
  );
}
