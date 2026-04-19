# Watcha - Features Documentation

## Overview

Watcha is an AI-powered social connection platform that helps users discover events and connect with like-minded people based on their mood, interests, and location.

## New Features

### 1. Enhanced User Profile

The landing page now collects comprehensive user information:

**Required Fields:**
- **Name**: User's full name
- **Location**: User's city/location
- **Mood**: Current emotional state (Happy, Calm, Excited, Curious, Adventurous, Relaxed, Social, Creative)
- **Interests**: Selection from predefined categories or custom interests

**Optional Fields:**
- **Age**: User's age
- **Occupation**: User's profession or occupation
- **Social Status**: Relationship status (Single, In a relationship, Married, Prefer not to say)
- **Pincode**: Postal/ZIP code for more precise location matching

### 2. User Registration & Storage

**API Endpoint:** `POST /api/register-user`

The system saves user profiles using:
- **Client-side**: localStorage for demo purposes
- **Server-side**: API route ready for database integration

**User Data Structure:**
```typescript
{
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
```

### 3. DeepSeek AI Integration

**API Endpoint:** `POST /api/suggest-events`

The DeepSeek API provides:
- **Social Media Scraping**: Searches Facebook Events, Eventbrite, Meetup, etc.
- **Personalized Recommendations**: Events matched to user's mood and interests
- **Location-Based Results**: Events in user's specified location

**Setup:**
1. Get API key from [https://platform.deepseek.com/](https://platform.deepseek.com/)
2. Add to `.env` file: `DEEPSEEK_API_KEY=your_key_here`

### 4. Link Validation

Before presenting events to users, the system:
1. Validates each event's source URL
2. Uses 5-second timeout for each validation
3. Filters out events with broken or invalid links
4. Ensures users only receive actionable event recommendations

**Validation Process:**
```typescript
async function validateLink(url: string): Promise<boolean> {
  const response = await fetch(url, {
    method: 'HEAD',
    signal: AbortSignal.timeout(5000)
  });
  return response.ok;
}
```

### 5. Enhanced Dashboard

The dashboard now displays:
- **User Statistics**: Total users, active users, mood distribution
- **User Profiles**: Complete user information including:
  - Name, occupation, age
  - Social status, pincode, location
  - Current mood badge
  - Interest tags
  - Join date/time
- **Filtering**: Filter users by mood
- **Real-time Updates**: Loads users from API and localStorage

**Dashboard Features:**
- View all registered users
- Filter by mood to find like-minded people
- See user interests and demographics
- Connect with other users
- Track user activity over time

### 6. Event Recommendations

**API Endpoint:** `POST /api/suggest-events`

The system provides:
- **AI-Powered Matching**: Events scored based on mood and interests
- **Multiple Sources**: Social media platforms + mock fallback
- **Validated Links**: All event URLs are checked before display
- **Match Scores**: Shows how well each event matches user preferences

**Event Data Structure:**
```typescript
{
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
```

## User Flow

1. **Registration**: User fills profile on landing page
2. **Event Discovery**: System suggests events based on mood, interests, location
3. **Link Validation**: All event links are validated before display
4. **Dashboard**: User can view community and connect with others
5. **Continuous Learning**: User data helps improve recommendations

## Technical Implementation

### Frontend (Next.js + React)
- **State Management**: React hooks for form state and user data
- **Navigation**: Next.js App Router for page navigation
- **Styling**: Tailwind CSS for responsive design
- **Storage**: localStorage for demo user data

### Backend (Next.js API Routes)
- **User Registration**: [`/api/register-user`](app/api/register-user/route.ts)
- **Event Suggestions**: [`/api/suggest-events`](app/api/suggest-events/route.ts)
- **DeepSeek Integration**: Direct API calls with prompt engineering
- **Link Validation**: Async fetch with timeout handling

### Data Flow

```
User Input → Landing Page Form → localStorage + API
                                    ↓
                            Event Suggestions API
                                    ↓
                            DeepSeek AI + Mock Data
                                    ↓
                            Link Validation
                                    ↓
                            Validated Events Display
                                    ↓
                            Dashboard (User Tracking)
```

## Security Considerations

- **API Keys**: Stored in environment variables, never exposed to client
- **Input Validation**: All user inputs are validated on server
- **Link Validation**: Prevents malicious links from being displayed
- **Privacy**: Optional fields allow users to control data sharing

## Future Enhancements

1. **Database Integration**: Replace localStorage with PostgreSQL/MongoDB
2. **Authentication**: Add user login and session management
3. **Real-time Updates**: WebSocket integration for live event updates
4. **Social Sharing**: Allow users to share events on social media
5. **Event RSVP**: Track event attendance and send reminders
6. **Advanced Matching**: Machine learning for better recommendations
7. **Multi-language Support**: Internationalization for global users
8. **Mobile App**: React Native app for iOS and Android

## Troubleshooting

### DeepSeek API Not Working
- Verify API key is set in `.env` file
- Check API key has sufficient credits
- Review console logs for error messages
- System will fall back to mock data if API fails

### Link Validation Issues
- Check network connectivity
- Verify event URLs are accessible
- Some platforms may block HEAD requests
- System will still show events with unvalidated links

### Dashboard Not Loading Users
- Check browser localStorage is enabled
- Verify API endpoint is accessible
- Review browser console for errors
- Mock users are provided as fallback

## API Reference

### Register User
```
POST /api/register-user
Content-Type: application/json

{
  "name": "John Doe",
  "occupation": "Developer",
  "age": "30",
  "socialStatus": "Single",
  "pincode": "12345",
  "location": "London",
  "mood": "Happy",
  "interests": ["Music", "Technology"]
}
```

### Get Users
```
GET /api/register-user?mood=Happy
```

### Suggest Events
```
POST /api/suggest-events
Content-Type: application/json

{
  "mood": "Happy",
  "interests": ["Music", "Art"],
  "location": "London"
}
```
