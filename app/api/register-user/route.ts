import { NextRequest, NextResponse } from 'next/server';

interface UserProfile {
  id: string;
  name: string;
  occupation?: string;
  age?: string;
  socialStatus?: string;
  pincode?: string;
  location: string;
  mood: string;
  interests: string[];
  joinedAt: string;
}

export async function POST(request: NextRequest) {
  try {
    const userData: UserProfile = await request.json();

    // Validate required fields
    if (!userData.name || !userData.location || !userData.mood || !userData.interests || userData.interests.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: name, location, mood, and interests are required' },
        { status: 400 }
      );
    }

    // In a production environment, this would save to a database
    // For demo purposes, we'll return success with the user data
    // The actual storage is handled on the client side using localStorage

    return NextResponse.json({
      success: true,
      user: {
        ...userData,
        id: userData.id || Date.now().toString(),
        joinedAt: userData.joinedAt || new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve all users (for dashboard)
export async function GET(request: NextRequest) {
  try {
    // In production, this would query a database
    // For demo, we'll return mock data combined with any data from request
    
    const searchParams = request.nextUrl.searchParams;
    const moodFilter = searchParams.get('mood');

    // Mock users for demo purposes
    const mockUsers: UserProfile[] = [
      {
        id: '1',
        name: 'Sarah Chen',
        occupation: 'Designer',
        age: '28',
        socialStatus: 'Single',
        pincode: 'SW1A 1AA',
        location: 'London',
        mood: 'Happy',
        interests: ['Music', 'Art', 'Photography'],
        joinedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: '2',
        name: 'Alex Rivera',
        occupation: 'Developer',
        age: '32',
        socialStatus: 'In a relationship',
        pincode: 'M1 4BT',
        location: 'Manchester',
        mood: 'Excited',
        interests: ['Sports', 'Fitness', 'Technology'],
        joinedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
      {
        id: '3',
        name: 'Jordan Lee',
        occupation: 'Writer',
        age: '26',
        socialStatus: 'Single',
        pincode: 'B1 1AA',
        location: 'Birmingham',
        mood: 'Calm',
        interests: ['Reading', 'Meditation', 'Nature'],
        joinedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
      {
        id: '4',
        name: 'Emma Wilson',
        occupation: 'Student',
        age: '22',
        socialStatus: 'Single',
        pincode: 'EH1 1AA',
        location: 'Edinburgh',
        mood: 'Curious',
        interests: ['Technology', 'Gaming', 'Science'],
        joinedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      },
      {
        id: '5',
        name: 'Marcus Johnson',
        occupation: 'Musician',
        age: '35',
        socialStatus: 'Married',
        pincode: 'NW1 6XE',
        location: 'London',
        mood: 'Social',
        interests: ['Music', 'Dancing', 'Food'],
        joinedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      },
      {
        id: '6',
        name: 'Lisa Park',
        occupation: 'Photographer',
        age: '29',
        socialStatus: 'In a relationship',
        pincode: 'BS1 1AA',
        location: 'Bristol',
        mood: 'Adventurous',
        interests: ['Travel', 'Photography', 'Food'],
        joinedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      },
    ];

    let filteredUsers = mockUsers;
    if (moodFilter) {
      filteredUsers = mockUsers.filter(user => user.mood === moodFilter);
    }

    return NextResponse.json({
      success: true,
      users: filteredUsers,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
