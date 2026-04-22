import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Attempt to get user session to link the booking to the client
    const session = await getSession();
    let clientId = null;
    
    if (session && session.role === 'CLIENT') {
      clientId = session.userId;
    }

    const {
      name,
      phone,
      email,
      service,
      carMake,
      carModel,
      carYear,
      timeSlot,
      location,
      notes,
    } = body;

    // Basic validation
    if (!name || !phone || !service || !carMake || !carModel || !timeSlot || !location) {
      return NextResponse.json(
        { error: 'Missing required booking fields' },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        clientId,
        name,
        phone,
        email,
        service,
        carMake,
        carModel,
        carYear,
        timeSlot,
        location,
        notes,
      },
    });

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error) {
    console.error('API Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking. Please try again.' },
      { status: 500 }
    );
  }
}
