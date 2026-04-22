'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../auth.module.css';

export default function SignupClient() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devOtp, setDevOtp] = useState(''); // For sandbox testing

  // Form state
  const [formData, setFormData] = useState({
    role: '',
    name: '',
    phone: '',
    // Client specific
    carMake: '',
    carModel: '',
    carYear: '',
    // Mechanic specific
    specialty: '',
    experience: '',
    location: '',
  });
  const [otpCode, setOtpCode] = useState('');

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
    setStep(2);
    setError('');
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // send-otp only strictly needs phone, but we'll collect all for verify mode later
        body: JSON.stringify({ phone: formData.phone }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');

      if (data.devOtp) setDevOtp(data.devOtp); // Sandbox mode
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, code: otpCode }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');

      if (formData.role === 'CLIENT') {
        router.push('/dashboard');
      } else {
        router.push('/dashboard'); // Mechanic dashboard handles PENDING state
      }
      router.refresh(); // Update nav bar state
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
          <h2>Create Account</h2>
          <p>Join EasyFITA today.</p>
        </div>

        {error && <div className={styles.errorAlert}>{error}</div>}

        {step === 1 && (
          <div className={styles.roleSelection}>
            <button
              className={styles.roleCard}
              onClick={() => handleRoleSelect('CLIENT')}
            >
              <div className={styles.roleIcon}>🚗</div>
              <h3>I'm a Car Owner</h3>
              <p>Book mechanics and roadside assistance.</p>
            </button>

            <button
              className={styles.roleCard}
              onClick={() => handleRoleSelect('MECHANIC')}
            >
              <div className={styles.roleIcon}>🔧</div>
              <h3>I'm a Mechanic</h3>
              <p>Get listed and find new jobs nearby.</p>
            </button>
            <p className={styles.authSwitch}>
              Already have an account? <Link href="/auth/login">Log In</Link>
            </p>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleDetailsSubmit} className={styles.authForm}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                required
                className="input"
                placeholder="Kwame Mensah"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                required
                className="input"
                placeholder="0244123456"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            {formData.role === 'CLIENT' && (
              <div className={styles.optionalSection}>
                <p className={styles.sectionTitle}>Car Details (Optional)</p>
                <div className={styles.grid2}>
                  <div className="form-group">
                    <input
                      type="text"
                      className="input"
                      placeholder="Make (e.g. Toyota)"
                      value={formData.carMake}
                      onChange={(e) => setFormData({ ...formData, carMake: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      className="input"
                      placeholder="Model (e.g. Corolla)"
                      value={formData.carModel}
                      onChange={(e) => setFormData({ ...formData, carModel: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.role === 'MECHANIC' && (
              <>
                <div className="form-group">
                  <label>Specialty</label>
                  <select
                    required
                    className="input"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  >
                    <option value="">Select Specialty...</option>
                    <option value="Engine & Gearbox">Engine & Gearbox</option>
                    <option value="Diagnostics & Electrical">Diagnostics & Electrical</option>
                    <option value="Brakes & Suspension">Brakes & Suspension</option>
                    <option value="Battery & AC">Battery & AC</option>
                    <option value="Mobile Mechanic (All)">Mobile Mechanic (All)</option>
                    <option value="Tyres & Wheels">Tyres & Wheels</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Experience</label>
                  <input
                    type="text"
                    required
                    className="input"
                    placeholder="e.g. 5 years"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Location Area</label>
                  <input
                    type="text"
                    required
                    className="input"
                    placeholder="e.g. East Legon, Accra"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '16px' }}>
              {loading ? 'Sending OTP...' : 'Continue'}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              style={{ width: '100%', marginTop: '8px' }}
              onClick={() => setStep(1)}
            >
              Back
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleVerifySubmit} className={styles.authForm}>
            <div className={styles.otpMessage}>
              We sent a 6-digit code to <strong>{formData.phone}</strong>
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
              {loading ? 'Verifying...' : 'Verify & Create Account'}
            </button>

            <button
              type="button"
              className="btn btn-ghost"
              style={{ width: '100%', marginTop: '8px', fontSize: '12px' }}
              onClick={handleDetailsSubmit}
              disabled={loading}
            >
              Resend Code
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
