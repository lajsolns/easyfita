'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './dashboard.module.css';

export default function DashboardClient({ initialUser }) {
  const router = useRouter();
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  const handleStatusChange = async (status) => {
    setLoading(true);
    try {
      const res = await fetch('/api/mechanic/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setUser({
          ...user,
          mechanicProfile: { ...user.mechanicProfile, status },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardInner}>
        <div className={styles.sidebar}>
          <div className={styles.userCard}>
             <div className={styles.avatar}>
               {user.name.charAt(0).toUpperCase()}
             </div>
             <div className={styles.userInfo}>
               <h3>{user.name}</h3>
               <p className={styles.roleBadge}>
                 {user.role === 'CLIENT' ? '🚗 Car Owner' : '🔧 Mechanic'}
               </p>
             </div>
          </div>

          <nav className={styles.navLinks}>
            <button className={`${styles.navLink} ${styles.active}`}>Overview</button>
            <button className={styles.navLink}>Settings</button>
            <button className={styles.navLink} onClick={handleLogout}>Log Out</button>
          </nav>
        </div>

        <main className={styles.mainContent}>
          <div className={styles.header}>
            <h1>Welcome, {user.name.split(' ')[0]}</h1>
            <p>Manage your account and activity.</p>
          </div>

          {/* ── CLIENT DASHBOARD ── */}
          {user.role === 'CLIENT' && (
            <div className={styles.gridCards}>
              <div className={styles.card}>
                <h3>Your Vehicles</h3>
                {user.clientProfile?.carMake ? (
                  <div className={styles.vehicleInfo}>
                    🚗 <strong>{user.clientProfile.carMake} {user.clientProfile.carModel}</strong> {user.clientProfile.carYear ? `(${user.clientProfile.carYear})` : ''}
                  </div>
                ) : (
                  <p className="text-muted">No vehicle details added yet.</p>
                )}
              </div>
              <div className={styles.card}>
                <h3>Need Help?</h3>
                <p style={{marginBottom: 16}}>Check the live map to see mechanics nearby or book one directly.</p>
                <div style={{display:'flex', gap:8}}>
                  <Link href="/track" className="btn btn-outline" style={{fontSize: 13, flex:1, padding: '10px'}}>🗺️ Live Map</Link>
                  <Link href="/book" className="btn btn-primary" style={{fontSize: 13, flex:1, padding: '10px'}}>📅 Book Now</Link>
                </div>
              </div>
            </div>
          )}

          {/* ── MECHANIC DASHBOARD ── */}
          {user.role === 'MECHANIC' && user.mechanicProfile && (
            <>
              {/* Approval status banner */}
              {user.mechanicProfile.approval === 'PENDING' && (
                <div className={styles.alertPending}>
                  ⏳ <strong>Pending Approval:</strong> Your application is under review by our team. You will not appear on the live map until approved.
                </div>
              )}

              {user.mechanicProfile.approval === 'REJECTED' && (
                <div className={styles.alertRejected}>
                  ❌ <strong>Application Rejected:</strong> {user.mechanicProfile.rejectedNote || 'Your application did not meet our criteria.'} 
                  <br/>Please contact support to resolve this.
                </div>
              )}

              {user.mechanicProfile.approval === 'APPROVED' && (
                <div className={styles.statusToggleBlock}>
                  <div className={styles.statusHeader}>
                    <h3>Availability Status</h3>
                    <p>Toggle your status to appear on the live map for customers.</p>
                  </div>
                  <div className={styles.statusButtons}>
                    <button 
                      onClick={() => handleStatusChange('AVAILABLE')}
                      disabled={loading}
                      className={`${styles.statusBtn} ${user.mechanicProfile.status === 'AVAILABLE' ? styles.statusBtnActive : ''} ${styles.statusAvailable}`}
                    >
                      🟢 Available
                    </button>
                    <button 
                      onClick={() => handleStatusChange('EN_ROUTE')}
                      disabled={loading}
                      className={`${styles.statusBtn} ${user.mechanicProfile.status === 'EN_ROUTE' ? styles.statusBtnActive : ''} ${styles.statusRoute}`}
                    >
                      🔵 En Route
                    </button>
                    <button 
                      onClick={() => handleStatusChange('BUSY')}
                      disabled={loading}
                      className={`${styles.statusBtn} ${user.mechanicProfile.status === 'BUSY' ? styles.statusBtnActive : ''} ${styles.statusBusy}`}
                    >
                      🟡 Busy
                    </button>
                    <button 
                      onClick={() => handleStatusChange('OFFLINE')}
                      disabled={loading}
                      className={`${styles.statusBtn} ${user.mechanicProfile.status === 'OFFLINE' ? styles.statusBtnActive : ''}`}
                    >
                      ⚫ Offline
                    </button>
                  </div>
                </div>
              )}

              <div className={styles.gridCards}>
                <div className={styles.card}>
                  <h3>Your Stats</h3>
                  <div className={styles.statsGrid}>
                    <div className={styles.statBox}>
                      <span className={styles.statValue}>⭐ {user.mechanicProfile.rating.toFixed(1)}</span>
                      <span className={styles.statLabel}>Rating</span>
                    </div>
                    <div className={styles.statBox}>
                      <span className={styles.statValue}>🔧 {user.mechanicProfile.totalJobs}</span>
                      <span className={styles.statLabel}>Total Jobs</span>
                    </div>
                  </div>
                </div>
                <div className={styles.card}>
                  <h3>Profile Details</h3>
                  <ul className={styles.profileList}>
                     <li><strong>Specialty:</strong> {user.mechanicProfile.specialty}</li>
                     <li><strong>Experience:</strong> {user.mechanicProfile.experience}</li>
                     <li><strong>Location:</strong> {user.mechanicProfile.location}</li>
                  </ul>
                </div>
              </div>
            </>
          )}

        </main>
      </div>
    </div>
  );
}
