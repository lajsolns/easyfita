'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './about.module.css';



const values = [
  { icon: '⚡', title: 'Speed', desc: 'Average 30-minute response time. We know time is critical when your car fails you.' },
  { icon: '🛡️', title: 'Trust', desc: 'All our mechanics are certified and background-checked. Your safety is our priority.' },
  { icon: '💰', title: 'Affordability', desc: 'Transparent pricing, no hidden fees. You only pay after the job is done.' },
  { icon: '📍', title: 'Convenience', desc: 'We come to you — your home, office, or anywhere on the road in Accra.' },
];

const team = [
  { 
    name: 'Jemima Senanu', 
    role: 'Founder', 
    image: '/Image/Jemima Senanu- Founder.jpeg', 
    desc: 'Visionary leader dedicated to solving automotive logistics in Ghana through technology.' 
  },
  { 
    name: 'Roland Kofi Koveh', 
    role: 'Head of Operations', 
    image: '/Image/Roland Kofi Koveh- Head of Operations.jpeg', 
    desc: 'Dynamic coordinator ensuring flawless service delivery and client satisfaction across Accra.' 
  },
  { 
    name: 'Marion Siba Napour', 
    role: 'Chief Accountant', 
    image: '/Image/Marion Siba Napour- Chief Accountant.jpeg', 
    desc: 'Financial steward maintaining fiscal integrity and driving sustainable growth for the platform.' 
  },
  { 
    name: 'Mark Nii Odoi Oddoye', 
    role: 'Head of IT Operations', 
    image: '/Image/Mark Nii Odoi Oddoye- Head of IT Operations.png', 
    desc: 'Tech innovator managing our digital infrastructure to keep you connected to help 24/7.' 
  },
];

export default function AboutPage() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className={styles.aboutPage}>
      {/* ── Page Hero ── */}
      <section className={styles.pageHero}>
        <div className={styles.pageHeroBg} />
        <div className={`container ${styles.pageHeroContent}`}>
          <div className="badge animate-fade-up">🏢 OUR STORY</div>
          <h1 className={styles.pageTitle}>Built for Every Car Owner in Ghana</h1>
          <p className={styles.pageSubtitle}>
            EasyFITA was founded with one mission: to make car maintenance stress-free, affordable, and accessible to everyone — anytime, anywhere in Accra.
          </p>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="section">
        <div className="container">
          <div className={styles.missionGrid}>
            <div className={styles.missionText}>
              <div className="badge animate-fade-up">🎯 OUR MISSION</div>
              <h2 className={styles.missionTitle}>Connecting You to Trusted Mechanics Instantly</h2>
              <p>
                We believe every car owner deserves access to reliable, professional mechanical services without the hassle of long waits, unknown pricing, or dodgy roadside strangers.
              </p>
              <p style={{ marginTop: '16px' }}>
                EasyFITA is a reliable automotive service platform that connects car owners to professional mechanics for quick, affordable, and convenient repairs. Whether you're stuck on the Accra-Tema Motorway at midnight or just need a routine oil change, we've got you covered.
              </p>
              <div className={styles.missionActions}>
                <Link href="/book" className="btn btn-primary" id="about-book-btn">
                  Book a Mechanic
                </Link>
                <a href="tel:0556920199" className="btn btn-ghost" id="about-call-btn">
                  📞 Call Us
                </a>
              </div>
            </div>

            <div className={styles.missionVisual}>
              <div className={styles.missionCard}>
                <div className={styles.missionCardIcon}>🏆</div>
                <h3>Why EasyFITA?</h3>
                <ul className={styles.whyList}>
                  <li>✅ 24/7 emergency availability</li>
                  <li>✅ Certified professional mechanics</li>
                  <li>✅ Mobile service — we come to you</li>
                  <li>✅ Transparent, upfront pricing</li>
                  <li>✅ Pay only after service is done</li>
                  <li>✅ Serving all of Accra & environs</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className={`section ${styles.valuesSection}`}>
        <div className="container">
          <div className="section-header">
            <div className="badge animate-fade-up">💡 OUR VALUES</div>
            <h2>What We Stand For</h2>
            <p>Every decision at EasyFITA is guided by these core principles.</p>
          </div>
          <div className={styles.valuesGrid}>
            {values.map((v, i) => (
              <div className={`card ${styles.valueCard}`} key={i}>
                <span className={styles.valueIcon}>{v.icon}</span>
                <h3 className={styles.valueTitle}>{v.title}</h3>
                <p className={styles.valueDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="badge animate-fade-up">👥 OUR TEAM</div>
            <h2>The People Behind EasyFITA</h2>
            <p>A passionate team committed to making your car care experience seamless.</p>
          </div>
          <div className={styles.teamGrid}>
            {team.map((member, i) => (
              <div className={`card ${styles.teamCard}`} key={i}>
                <div className={styles.teamAvatar} onClick={() => setSelectedImage(member.image)} style={{ cursor: 'zoom-in' }}>
                  <img src={member.image} alt={member.name} />
                </div>
                <h3 className={styles.teamName}>{member.name}</h3>
                <div className={styles.teamRole}>{member.role}</div>
                <p className={styles.teamDesc}>{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={`section ${styles.aboutCta}`}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 900, marginBottom: 16 }}>
            Ready to Experience the Difference?
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto 32px' }}>
            Join hundreds of satisfied car owners who trust EasyFITA for all their automotive needs.
          </p>
          <Link href="/book" className="btn btn-primary btn-lg" id="about-cta-btn">
            📅 Book a Mechanic Now
          </Link>
        </div>
      </section>
      {/* ── Image Modal ── */}
      {selectedImage && (
        <div className={styles.modalOverlay} onClick={() => setSelectedImage(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setSelectedImage(null)}>×</button>
            <img src={selectedImage} alt="Full view" className={styles.modalImage} />
          </div>
        </div>
      )}
    </div>
  );
}
