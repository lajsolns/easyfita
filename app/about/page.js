import Link from 'next/link';
import styles from './about.module.css';

export const metadata = {
  title: 'About Us – EasyFITA Auto Repair & Roadside Assistance',
  description: 'Learn about EasyFITA — Ghana\'s trusted platform connecting car owners to professional mechanics for fast, affordable repairs in Accra.',
};

const values = [
  { icon: '⚡', title: 'Speed', desc: 'Average 30-minute response time. We know time is critical when your car fails you.' },
  { icon: '🛡️', title: 'Trust', desc: 'All our mechanics are certified and background-checked. Your safety is our priority.' },
  { icon: '💰', title: 'Affordability', desc: 'Transparent pricing, no hidden fees. You only pay after the job is done.' },
  { icon: '📍', title: 'Convenience', desc: 'We come to you — your home, office, or anywhere on the road in Accra.' },
];

const team = [
  { name: 'Kofi Acheampong', role: 'Founder & CEO', emoji: '👨🏾‍💼', desc: 'Passionate about making car care accessible for every Ghanaian.' },
  { name: 'Ama Darko', role: 'Head of Operations', emoji: '👩🏾‍💼', desc: 'Ensures every job is dispatched and completed on time, every time.' },
  { name: 'Emmanuel Boateng', role: 'Lead Mechanic', emoji: '👨🏾‍🔧', desc: '12+ years experience. Certified in diagnostics and engine repair.' },
];

export default function AboutPage() {
  return (
    <div className={styles.aboutPage}>
      {/* ── Page Hero ── */}
      <section className={styles.pageHero}>
        <div className={styles.pageHeroBg} />
        <div className={`container ${styles.pageHeroContent}`}>
          <span className="badge">🏢 Our Story</span>
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
              <span className="badge">🎯 Our Mission</span>
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
                <a href="tel:0260804767" className="btn btn-ghost" id="about-call-btn">
                  📞 Call Us
                </a>
              </div>
            </div>

            <div className={styles.missionVisual}>
              <div className={styles.missionCard}>
                <div className={styles.missionCardIcon}>🏆</div>
                <h3>Why EasyFITA?</h3>
                <ul className={styles.whyList}>
                  <li>✅ 500+ happy customers served</li>
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
            <span className="badge">💡 Our Values</span>
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
            <span className="badge">👥 Our Team</span>
            <h2>The People Behind EasyFITA</h2>
            <p>A passionate team committed to making your car care experience seamless.</p>
          </div>
          <div className={styles.teamGrid}>
            {team.map((member, i) => (
              <div className={`card ${styles.teamCard}`} key={i}>
                <div className={styles.teamAvatar}>{member.emoji}</div>
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
    </div>
  );
}
