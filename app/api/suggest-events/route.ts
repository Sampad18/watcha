import { NextRequest, NextResponse } from 'next/server';

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

export async function POST(request: NextRequest) {
  try {
    const { mood, interests, location } = await request.json();

    if (!mood || !interests || !location) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // In production, this would call DeepSeek API to scrape and analyze events
    // For now, we'll return mock data based on the user's mood and interests
    const suggestedEvents = generateMockEvents(mood, interests, location);

    return NextResponse.json({
      success: true,
      events: suggestedEvents,
    });
  } catch (error) {
    console.error('Error suggesting events:', error);
    return NextResponse.json(
      { error: 'Failed to suggest events' },
      { status: 500 }
    );
  }
}

function generateMockEvents(mood: string, interests: string[], location: string): Event[] {
  const eventTemplates = [
    {
      title: 'Community Art Workshop',
      description: 'Join local artists for a creative session. Perfect for expressing yourself and meeting like-minded people.',
      category: 'Art',
      price: 'Free',
      imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
      interests: ['Art', 'Creative', 'Photography'],
      moods: ['Creative', 'Calm', 'Happy'],
    },
    {
      title: 'Live Music Night',
      description: 'Experience amazing local bands and musicians. A great way to unwind and enjoy good company.',
      category: 'Music',
      price: '£15',
      imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
      interests: ['Music', 'Social', 'Dancing'],
      moods: ['Happy', 'Excited', 'Social'],
    },
    {
      title: 'Outdoor Yoga Session',
      description: 'Connect with nature and your body in this peaceful outdoor yoga class.',
      category: 'Fitness',
      price: '£10',
      imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800',
      interests: ['Fitness', 'Yoga', 'Nature'],
      moods: ['Calm', 'Relaxed', 'Happy'],
    },
    {
      title: 'Tech Meetup & Networking',
      description: 'Connect with fellow tech enthusiasts, share ideas, and learn about the latest trends.',
      category: 'Technology',
      price: 'Free',
      imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
      interests: ['Technology', 'Gaming', 'Science'],
      moods: ['Curious', 'Excited', 'Creative'],
    },
    {
      title: 'Food Festival',
      description: 'Taste cuisines from around the world and meet fellow food lovers.',
      category: 'Food',
      price: '£25',
      imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
      interests: ['Food', 'Travel', 'Social'],
      moods: ['Adventurous', 'Happy', 'Social'],
    },
    {
      title: 'Book Club Gathering',
      description: 'Discuss your favorite books and discover new reads with fellow bookworms.',
      category: 'Reading',
      price: 'Free',
      imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800',
      interests: ['Reading', 'Writing', 'Creative'],
      moods: ['Calm', 'Curious', 'Relaxed'],
    },
    {
      title: 'Hiking Adventure',
      description: 'Explore beautiful trails and connect with nature and fellow hikers.',
      category: 'Travel',
      price: 'Free',
      imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
      interests: ['Travel', 'Nature', 'Fitness'],
      moods: ['Adventurous', 'Excited', 'Happy'],
    },
    {
      title: 'Photography Walk',
      description: 'Join fellow photographers for a guided walk and capture beautiful moments.',
      category: 'Photography',
      price: '£5',
      imageUrl: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800',
      interests: ['Photography', 'Art', 'Nature'],
      moods: ['Creative', 'Calm', 'Curious'],
    },
    {
      title: 'Dance Class',
      description: 'Learn new dance moves and have fun with others in this energetic class.',
      category: 'Dancing',
      price: '£12',
      imageUrl: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800',
      interests: ['Dancing', 'Music', 'Fitness'],
      moods: ['Excited', 'Social', 'Happy'],
    },
    {
      title: 'Gaming Tournament',
      description: 'Compete with fellow gamers in this exciting tournament.',
      category: 'Gaming',
      price: '£20',
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      interests: ['Gaming', 'Technology', 'Social'],
      moods: ['Excited', 'Curious', 'Social'],
    },
  ];

  // Filter and score events based on mood and interests
  const scoredEvents = eventTemplates.map((template, index) => {
    let matchScore = 0;
    const matchedInterests: string[] = [];

    // Score based on interests
    interests.forEach((interest) => {
      if (template.interests.some(i => i.toLowerCase() === interest.toLowerCase())) {
        matchScore += 3;
        matchedInterests.push(interest);
      }
    });

    // Score based on mood
    if (template.moods.includes(mood)) {
      matchScore += 2;
    }

    // Add some randomness to simulate AI personalization
    matchScore += Math.random() * 2;

    return {
      ...template,
      id: `event-${index}`,
      date: getRandomDate(),
      time: getRandomTime(),
      location: `${location} City Center`,
      attendees: Math.floor(Math.random() * 50) + 10,
      matchedInterests,
      matchScore: Math.round(matchScore * 10) / 10,
    };
  });

  // Sort by match score and return top matches
  return scoredEvents
    .filter(event => event.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 6);
}

function getRandomDate(): string {
  const dates = ['Tomorrow', 'This Weekend', 'Next Week', 'In 2 Days', 'Friday', 'Saturday'];
  return dates[Math.floor(Math.random() * dates.length)];
}

function getRandomTime(): string {
  const times = ['10:00 AM', '2:00 PM', '6:00 PM', '7:30 PM', '11:00 AM', '3:00 PM'];
  return times[Math.floor(Math.random() * times.length)];
}
