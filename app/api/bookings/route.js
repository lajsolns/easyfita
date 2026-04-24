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

    // Send email notification to admin
    try {
      const { sendEmail } = await import('@/lib/email');
      await sendEmail({
        to: 'ezfita@gmail.com',
        subject: `New Booking: ${service} - ${name}`,
        html: `
          <div style="font-family: sans-serif; padding: 24px; color: #333;">
            <h2 style="color: #0057FF;">New Booking Received</h2>
            <p>A new service booking has been made on EasyFITA.</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Customer Name:</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Phone Number:</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${email || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Service Needed:</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${service}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Vehicle:</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${carYear || ''} ${carMake} ${carModel}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Preferred Time:</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${timeSlot}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Location:</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${location}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Additional Notes:</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${notes || 'None'}</td>
              </tr>
            </table>
            
            <div style="margin-top: 30px; padding: 16px; background: #f0f7ff; border-radius: 8px;">
               <p style="margin: 0;">Access the admin panel to manage this booking.</p>
            </div>
          </div>
        `,
      });
    } catch (e) {
      console.error('Failed to send booking email notification:', e);
      // We don't fail the request if email fails, but we log it
    }

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error) {
    console.error('API Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking. Please try again.' },
      { status: 500 }
    );
  }
}
