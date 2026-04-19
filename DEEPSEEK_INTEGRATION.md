# DeepSeek API Integration

This document describes how the DeepSeek API is integrated into Watcha for social media scraping and event recommendations.

## Overview

The DeepSeek API is used to:
1. Scrape social media platforms for events
2. Generate personalized event recommendations based on user mood, interests, and location
3. Validate event links before presenting them to users

## Setup

1. Get your DeepSeek API key from [https://platform.deepseek.com/](https://platform.deepseek.com/)
2. Add the API key to your `.env` file:

```env
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

## API Endpoint

The integration is implemented in [`app/api/suggest-events/route.ts`](app/api/suggest-events/route.ts).

### Request

```typescript
POST /api/suggest-events
Content-Type: application/json

{
  "mood": "Happy",
  "interests": ["Music", "Art"],
  "location": "London"
}
```

### Response

```json
{
  "success": true,
  "events": [
    {
      "id": "event-1",
      "title": "Live Music Night",
      "description": "Experience amazing local bands...",
      "date": "Tomorrow",
      "time": "7:30 PM",
      "location": "London City Center",
      "category": "Music",
      "imageUrl": "https://...",
      "price": "£15",
      "attendees": 25,
      "matchedInterests": ["Music"],
      "matchScore": 5.2,
      "sourceUrl": "https://facebook.com/events/...",
      "linkValid": true
    }
  ],
  "source": "DeepSeek AI"
}
```

## Link Validation

Before returning events, the system validates each event's source URL:

```typescript
async function validateLink(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}
```

Events with invalid links are filtered out before being presented to users.

## Fallback Behavior

If the DeepSeek API is unavailable or returns no results, the system falls back to mock data to ensure users always receive event recommendations.

## Prompt Engineering

The system uses a carefully crafted prompt to guide DeepSeek's responses:

```
You are an AI event discovery assistant. Based on the following user profile, 
suggest real events from social media platforms (Facebook Events, Eventbrite, Meetup, etc.):

User Profile:
- Mood: {mood}
- Interests: {interests}
- Location: {location}

Please search for and suggest 5-8 real events that match this profile...
```

## Error Handling

The API handles various error scenarios:
- Missing API key: Falls back to mock data
- API errors: Logs error and falls back to mock data
- Invalid JSON responses: Parses error and returns empty array
- Network timeouts: Uses 5-second timeout for link validation

## Rate Limiting

When implementing in production, consider:
- Implementing rate limiting for API calls
- Caching responses to reduce API usage
- Using a queue system for high-traffic scenarios
