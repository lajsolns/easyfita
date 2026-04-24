import Link from 'next/link';
import styles from './home.module.css';

const services = [
  { icon: '🔩', title: 'Car Repairs & Maintenance', desc: 'Full mechanical repairs from engine faults to brake pads, done right the first time.' },
  { icon: '🚗', title: 'Mobile Mechanic Services', desc: 'Our mechanics come directly to your home, office, or wherever you are.' },
  { icon: '🚨', title: 'Emergency Roadside Assistance', desc: '24/7 emergency support when your car breaks down on the road.' },
  { icon: '🔋', title: 'Battery Jumpstart & Replacement', desc: 'Fast battery testing, jumpstart, and replacement on the spot.' },
  { icon: '🛢️', title: 'Oil Change Services', desc: 'Quick, clean oil changes with quality lubricants to keep your engine healthy.' },
  { icon: '🔬', title: 'Vehicle Diagnostics', desc: 'Advanced OBD diagnostics to identify issues before they become costly problems.' },
];

const stats = [
  // { value: '500+', label: 'Happy Customers' },
  { value: '24/7', label: 'Emergency Support' },
  { value: '30 min', label: 'Avg. Response Time' },
  { value: '100%', label: 'Certified Mechanics' },
];

const steps = [
  { step: '01', title: 'Book Online', desc: 'Fill out our quick booking form with your car details and location.' },
  { step: '02', title: 'We Dispatch', desc: 'A certified mechanic is dispatched to your location within 30 minutes.' },
  { step: '03', title: 'Job Done', desc: 'Your car is repaired or assisted on-site. Pay only after the job is complete.' },
];

const testimonials = [
  {
    name: 'Kwame Asante',
    role: 'Uber Driver, Accra',
    text: 'EasyFITA saved my life! My car broke down at 11pm and they were there in 25 minutes. Incredible service!',
    rating: 5,
  },
  {
    name: 'Abena Mensah',
    role: 'Fleet Manager, AccraTrans',
    text: 'We manage 30 vehicles and EasyFITA handles all our maintenance. Reliable, professional, and affordable.',
    rating: 5,
  },
  {
    name: 'Samuel Ofori',
    role: 'Car Owner, East Legon',
    text: 'Booked an oil change online and the mechanic showed up at my office. So convenient! Will use again.',
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <div className={styles.homePage}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <div className={styles.heroBgOrb1} />
          <div className={styles.heroBgOrb2} />
          <div className={styles.heroGrid} />
        </div>

        <div className={`container ${styles.heroWrapper}`}>
          <div className={styles.heroContent}>
            <div className={`badge animate-fade-up`}>🏆 #1 Trusted Auto Repair in Accra</div>
            <h1 className={`${styles.heroTitle} animate-fade-up-delay`}>
              Tap,
              <br />
              <span className={styles.heroGradient}>Fix and </span>
               Go
            </h1>
            <p className={`${styles.heroSubtitle} animate-fade-up-delay-2`}>
              Book a certified mechanic online in minutes. We come to you — home, office, or roadside.
              Fast, affordable, and reliable auto repair across Accra, Ghana.
            </p>

            <div className={`${styles.heroActions} animate-fade-up-delay-2`}>
              <Link href="/book" className="btn btn-primary btn-lg" id="hero-book-btn">
                📅 Book a Mechanic Now
              </Link>
              <Link href="/contact" className="btn btn-accent btn-lg" id="hero-help-btn">
                🚨 Get Help Fast
              </Link>
            </div>
            <Link href="/track" className="btn btn-outline" id="hero-track-btn" style={{ alignSelf: 'flex-start', marginTop: '-8px' }}>
              🗺️ See Live Mechanic Map
            </Link>

            <div className={styles.heroTrustRow}>
              <div className={styles.trustItem}>✅ No call-out fee</div>
              <div className={styles.trustItem}>✅ 30-min response</div>
              <div className={styles.trustItem}>✅ Pay after service</div>
              <div className={styles.trustItem}>✅ Certified mechanics</div>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.heroCard}>
              <div className={styles.heroCardHeader}>
                <span className={styles.heroCardDot} style={{ background: '#ff5f56' }} />
                <span className={styles.heroCardDot} style={{ background: '#ffbd2e' }} />
                <span className={styles.heroCardDot} style={{ background: '#27c93f' }} />
                <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-muted)' }}>Live Dispatch</span>
              </div>
              <div className={styles.heroCardBody}>
                <div className={styles.dispatchItem}>
                  <span className={styles.dispatchDot} style={{ background: 'var(--success)' }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>Mechanic En Route</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ETA: 18 minutes</div>
                  </div>
                  <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--success)' }}>🟢 Active</span>
                </div>
                <div className={styles.dispatchItem}>
                  <span className={styles.dispatchDot} style={{ background: 'var(--primary)' }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>Oil Change — Osu</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>In Progress</div>
                  </div>
                  <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--primary-light)' }}>🔵 In Progress</span>
                </div>
                <div className={styles.dispatchItem}>
                  <span className={styles.dispatchDot} style={{ background: 'var(--warning)' }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>Battery Jumpstart</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Dispatching...</div>
                  </div>
                  <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--warning)' }}>🟡 Pending</span>
                </div>
              </div>
              <div className={styles.heroCardFooter}>
                <span>📍 Accra Metro • 3 active mechanics</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className={styles.statsSection}>
        <div className="container">
          <div className={styles.statsGrid}>
            {stats.map((s) => (
              <div className={styles.statItem} key={s.label}>
                <div className={styles.statValue}>{s.value}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="badge">⚙️ What We Do</span>
            <h2>Comprehensive Auto Services</h2>
            <p>From routine maintenance to emergency repairs, our certified mechanics handle it all — at your location.</p>
          </div>

          <div className={styles.servicesGrid}>
            {services.map((service, i) => (
              <div className={`card ${styles.serviceCard}`} key={i}>
                <div className={styles.serviceIcon}>{service.icon}</div>
                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <p className={styles.serviceDesc}>{service.desc}</p>
                <Link href="/services" className={styles.serviceLink}>Learn more →</Link>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link href="/services" className="btn btn-outline btn-lg" id="services-see-all-btn">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className={`section ${styles.howSection}`}>
        <div className="container">
          <div className="section-header">
            <span className="badge">🗺️ How It Works</span>
            <h2>Book in 3 Simple Steps</h2>
            <p>Getting a mechanic has never been easier. No phone queues, no waiting — just fast service.</p>
          </div>
          <div className={styles.stepsGrid}>
            {steps.map((s, i) => (
              <div className={styles.stepCard} key={i}>
                <div className={styles.stepNumber}>{s.step}</div>
                <div className={styles.stepConnector} />
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '56px' }}>
            <Link href="/book" className="btn btn-primary btn-lg" id="how-book-btn">
              📅 Book a Mechanic Now
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      {/* <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="badge">⭐ Testimonials</span>
            <h2>What Our Customers Say</h2>
            <p>Hundreds of drivers and car owners in Accra trust EasyFITA every day.</p>
          </div>
          <div className={styles.testimonialsGrid}>
            {testimonials.map((t, i) => (
              <div className={`card ${styles.testimonialCard}`} key={i}>
                <div className={styles.testimonialStars}>
                  {'⭐'.repeat(t.rating)}
                </div>
                <p className={styles.testimonialText}>"{t.text}"</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialAvatar}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className={styles.testimonialName}>{t.name}</div>
                    <div className={styles.testimonialRole}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ── CTA Banner ── */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaBanner}>
            <div className={styles.ctaBannerOrb} />
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Car Trouble? Don't Panic.</h2>
              <p className={styles.ctaSubtitle}>
                Call us, WhatsApp us, or book online. Our mechanics are ready 24/7 across Accra.
              </p>
              <div className={styles.ctaActions}>
                <Link href="/book" className="btn btn-primary btn-lg" id="cta-book-btn">
                  📅 Book a Mechanic Now
                </Link>
                <a href="https://wa.me/233557776271" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-lg" id="cta-whatsapp-btn">
                  💬 WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
