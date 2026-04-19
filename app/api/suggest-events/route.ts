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
  sourceUrl?: string;
  linkValid?: boolean;
}

// Link validation function
async function validateLink(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });
    return response.ok;
  } catch (error) {
    console.error(`Link validation failed for ${url}:`, error);
    return false;
  }
}

// DeepSeek API integration for social media scraping
async function scrapeSocialMediaEvents(
  mood: string,
  interests: string[],
  location: string
): Promise<Event[]> {
  const deepSeekApiKey = process.env.DEEPSEEK_API_KEY;
  
  if (!deepSeekApiKey) {
    console.warn('DeepSeek API key not found, using mock data');
    return [];
  }

  try {
    const prompt = `
      You are an AI event discovery assistant. Based on the following user profile, suggest real events from social media platforms (Facebook Events, Eventbrite, Meetup, etc.):

      User Profile:
      - Mood: ${mood}
      - Interests: ${interests.join(', ')}
      - Location: ${location}

      Please search for and suggest 5-8 real events that match this profile. For each event, provide:
      1. Title
      2. Description
      3. Category (Music, Art, Sports, Technology, Food, Travel, Gaming, Photography, Reading, Fitness, Dancing, Movies)
      4. Estimated date (relative like "Tomorrow", "This Weekend", "Next Week")
      5. Estimated time
      6. Location (within ${location})
      7. Price range
      8. Source URL (actual event page URL)
      9. Image URL (or placeholder)

      Format your response as a JSON array of events with these exact fields.
      Only include events that are actually happening in ${location} and match the user's mood and interests.
    `;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${deepSeekApiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are an AI assistant that helps discover events from social media platforms. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from DeepSeek');
    }

    // Parse the JSON response
    let events: Event[] = [];
    try {
      events = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse DeepSeek response:', content);
      return [];
    }

    // Validate links before returning events
    const validatedEvents = await Promise.all(
      events.map(async (event) => {
        const isValid = event.sourceUrl ? await validateLink(event.sourceUrl) : true;
        return { ...event, linkValid: isValid };
      })
    );

    // Filter out events with invalid links
    return validatedEvents.filter(event => event.linkValid !== false);
  } catch (error) {
    console.error('Error calling DeepSeek API:', error);
    return [];
  }
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

    // Try to get events from DeepSeek API
    let suggestedEvents = await scrapeSocialMediaEvents(mood, interests, location);

    // If DeepSeek returns no events or fails, fall back to mock data
    if (suggestedEvents.length === 0) {
      console.log('Using mock events as fallback');
      suggestedEvents = generateMockEvents(mood, interests, location);
    }

    return NextResponse.json({
      success: true,
      events: suggestedEvents,
      source: suggestedEvents[0]?.sourceUrl ? 'DeepSeek AI' : 'Mock Data',
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
