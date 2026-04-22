'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../auth.module.css';

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/dashboard';

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devOtp, setDevOtp] = useState('');

  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');

      if (data.devOtp) setDevOtp(data.devOtp);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: otpCode }), // For login, we only need phone + code
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');

      // Admin user check
      if (data.user?.isAdmin) {
         router.push('/admin');
      } else {
         router.push(returnTo);
      }
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h2>Welcome Back</h2>
          <p>Login to your account.</p>
        </div>

        {error && <div className={styles.errorAlert}>{error}</div>}

        {step === 1 && (
          <form onSubmit={handleSendOtp} className={styles.authForm}>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                required
                className="input"
                placeholder="0244123456"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '8px' }}>
              {loading ? 'Sending OTP...' : 'Send Verification Code'}
            </button>

            <p className={styles.authSwitch}>
              Don't have an account? <Link href="/auth/signup">Sign Up</Link>
            </p>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className={styles.authForm}>
             <div className={styles.otpMessage}>
              We sent a 6-digit code to <strong>{phone}</strong>
             </div>

             {devOtp && (
              <div className={styles.devBanner}>
                🧪 <strong>Sandbox Mode:</strong> Your OTP is <code style={{fontSize: 20, fontWeight:'bold', letterSpacing:2, margin:'0 4px'}}>{devOtp}</code>
              </div>
            )}

            <div className="form-group">
              <input
                type="text"
                required
                className="input"
                placeholder="Enter 6-digit OTP"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                style={{ textAlign: 'center', fontSize: '1.2rem', letterSpacing: '4px', fontWeight: 'bold' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading || otpCode.length < 6} style={{ width: '100%' }}>
              {loading ? 'Verifying...' : 'Log In'}
            </button>

            <button
               type="button"
               className="btn btn-ghost"
               style={{ width: '100%', marginTop: '8px', fontSize: '12px' }}
               onClick={() => setStep(1)}
            >
               Change Phone Number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
