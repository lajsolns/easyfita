import Link from 'next/link';

const footerLinks = {
  Pages: [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/services', label: 'Services' },
    { href: '/book', label: 'Book a Service' },
    { href: '/contact', label: 'Contact Us' },
  ],
  Services: [
    { href: '/services', label: 'Car Repairs & Maintenance' },
    { href: '/services', label: 'Mobile Mechanic' },
    { href: '/services', label: 'Roadside Assistance' },
    { href: '/services', label: 'Battery Services' },
    { href: '/services', label: 'Oil Change' },
    { href: '/services', label: 'Vehicle Diagnostics' },
  ],
  Contact: [
    { href: 'tel:0556920199', label: '📞 0556920199' },
    { href: 'https://wa.me/233557776271', label: '💬 WhatsApp Us' },
    { href: 'mailto:ezfita@gmail.com', label: '✉️ ezfita@gmail.com' },
    { href: '#', label: '📍 Accra, Ghana' },
  ],
};

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="navbar-logo" style={{ display: 'inline-block' }}>
              <img src="/Image/logo-white.jpeg" alt="EasyFITA Logo" style={{ height: '50px', width: 'auto', borderRadius: '4px' }} />
            </Link>
            <p>
              Your trusted auto repair &amp; roadside assistance partner in Accra, Ghana.
              We come to you — fast, professional, and affordable.
            </p>
            <div className="social-links" style={{ marginTop: '24px' }}>
              <a href="https://wa.me/233557776271" target="_blank" rel="noopener noreferrer" className="social-link" title="WhatsApp" id="footer-whatsapp">💬</a>
              <a href="tel:0556920199" className="social-link" title="Call Us" id="footer-call">📞</a>
              <a href="mailto:ezfita@gmail.com" className="social-link" title="Email Us" id="footer-email">✉️</a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div className="footer-col" key={title}>
              <h4>{title}</h4>
              <ul>
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} EasyFITA. All rights reserved. Built with ❤️ in Accra, Ghana.</p>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/contact" style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Privacy Policy</Link>
            <Link href="/contact" style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
