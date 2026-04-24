import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html }) {
  try {
    const { data, error } = await resend.emails.send({
      // If you haven't verified a domain in Resend yet, 
      // you MUST use 'onboarding@resend.dev' as the sender.
      from: 'EasyFITA <onboarding@resend.dev>', 
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error };
    }

    console.log('Email sent successfully:', data?.id);
    return { success: true, data };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
}
