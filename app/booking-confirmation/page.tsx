'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Booking {
  id: string;
  bookingId: string;
  eventId: string;
  userId: string;
  event: {
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
  bookedAt: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bookingId = searchParams.get('bookingId');
  const eventParam = searchParams.get('event');

  useEffect(() => {
    if (!bookingId) {
      setError('No booking ID provided');
      setLoading(false);
      return;
    }

    if (!eventParam) {
      setError('No event data provided');
      setLoading(false);
      return;
    }

    try {
      const eventData = JSON.parse(decodeURIComponent(eventParam));
      const bookingData: Booking = {
        id: Date.now().toString(),
        bookingId,
        eventId: eventData.id,
        userId: 'User',
        event: eventData,
        bookedAt: new Date().toISOString(),
        status: 'confirmed',
      };
      setBooking(bookingData);
    } catch (err) {
      console.error('Error parsing event data:', err);
      setError('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  }, [bookingId, eventParam]);

  const handleDownloadTicket = () => {
    if (!booking) return;

    // Create a simple ticket download
    const ticketContent = `
========================================
           WATCHA EVENT TICKET
========================================

Booking ID: ${booking.bookingId}
Event: ${booking.event.title}
Date: ${booking.event.date}
Time: ${booking.event.time}
Location: ${booking.event.location}
Price: ${booking.event.price}
Category: ${booking.event.category}

Booked by: ${booking.userId}
Booked on: ${new Date(booking.bookedAt).toLocaleDateString()}
Status: ${booking.status.toUpperCase()}

========================================
           See you there! 🎉
========================================
    `;

    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-${booking.bookingId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShareBooking = async () => {
    if (!booking) return;

    const shareText = `I just booked "${booking.event.title}" on Watcha! 🎉 Join me on ${booking.event.date} at ${booking.event.location}. #WatchaEvents`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Watcha Event Booking',
          text: shareText,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText);
      alert('Booking details copied to clipboard!');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-pink-200 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-pink-600 font-medium">Loading your booking...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
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

        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'We couldn\'t find your booking details.'}</p>
            <Link
              href="/ai-chat"
              className="inline-block bg-pink-500 text-white px-6 py-3 rounded-full font-medium hover:bg-pink-600 transition-colors"
            >
              Find Another Event
            </Link>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Success Animation */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-8 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h1>
            <p className="text-green-100">You're all set for an amazing experience</p>
          </div>

          {/* Booking Details */}
          <div className="p-8">
            {/* Booking ID Badge */}
            <div className="bg-pink-50 border-2 border-pink-200 rounded-xl p-4 mb-6 text-center">
              <p className="text-sm text-pink-600 font-medium mb-1">Booking ID</p>
              <p className="text-2xl font-bold text-pink-700 tracking-wider">{booking.bookingId}</p>
            </div>

            {/* Event Card */}
            <div className="bg-gray-50 rounded-xl overflow-hidden mb-6">
              <img
                src={booking.event.imageUrl}
                alt={booking.event.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(booking.event.category)}`}>
                    {booking.event.category}
                  </span>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    {booking.status.toUpperCase()}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{booking.event.title}</h2>
                <p className="text-gray-600 mb-4">{booking.event.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="font-semibold text-gray-800">{booking.event.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Time</p>
                      <p className="font-semibold text-gray-800">{booking.event.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="font-semibold text-gray-800">{booking.event.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Price</p>
                      <p className="font-semibold text-gray-800">{booking.event.price}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Info */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">Booking Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-600">Booked by:</span>
                  <span className="font-medium text-blue-800">{booking.userId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">Booked on:</span>
                  <span className="font-medium text-blue-800">{new Date(booking.bookedAt).toLocaleDateString()} at {new Date(booking.bookedAt).toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">Event ID:</span>
                  <span className="font-medium text-blue-800">{booking.eventId}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button
                onClick={handleDownloadTicket}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 px-6 rounded-xl font-medium hover:from-pink-600 hover:to-pink-700 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download Ticket</span>
              </button>
              <button
                onClick={handleShareBooking}
                className="flex items-center justify-center space-x-2 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-300 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>Share Booking</span>
              </button>
            </div>

            {/* Additional Links */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/ai-chat"
                className="flex-1 text-center bg-pink-100 text-pink-700 py-3 px-6 rounded-xl font-medium hover:bg-pink-200 transition-colors"
              >
                Find Another Event
              </Link>
              <Link
                href="/dashboard"
                className="flex-1 text-center bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-300 transition-colors"
              >
                View Dashboard
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t">
            <p className="text-center text-sm text-gray-500">
              Need help? Contact us at{' '}
              <a href="mailto:support@watcha.com" className="text-pink-600 hover:text-pink-700 font-medium">
                support@watcha.com
              </a>
            </p>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📝 Tips for Your Event</h3>
          <ul className="space-y-3">
            <li className="flex items-start space-x-3">
              <span className="text-pink-500 mt-1">✓</span>
              <p className="text-gray-600">Arrive 15-30 minutes early to check in and get settled</p>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-pink-500 mt-1">✓</span>
              <p className="text-gray-600">Bring a copy of your booking confirmation or ticket</p>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-pink-500 mt-1">✓</span>
              <p className="text-gray-600">Check the event page for any updates or changes before attending</p>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-pink-500 mt-1">✓</span>
              <p className="text-gray-600">Don't forget to share your experience on social media!</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
