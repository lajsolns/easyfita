'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './book.module.css';

const serviceOptions = [
  'Car Repairs & Maintenance',
  'Mobile Mechanic Service',
  'Emergency Roadside Assistance',
  'Battery Jumpstart',
  'Battery Replacement',
  'Oil Change',
  'Vehicle Diagnostics',
  'Other (please specify in notes)',
];

const timeSlots = [
  'As soon as possible (Emergency)',
  'Within 2 hours',
  'Today (morning)',
  'Today (afternoon)',
  'Today (evening)',
  'Tomorrow (morning)',
  'Tomorrow (afternoon)',
  'Schedule for another day',
];

export default function BookPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    carMake: '',
    carModel: '',
    carYear: '',
    location: '',
    timeSlot: '',
    notes: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit booking.');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isStep1Valid = form.name && form.phone && form.service;
  const isStep2Valid = form.carMake && form.carModel && form.location && form.timeSlot;

  if (submitted) {
    return (
      <div className={styles.bookPage}>
        <div className={`container ${styles.successContainer}`}>
          <div className={styles.successCard}>
            <div className={styles.successIcon}>🎉</div>
            <h2 className={styles.successTitle}>Booking Confirmed!</h2>
            <p className={styles.successText}>
              Thank you, <strong>{form.name}</strong>! We've received your booking for <strong>{form.service}</strong>.
              Our team will call you at <strong>{form.phone}</strong> within 15 minutes to confirm your appointment.
            </p>
            <div className={styles.successDetails}>
              <div className={styles.successDetailItem}>
                <span>📍 Location</span>
                <span>{form.location}</span>
              </div>
              <div className={styles.successDetailItem}>
                <span>⏰ Time</span>
                <span>{form.timeSlot}</span>
              </div>
              <div className={styles.successDetailItem}>
                <span>🚗 Vehicle</span>
                <span>{form.carMake} {form.carModel} {form.carYear}</span>
              </div>
            </div>
            <div className={styles.successActions}>
              <a href="https://wa.me/233557776271?text=I%20just%20booked%20a%20service%20on%20EasyFITA.%20My%20name%20is%20" target="_blank" rel="noopener noreferrer" className="btn btn-primary" id="success-whatsapp-btn">
                💬 Message Us on WhatsApp
              </a>
              <Link href="/" className="btn btn-ghost" id="success-home-btn">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.bookPage}>
      {/* Header */}
      <section className={styles.bookHero}>
        <div className={styles.bookHeroBg} />
        <div className={`container ${styles.bookHeroContent}`}>
          <span className="badge">📅 Book Online</span>
          <h1 className={styles.bookTitle}>Book a Certified Mechanic</h1>
          <p className={styles.bookSubtitle}>
            Fill out the form below. We'll confirm your booking within 15 minutes and dispatch a mechanic to your location.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="section-sm">
        <div className="container">
          <div className={styles.bookLayout}>
            {/* Progress */}
            <div className={styles.progressBar}>
              {[1, 2, 3].map((s) => (
                <div key={s} className={`${styles.progressStep} ${step >= s ? styles.progressActive : ''} ${step > s ? styles.progressDone : ''}`}>
                  <div className={styles.progressDot}>
                    {step > s ? '✓' : s}
                  </div>
                  <span className={styles.progressLabel}>
                    {s === 1 ? 'Your Details' : s === 2 ? 'Vehicle & Location' : 'Review & Submit'}
                  </span>
                </div>
              ))}
              <div className={styles.progressLine} />
            </div>

            <form onSubmit={handleSubmit} className={styles.bookForm} id="booking-form">
              {/* Step 1 */}
              {step === 1 && (
                <div className={styles.stepContent}>
                  <h2 className={styles.stepTitle}>Your Details</h2>
                  <p className={styles.stepSubtitle}>Tell us about yourself and the service you need.</p>

                  <div className={styles.formGrid}>
                    <div className="form-group">
                      <label htmlFor="name">Full Name *</label>
                      <input id="name" name="name" type="text" placeholder="e.g. Kwame Asante" value={form.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number *</label>
                      <input id="phone" name="phone" type="tel" placeholder="e.g. 0244567890" value={form.phone} onChange={handleChange} required />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label htmlFor="email">Email (optional)</label>
                      <input id="email" name="email" type="email" placeholder="your@email.com" value={form.email} onChange={handleChange} />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label htmlFor="service">Service Required *</label>
                      <select id="service" name="service" value={form.service} onChange={handleChange} required>
                        <option value="">— Select a service —</option>
                        {serviceOptions.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className={styles.stepActions}>
                    <button type="button" className="btn btn-primary" onClick={handleNext} disabled={!isStep1Valid} id="step1-next-btn">
                      Next Step →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div className={styles.stepContent}>
                  <h2 className={styles.stepTitle}>Vehicle & Location</h2>
                  <p className={styles.stepSubtitle}>Where are you and what are you driving?</p>

                  <div className={styles.formGrid}>
                    <div className="form-group">
                      <label htmlFor="carMake">Car Make *</label>
                      <input id="carMake" name="carMake" type="text" placeholder="e.g. Toyota" value={form.carMake} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="carModel">Car Model *</label>
                      <input id="carModel" name="carModel" type="text" placeholder="e.g. Camry" value={form.carModel} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="carYear">Year</label>
                      <input id="carYear" name="carYear" type="text" placeholder="e.g. 2018" value={form.carYear} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="timeSlot">Preferred Time *</label>
                      <select id="timeSlot" name="timeSlot" value={form.timeSlot} onChange={handleChange} required>
                        <option value="">— Select time —</option>
                        {timeSlots.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label htmlFor="location">Your Location / Address *</label>
                      <input id="location" name="location" type="text" placeholder="e.g. East Legon, near Trasacco Valley" value={form.location} onChange={handleChange} required />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label htmlFor="notes">Additional Notes</label>
                      <textarea id="notes" name="notes" placeholder="Describe the issue, special instructions, landmark, etc." value={form.notes} onChange={handleChange} />
                    </div>
                  </div>

                  <div className={styles.stepActions}>
                    <button type="button" className="btn btn-ghost" onClick={handleBack} id="step2-back-btn">
                      ← Back
                    </button>
                    <button type="button" className="btn btn-primary" onClick={handleNext} disabled={!isStep2Valid} id="step2-next-btn">
                      Review Booking →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <div className={styles.stepContent}>
                  <h2 className={styles.stepTitle}>Review Your Booking</h2>
                  <p className={styles.stepSubtitle}>Check your details before confirming.</p>

                  {error && <div className={styles.errorAlert} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '12px 16px', borderRadius: 8, marginBottom: 16, border: '1px solid rgba(239,68,68,0.3)' }}>{error}</div>}

                  <div className={styles.reviewGrid}>
                    <div className={styles.reviewSection}>
                      <h4>👤 Your Details</h4>
                      <div className={styles.reviewItem}><span>Name</span><span>{form.name}</span></div>
                      <div className={styles.reviewItem}><span>Phone</span><span>{form.phone}</span></div>
                      {form.email && <div className={styles.reviewItem}><span>Email</span><span>{form.email}</span></div>}
                      <div className={styles.reviewItem}><span>Service</span><span>{form.service}</span></div>
                    </div>
                    <div className={styles.reviewSection}>
                      <h4>🚗 Vehicle & Location</h4>
                      <div className={styles.reviewItem}><span>Vehicle</span><span>{form.carMake} {form.carModel} {form.carYear}</span></div>
                      <div className={styles.reviewItem}><span>Time</span><span>{form.timeSlot}</span></div>
                      <div className={styles.reviewItem}><span>Location</span><span>{form.location}</span></div>
                      {form.notes && <div className={styles.reviewItem}><span>Notes</span><span>{form.notes}</span></div>}
                    </div>
                  </div>

                  <div className={styles.reviewNote}>
                    <p>📞 We'll call you at <strong>{form.phone}</strong> within 15 minutes to confirm your booking and provide an upfront price quote.</p>
                  </div>

                  <div className={styles.stepActions}>
                    <button type="button" className="btn btn-ghost" onClick={handleBack} id="step3-back-btn" disabled={loading}>
                      ← Edit
                    </button>
                    <button type="submit" className="btn btn-primary btn-lg" id="submit-booking-btn" disabled={loading}>
                      {loading ? 'Confirming...' : '✅ Confirm Booking'}
                    </button>
                  </div>
                </div>
              )}
            </form>

            {/* Sidebar */}
            <div className={styles.bookSidebar}>
              <div className={styles.sidebarCard}>
                <h3>🚨 Need Emergency Help?</h3>
                <p>Don't wait — call us directly for immediate roadside assistance.</p>
                <a href="tel:0556920199" className="btn btn-accent" id="sidebar-call-btn" style={{ width: '100%' }}>
                  📞 Call: 0556920199
                </a>
                <a href="https://wa.me/233557776271" target="_blank" rel="noopener noreferrer" className="btn btn-ghost" id="sidebar-whatsapp-btn" style={{ width: '100%', marginTop: 8 }}>
                  💬 WhatsApp: 0557776271
                </a>
              </div>

              <div className={styles.sidebarCard}>
                <h3>✅ Our Guarantee</h3>
                <ul className={styles.guaranteeList}>
                  <li>📞 Callback within 15 minutes</li>
                  <li>⏱️ Mechanic in 30–60 minutes</li>
                  <li>💰 Upfront pricing — no surprises</li>
                  <li>🛡️ Certified mechanics only</li>
                  <li>✔️ Pay after service is done</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
