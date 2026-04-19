'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [mood, setMood] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState('');
  
  // New user profile fields
  const [name, setName] = useState('');
  const [occupation, setOccupation] = useState('');
  const [age, setAge] = useState('');
  const [socialStatus, setSocialStatus] = useState('');
  const [pincode, setPincode] = useState('');
  const [location, setLocation] = useState('');

  const predefinedInterests = [
    'Music', 'Art', 'Sports', 'Technology', 'Food', 'Travel',
    'Gaming', 'Photography', 'Reading', 'Fitness', 'Dancing', 'Movies'
  ];

  const toggleInterest = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const addCustomInterest = () => {
    if (customInterest && !interests.includes(customInterest)) {
      setInterests([...interests, customInterest]);
      setCustomInterest('');
    }
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!name || !mood || interests.length === 0 || !location) {
      alert('Please fill in all required fields: Name, Mood, Interests, and Location');
      return;
    }

    // Create user profile object
    const userProfile = {
      id: Date.now().toString(),
      name,
      occupation,
      age,
      socialStatus,
      pincode,
      location,
      mood,
      interests,
      joinedAt: new Date().toISOString(),
    };

    // Save to localStorage
    const existingUsers = JSON.parse(localStorage.getItem('watcha_users') || '[]');
    existingUsers.push(userProfile);
    localStorage.setItem('watcha_users', JSON.stringify(existingUsers));
    localStorage.setItem('watcha_current_user', JSON.stringify(userProfile));

    // Navigate to events page with user data
    router.push(`/events?mood=${encodeURIComponent(mood)}&interests=${encodeURIComponent(interests.join(','))}&location=${encodeURIComponent(location)}`);
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
              <Link href="/ai-chat" className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 font-medium transition-all">
                🤖 AI Assistant
              </Link>
              <Link href="/events" className="px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 font-medium transition-colors">
                Find Events
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-pink-800 mb-6">
            Connect Through <span className="text-pink-500">Shared Moments</span>
          </h1>
          <p className="text-xl text-pink-700 mb-8">
            AI-powered social discovery that matches you with events and people who share your mood and interests
          </p>
        </div>
      </section>

      {/* Mood & Interest Input Section */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-pink-700 mb-6 text-center">
            Tell us about yourself
          </h2>

          {/* Personal Information */}
          <div className="mb-8">
            <label className="block text-lg font-medium text-pink-600 mb-4">Personal Information</label>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-pink-500 mb-2">Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500 text-pink-700"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pink-500 mb-2">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500 text-pink-700"
                  placeholder="Your age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pink-500 mb-2">Occupation</label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500 text-pink-700"
                  placeholder="Your occupation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pink-500 mb-2">Social Status</label>
                <select
                  value={socialStatus}
                  onChange={(e) => setSocialStatus(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500 text-pink-700 bg-white"
                >
                  <option value="">Select status</option>
                  <option value="Single">Single</option>
                  <option value="In a relationship">In a relationship</option>
                  <option value="Married">Married</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-pink-500 mb-2">Location *</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500 text-pink-700"
                  placeholder="Your city"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pink-500 mb-2">Pincode</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500 text-pink-700"
                  placeholder="Your pincode"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-pink-100 pt-8 mb-8">
            <h3 className="text-2xl font-bold text-pink-700 mb-6 text-center">
              How are you feeling today?
            </h3>
          </div>

          {/* Mood Selection */}
          <div className="mb-8">
            <label className="block text-lg font-medium text-pink-600 mb-4">Select your mood</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Happy', 'Calm', 'Excited', 'Curious', 'Adventurous', 'Relaxed', 'Social', 'Creative'].map((m) => (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  className={`py-3 px-4 rounded-full font-medium transition-all ${
                    mood === m
                      ? 'bg-pink-500 text-white shadow-lg scale-105'
                      : 'bg-pink-50 text-pink-600 hover:bg-pink-100'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Interest Selection */}
          <div className="mb-8">
            <label className="block text-lg font-medium text-pink-600 mb-4">Select your interests</label>
            <div className="flex flex-wrap gap-3 mb-4">
              {predefinedInterests.map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`py-2 px-4 rounded-full font-medium transition-all ${
                    interests.includes(interest)
                      ? 'bg-pink-500 text-white'
                      : 'bg-pink-50 text-pink-600 hover:bg-pink-100'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomInterest()}
                placeholder="Add custom interest..."
                className="flex-1 px-4 py-2 border-2 border-pink-200 rounded-full focus:outline-none focus:border-pink-500 text-pink-700"
              />
              <button
                onClick={addCustomInterest}
                className="px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 font-medium transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleSubmit}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-xl font-bold rounded-full hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
          >
            Discover Events for You
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-pink-800 text-center mb-12">
            Why Watcha?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-pink-700 mb-2">Smart Matching</h3>
              <p className="text-pink-600">AI-powered recommendations based on your mood, interests, and preferences</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">👥</span>
              </div>
              <h3 className="text-xl font-bold text-pink-700 mb-2">Community Dashboard</h3>
              <p className="text-pink-600">Connect with like-minded people and see what others are interested in</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">🌟</span>
              </div>
              <h3 className="text-xl font-bold text-pink-700 mb-2">Curated Events</h3>
              <p className="text-pink-600">Discover events from social platforms tailored just for you</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-pink-800 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-pink-200">© 2024 Watcha. Connecting people through shared experiences.</p>
        </div>
      </footer>
    </div>
  );
}
