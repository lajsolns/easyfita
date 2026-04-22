/**
 * SMS OTP delivery via Africa's Talking.
 *
 * In development (NODE_ENV=development OR AT_USERNAME=sandbox) the OTP is
 * returned in the API response so you can test without real SMS credits.
 * In production the OTP is ONLY delivered by SMS.
 */

const AT_URL = 'https://api.africastalking.com/version1/messaging';
const AT_SANDBOX_URL = 'https://api.sandbox.africastalking.com/version1/messaging';

export async function sendOtp(phone, code) {
  const isSandbox =
    process.env.AT_USERNAME === 'sandbox' ||
    process.env.NODE_ENV === 'development';

  const message = `Your EasyFITA verification code is: ${code}. Valid for 10 minutes. Do not share this code.`;

  if (isSandbox) {
    // In sandbox mode, log to console and return the code for the UI banner
    console.log(`[EasyFITA OTP] ${phone} → ${code}`);
    return { success: true, devOtp: code };
  }

  try {
    const params = new URLSearchParams({
      username: process.env.AT_USERNAME,
      to: phone,
      message,
    });

    const res = await fetch(AT_URL, {
      method: 'POST',
      headers: {
        apiKey: process.env.AT_API_KEY,
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('Africa\'s Talking error:', text);
      return { success: false, error: 'SMS delivery failed' };
    }

    return { success: true };
  } catch (err) {
    console.error('SMS send error:', err);
    return { success: false, error: err.message };
  }
}
