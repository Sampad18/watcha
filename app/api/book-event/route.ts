import { NextRequest, NextResponse } from 'next/server';

interface BookingRequest {
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
}

interface Booking {
  id: string;
  bookingId: string;
  eventId: string;
  userId: string;
  event: BookingRequest['event'];
  bookedAt: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

// In-memory storage for bookings (in production, use a database)
const bookings: Booking[] = [];

// Generate a unique booking ID
function generateBookingId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `BK${timestamp}${random}`.toUpperCase();
}

export async function POST(request: NextRequest) {
  try {
    const body: BookingRequest = await request.json();
    const { eventId, userId, event } = body;

    // Validate required fields
    if (!eventId || !userId || !event) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already booked this event
    const existingBooking = bookings.find(
      b => b.eventId === eventId && b.userId === userId && b.status === 'confirmed'
    );

    if (existingBooking) {
      return NextResponse.json(
        { success: false, error: 'You have already booked this event' },
        { status: 409 }
      );
    }

    // Create new booking
    const booking: Booking = {
      id: Date.now().toString(),
      bookingId: generateBookingId(),
      eventId,
      userId,
      event,
      bookedAt: new Date().toISOString(),
      status: 'confirmed',
    };

    // Save booking
    bookings.push(booking);

    // Also save to localStorage-compatible format for client-side access
    const existingBookings = JSON.parse(
      process.env.BOOKINGS_STORAGE || '[]'
    ) as Booking[];
    existingBookings.push(booking);
    // Note: In production, this would be saved to a database

    return NextResponse.json({
      success: true,
      bookingId: booking.bookingId,
      booking,
      message: 'Event booked successfully',
    });
  } catch (error) {
    console.error('Error booking event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to book event' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve booking details
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const bookingId = searchParams.get('bookingId');

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    const booking = bookings.find(b => b.bookingId === bookingId);

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error('Error retrieving booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve booking' },
      { status: 500 }
    );
  }
}
