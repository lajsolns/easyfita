import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const { name, phone, subject, message } = await request.json();

    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: 'Missing required contact fields' },
        { status: 400 }
      );
    }

    // Send email notification to admin
    const emailResult = await sendEmail({
      to: process.env.ADMIN_EMAIL || 'ez.fita@gmail.com',
      subject: `New Contact Message: ${subject || 'General Inquiry'} - ${name}`,
      html: `
        <div style="font-family: sans-serif; padding: 24px; color: #333;">
          <h2 style="color: #FF6B00;">New Contact Message Received</h2>
          <p>Someone has reached out via the contact form on EasyFITA.</p>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #FF6B00; margin: 20px 0;">
            <p><strong>From:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
            <hr style="border: 0; border-top: 1px solid #ddd; margin: 15px 0;" />
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          
          <p style="color: #666; font-size: 14px;">Please reply as soon as possible.</p>
        </div>
      `,
    });

    if (!emailResult.success) {
      // Logic for if email fails (though we still return success to user for better UX)
      console.warn('Contact email failed but returning success to user.');
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('API Error in contact route:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
     );
  }
}
