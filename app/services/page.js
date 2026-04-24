import Link from 'next/link';
import styles from './services.module.css';

export const metadata = {
  title: 'Our Services – EasyFITA Auto Repair Accra Ghana',
  description: 'Explore EasyFITA\'s full range of auto services: car repairs, mobile mechanic, emergency roadside assistance, oil change, battery replacement, and vehicle diagnostics in Accra.',
};

const services = [
  {
    icon: '🔩',
    title: 'Car Repairs & Maintenance',
    desc: 'Comprehensive mechanical repairs covering engine issues, brake systems, suspension, steering, clutch, gearbox, and more. Our certified mechanics diagnose accurately and fix right the first time.',
    features: ['Engine repair & overhaul', 'Brake pad & disc replacement', 'Suspension & steering', 'Clutch & gearbox', 'Cooling system repair'],
    tag: 'Most Popular',
  },
  {
    icon: '🚗',
    title: 'Mobile Mechanic Services',
    desc: 'Can\'t bring your car to a garage? We bring the garage to you. Our fully-equipped mobile mechanics come to your home, office, or any location in Accra.',
    features: ['Home visits available', 'Office parking service', 'Fully equipped vans', 'All makes & models', 'Same-day booking'],
    tag: null,
  },
  {
    icon: '🚨',
    title: 'Emergency Roadside Assistance',
    desc: '24/7 emergency support when you\'re stranded. Breakdown, flat tyre, accident — our team is always on standby to get you back on the road quickly and safely.',
    features: ['24/7 availability', '30-min avg response', 'Tyre change', 'Vehicle recovery', 'Fuel delivery'],
    tag: '24/7',
  },
  {
    icon: '🔋',
    title: 'Battery Jumpstart & Replacement',
    desc: 'Dead battery? We test, jumpstart, and replace car batteries on the spot. We carry quality replacement batteries for all vehicle types at competitive prices.',
    features: ['Battery health check', 'Jumpstart service', 'Battery replacement', 'Charging system test', 'All battery brands'],
    tag: null,
  },
  {
    icon: '🛢️',
    title: 'Oil Change Services',
    desc: 'Fast, clean oil changes using quality engine lubricants. We recommend the right oil grade for your vehicle and dispose of old oil responsibly.',
    features: ['Synthetic & conventional oil', 'Filter replacement', 'Multi-point inspection', 'Oil level check', 'Fluid top-up'],
    tag: 'Quick Service',
  },
  {
    icon: '🔬',
    title: 'Vehicle Diagnostics',
    desc: 'Advanced OBD-II computer diagnostics to read error codes and identify hidden issues before they become costly problems. Know exactly what\'s wrong before spending a cedi.',
    features: ['OBD-II scan', 'Engine light diagnosis', 'Fault code reading', 'Written report', 'Fixation recommendation'],
    tag: null,
  },
];

const pricingNote = [
  { service: 'Oil Change', price: 'From GH₵ 180' },
  { service: 'Battery Jumpstart', price: 'From GH₵ 80' },
  { service: 'Battery Replacement', price: 'Quote on request' },
  { service: 'Vehicle Diagnostics', price: 'From GH₵ 150' },
  { service: 'Roadside Assistance', price: 'From GH₵ 100' },
  { service: 'Major Repairs', price: 'Quote on request' },
];

export default function ServicesPage() {
  return (
    <div className={styles.servicesPage}>
      {/* ── Hero ── */}
      <section className={styles.pageHero}>
        <div className={styles.pageHeroBg} />
        <div className={`container ${styles.pageHeroContent}`}>
          <div className="badge animate-fade-up">⚙️ OUR SERVICES</div>
          <h1 className={styles.pageTitle}>Full Auto Care, Wherever You Are</h1>
          <p className={styles.pageSubtitle}>
            From emergency breakdowns to scheduled maintenance — EasyFITA provides professional automotive services at your location across Accra, Ghana.
          </p>
          <div className={styles.heroActions}>
            <Link href="/book" className="btn btn-primary btn-lg" id="services-hero-book">
              📅 Book a Service
            </Link>
            <a href="tel:0556920199" className="btn btn-ghost btn-lg" id="services-hero-call">
              📞 Call: 0556920199
            </a>
          </div>
        </div>
      </section>

      {/* ── Services Cards ── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="badge animate-fade-up">🔧 ALL SERVICES</div>
            <h2>What We Offer</h2>
            <p>Professional, affordable, and mobile auto services across Accra.</p>
          </div>

          <div className={styles.servicesGrid}>
            {services.map((service, i) => (
              <div className={`card ${styles.serviceCard}`} key={i}>
                {service.tag && (
                  <span className={styles.serviceTag}>{service.tag}</span>
                )}
                <div className={styles.serviceIcon}>{service.icon}</div>
                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <p className={styles.serviceDesc}>{service.desc}</p>
                <ul className={styles.featureList}>
                  {service.features.map((f, j) => (
                    <li key={j}>✓ {f}</li>
                  ))}
                </ul>
                <Link href="/book" className="btn btn-outline" style={{ width: '100%', marginTop: 'auto' }} id={`service-book-${i}`}>
                  Book This Service
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className={`section ${styles.pricingSection}`}>
        <div className="container">
          <div className="section-header">
            <div className="badge animate-fade-up">💰 TRANSPARENT PRICING</div>
            <h2>Service Pricing</h2>
            <p>Upfront estimates with no hidden charges. Complex jobs are quoted before any work begins.</p>
          </div>

          <div className={styles.pricingTable}>
            <div className={styles.pricingHeader}>
              <span>Service</span>
              <span>Pricing</span>
            </div>
            {pricingNote.map((item, i) => (
              <div className={styles.pricingRow} key={i}>
                <span className={styles.pricingService}>{item.service}</span>
                <span className={styles.pricingAmount}>{item.price}</span>
              </div>
            ))}
            <div className={styles.pricingFooter}>
              <p>💡 Final pricing depends on vehicle type, parts required, and location. We always confirm costs with you before starting work.</p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link href="/book" className="btn btn-primary btn-lg" id="pricing-get-quote-btn">
              Get a Free Quote
            </Link>
          </div>
        </div>
      </section>

      {/* ── Coverage ── */}
      <section className="section">
        <div className="container">
          <div className={styles.coverageCard}>
            <div className={styles.coverageContent}>
              <div className="badge animate-fade-up">📍 SERVICE AREA</div>
              <h2 className={styles.coverageTitle}>We Cover All of Accra & Surroundings</h2>
              <p className={styles.coverageText}>
                Our mobile mechanics operate across all major areas of Accra including Osu, Labone, East Legon, Airport Hills, Tema, Spintex, Adenta, Madina, Kaneshie, and more.
              </p>
              <div className={styles.coverageAreas}>
                {['Osu', 'Labone', 'East Legon', 'Tema', 'Spintex', 'Airport Hills', 'Adenta', 'Madina', 'Kaneshie', 'Achimota', 'Dansoman', 'Lapaz'].map(area => (
                  <span key={area} className={styles.areaTag}>📍 {area}</span>
                ))}
              </div>
              <Link href="/book" className="btn btn-primary" id="coverage-book-btn" style={{ marginTop: '24px' }}>
                Book in My Area
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
