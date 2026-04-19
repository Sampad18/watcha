'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  mood: string;
  interests: string[];
  location: string;
  lastActive: string;
}

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [filterMood, setFilterMood] = useState('');

  useEffect(() => {
    // Mock data - in production, this would come from an API
    const mockUsers: User[] = [
      { id: '1', name: 'Sarah Chen', mood: 'Happy', interests: ['Music', 'Art', 'Photography'], location: 'London', lastActive: '2 min ago' },
      { id: '2', name: 'Alex Rivera', mood: 'Excited', interests: ['Sports', 'Fitness', 'Technology'], location: 'Manchester', lastActive: '15 min ago' },
      { id: '3', name: 'Jordan Lee', mood: 'Calm', interests: ['Reading', 'Meditation', 'Nature'], location: 'Birmingham', lastActive: '1 hour ago' },
      { id: '4', name: 'Emma Wilson', mood: 'Curious', interests: ['Technology', 'Gaming', 'Science'], location: 'Edinburgh', lastActive: '5 min ago' },
      { id: '5', name: 'Marcus Johnson', mood: 'Social', interests: ['Music', 'Dancing', 'Food'], location: 'London', lastActive: '30 min ago' },
      { id: '6', name: 'Lisa Park', mood: 'Adventurous', interests: ['Travel', 'Photography', 'Food'], location: 'Bristol', lastActive: '45 min ago' },
      { id: '7', name: 'David Kim', mood: 'Creative', interests: ['Art', 'Music', 'Writing'], location: 'Leeds', lastActive: '20 min ago' },
      { id: '8', name: 'Nina Patel', mood: 'Relaxed', interests: ['Reading', 'Yoga', 'Nature'], location: 'Oxford', lastActive: '10 min ago' },
    ];

    setUsers(mockUsers);
    setCurrentUser(mockUsers[0]);
  }, []);

  const moodColors: { [key: string]: string } = {
    Happy: 'bg-yellow-100 text-yellow-700',
    Calm: 'bg-blue-100 text-blue-700',
    Excited: 'bg-orange-100 text-orange-700',
    Curious: 'bg-purple-100 text-purple-700',
    Adventurous: 'bg-green-100 text-green-700',
    Relaxed: 'bg-teal-100 text-teal-700',
    Social: 'bg-pink-100 text-pink-700',
    Creative: 'bg-indigo-100 text-indigo-700',
  };

  const filteredUsers = filterMood
    ? users.filter(user => user.mood === filterMood)
    : users;

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
              <Link href="/events" className="px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 font-medium transition-colors">
                Find Events
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-pink-800 mb-2">Community Dashboard</h1>
          <p className="text-pink-600">Discover and connect with people who share your interests</p>
        </div>

        {/* Current User Card */}
        {currentUser && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-pink-700 mb-4">Your Profile</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {currentUser.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-pink-800">{currentUser.name}</h3>
                    <p className="text-pink-600">{currentUser.location}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-pink-500">Current Mood</span>
                    <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${moodColors[currentUser.mood]}`}>
                      {currentUser.mood}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-pink-500">Interests</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {currentUser.interests.map((interest, idx) => (
                        <span key={idx} className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-pink-700 mb-4">Filter by Mood</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilterMood('')}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                filterMood === ''
                  ? 'bg-pink-500 text-white'
                  : 'bg-pink-50 text-pink-600 hover:bg-pink-100'
              }`}
            >
              All
            </button>
            {Object.keys(moodColors).map((mood) => (
              <button
                key={mood}
                onClick={() => setFilterMood(mood)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  filterMood === mood
                    ? 'bg-pink-500 text-white'
                    : 'bg-pink-50 text-pink-600 hover:bg-pink-100'
                }`}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-300 to-pink-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-pink-800">{user.name}</h3>
                    <p className="text-sm text-pink-500">{user.location}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${moodColors[user.mood]}`}>
                  {user.mood}
                </span>
              </div>
              <div className="mb-4">
                <p className="text-sm text-pink-500 mb-2">Interests</p>
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest, idx) => (
                    <span key={idx} className="px-2 py-1 bg-pink-50 text-pink-600 rounded-full text-xs">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-pink-100">
                <span className="text-xs text-pink-400">Active {user.lastActive}</span>
                <button className="px-4 py-2 bg-pink-500 text-white rounded-full text-sm font-medium hover:bg-pink-600 transition-colors">
                  Connect
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-pink-600 text-lg">No users found with this mood filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
