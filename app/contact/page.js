'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './contact.module.css';

const contactMethods = [
  {
    icon: '📞',
    title: 'Call Us',
    value: '0556920199',
    sub: 'Mon–Sun, 6am–10pm',
    action: 'tel:0556920199',
    actionLabel: 'Call Now',
    id: 'contact-call-card',
  },
  {
    icon: '💬',
    title: 'WhatsApp',
    value: '0557776271',
    sub: 'Quick replies, 24/7',
    action: 'https://wa.me/233557776271?text=Hello%20EasyFITA',
    actionLabel: 'Message Us',
    id: 'contact-whatsapp-card',
    accent: true,
  },
  {
    icon: '✉️',
    title: 'Email',
    value: 'ezfita@gmail.com',
    sub: 'We reply within 24 hours',
    action: 'mailto:ezfita@gmail.com',
    actionLabel: 'Send Email',
    id: 'contact-email-card',
  },
  {
    icon: '📍',
    title: 'Location',
    value: 'Accra, Ghana',
    sub: 'Serving all of Greater Accra',
    action: 'https://maps.google.com/?q=Accra,Ghana',
    actionLabel: 'View on Map',
    id: 'contact-location-card',
  },
];

const faqs = [
  {
    q: 'How quickly can you send a mechanic?',
    a: 'Our average response time is 30 minutes within Accra. For emergencies, we prioritize your call and dispatch immediately.',
  },
  {
    q: 'Do I pay before or after service?',
    a: 'You pay only after the work is completed and you are satisfied. We always provide an upfront quote before starting.',
  },
  {
    q: 'Are your mechanics certified?',
    a: 'Yes, all EasyFITA mechanics are certified, trained, and background-checked. We only work with professionals.',
  },
  {
    q: 'Which areas do you cover?',
    a: 'We currently serve all of Greater Accra including Osu, East Legon, Tema, Spintex, Airport Hills, Madina, Kaneshie, and more.',
  },
  {
    q: 'Can you work on any car brand?',
    a: 'Yes, our mechanics are trained to work on all major car brands — Toyota, Hyundai, Kia, Honda, Mercedes, BMW, VW, Ford, and more.',
  },
  {
    q: 'What if the problem can\'t be fixed on-site?',
    a: 'If the repair requires workshop equipment, we\'ll tow your vehicle to a trusted partner garage and keep you updated throughout.',
  },
];

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [formSent, setFormSent] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setFormSent(true);
      } else {
        setError(data.error || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError('A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.contactPage}>
      {/* Hero */}
      <section className={styles.pageHero}>
        <div className={styles.pageHeroBg} />
        <div className={`container ${styles.pageHeroContent}`}>
          <div className="badge animate-fade-up">📬 CONTACT US</div>
          <h1 className={styles.pageTitle}>We're Ready to Help You</h1>
          <p className={styles.pageSubtitle}>
            Reach out via call, WhatsApp, or email. Our team is available 7 days a week to help with any automotive need.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="section-sm">
        <div className="container">
          <div className={styles.contactCards}>
            {contactMethods.map((method) => (
              <div className={`card ${styles.contactCard} ${method.accent ? styles.contactCardAccent : ''}`} key={method.id} id={method.id}>
                <div className={styles.contactCardIcon}>{method.icon}</div>
                <h3 className={styles.contactCardTitle}>{method.title}</h3>
                <p className={styles.contactCardValue}>{method.value}</p>
                <p className={styles.contactCardSub}>{method.sub}</p>
                <a href={method.action} target={method.action.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className={`btn ${method.accent ? 'btn-accent' : 'btn-outline'}`} style={{ width: '100%', marginTop: 'auto' }}>
                  {method.actionLabel}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className={`section ${styles.formSection}`}>
        <div className="container">
          <div className={styles.formLayout}>
            {/* Contact Form */}
            <div>
              <div style={{ marginBottom: 32 }}>
                <div className="badge animate-fade-up">📝 SEND A MESSAGE</div>
                <h2 className={styles.formTitle}>Get in Touch</h2>
                <p className={styles.formSubtitle}>Send us a message and we'll get back to you within a few hours.</p>
              </div>

              {formSent ? (
                <div className={styles.formSuccess}>
                  <span style={{ fontSize: '3rem' }}>✅</span>
                  <h3>Message Sent!</h3>
                  <p>Thanks, <strong>{form.name}</strong>! We'll get back to you shortly. For urgent needs, please call or WhatsApp us directly.</p>
                  <a href="https://wa.me/233557776271" className="btn btn-primary" id="form-success-whatsapp">💬 WhatsApp Us Now</a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.contactForm} id="contact-form">
                  {error && (
                    <div style={{ padding: '12px', background: '#ffe4e4', border: '1px solid #ffbaba', color: '#d8000c', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
                      ⚠️ {error}
                    </div>
                  )}
                  <div className="form-group">
                    <label htmlFor="contact-name">Full Name *</label>
                    <input id="contact-name" name="name" type="text" placeholder="Your name" value={form.name} onChange={handleChange} required disabled={isSubmitting} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-phone">Phone Number *</label>
                    <input id="contact-phone" name="phone" type="tel" placeholder="e.g. 0244567890" value={form.phone} onChange={handleChange} required disabled={isSubmitting} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-subject">Subject</label>
                    <input id="contact-subject" name="subject" type="text" placeholder="e.g. Enquiry about oil change" value={form.subject} onChange={handleChange} disabled={isSubmitting} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-message">Message *</label>
                    <textarea id="contact-message" name="message" placeholder="Tell us how we can help…" value={form.message} onChange={handleChange} required style={{ minHeight: 140 }} disabled={isSubmitting} />
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg" id="contact-submit-btn" style={{ width: '100%' }} disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Map placeholder + Info */}
            <div className={styles.mapSide}>
              <div className={styles.mapPlaceholder}>
                <div className={styles.mapOverlay}>
                  <div className={styles.mapPin}>📍</div>
                  <span>Accra, Ghana</span>
                  <a href="https://maps.google.com/?q=Accra,Ghana" target="_blank" rel="noopener noreferrer" className="btn btn-ghost" id="open-maps-btn" style={{ marginTop: 12 }}>
                    Open in Google Maps
                  </a>
                </div>
              </div>

              <div className={styles.operatingHours}>
                <h3>🕐 Operating Hours</h3>
                <div className={styles.hoursGrid}>
                  <span>Monday – Friday</span><span>6:00am – 10:00pm</span>
                  <span>Saturday</span><span>7:00am – 9:00pm</span>
                  <span>Sunday</span><span>8:00am – 6:00pm</span>
                  <span style={{ color: 'var(--accent)', fontWeight: 700 }}>Emergencies</span>
                  <span style={{ color: 'var(--accent)', fontWeight: 700 }}>24 / 7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={`section ${styles.faqSection}`}>
        <div className="container">
          <div className="section-header">
            <div className="badge animate-fade-up">❓ FAQS</div>
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about EasyFITA's services.</p>
          </div>
          <div className={styles.faqList}>
            {faqs.map((faq, i) => (
              <div className={`${styles.faqItem} ${openFaq === i ? styles.faqOpen : ''}`} key={i} id={`faq-${i}`}>
                <button className={styles.faqQuestion} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{faq.q}</span>
                  <span className={styles.faqChevron}>{openFaq === i ? '▲' : '▼'}</span>
                </button>
                <div className={styles.faqAnswer}>
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>Still have questions?</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="tel:0556920199" className="btn btn-primary" id="faq-call-btn">📞 Call Us</a>
              <a href="https://wa.me/233557776271" target="_blank" rel="noopener noreferrer" className="btn btn-ghost" id="faq-whatsapp-btn">💬 WhatsApp Us</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
