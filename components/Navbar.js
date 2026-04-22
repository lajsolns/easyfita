'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/services', label: 'Services' },
  { href: '/track', label: '🗺️ Live Map', live: true },
  { href: '/book', label: 'Book a Service' },
  { href: '/contact', label: 'Contact Us' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => setUser(data.user || null))
      .catch(() => setUser(null));
  }, [pathname]); // re-check on nav

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
    router.refresh();
  };


  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="navbar-logo">
            <div className="logo-icon">🔧</div>
            Easy<span className="accent">FITA</span>
          </Link>

          <ul className="navbar-links">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={pathname === link.href ? 'active' : ''}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="navbar-cta">
            {user ? (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Link href={user.isAdmin ? "/admin" : "/dashboard"} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '14px' }}>
                  {user.isAdmin ? "Admin Panel" : "Dashboard"}
                </Link>
                <button onClick={handleLogout} className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '14px' }}>
                  Log Out
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link href="/auth/login" className="btn btn-ghost" id="nav-login-btn">
                  Log In
                </Link>
                <Link href="/book" className="btn btn-primary" id="nav-book-btn">
                  Book Now
                </Link>
              </div>
            )}
          </div>

          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            id="hamburger-btn"
          >
            <span style={{ transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
            <span style={{ opacity: menuOpen ? 0 : 1 }} />
            <span style={{ transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
          </button>
        </div>
      </nav>

      <div className={`mobile-nav ${menuOpen ? 'open' : ''}`} id="mobile-nav">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {user ? (
            <>
               <Link href={user.isAdmin ? "/admin" : "/dashboard"} className="btn btn-primary" onClick={() => setMenuOpen(false)}>
                 {user.isAdmin ? "Admin Panel" : "My Dashboard"}
               </Link>
               <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="btn btn-ghost">
                 Log Out
               </button>
            </>
          ) : (
            <>
               <Link href="/auth/login" className="btn btn-ghost" onClick={() => setMenuOpen(false)}>
                 Log In
               </Link>
               <Link href="/book" className="btn btn-primary" id="mobile-book-btn" onClick={() => setMenuOpen(false)}>
                 📅 Book a Mechanic Now
               </Link>
            </>
          )}
          <Link href="/contact" className="btn btn-accent" id="mobile-help-btn" onClick={() => setMenuOpen(false)}>
            🚨 Get Help Fast
          </Link>
        </div>
      </div>
    </>
  );
}
