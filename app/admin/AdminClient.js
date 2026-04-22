'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './admin.module.css';

export default function AdminClient({ initialMechanics }) {
  const router = useRouter();
  const [mechanics, setMechanics] = useState(initialMechanics || []);
  const [loadingId, setLoadingId] = useState(null);
  const [rejectModal, setRejectModal] = useState({ show: false, id: null, note: '' });

  const handleApproval = async (id, status, note = null) => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/mechanics/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approval: status, rejectedNote: note }),
      });
      if (res.ok) {
        const { mechanic } = await res.json();
        setMechanics((prev) => prev.map((m) => (m.id === id ? mechanic : m)));
        if (status === 'REJECTED') setRejectModal({ show: false, id: null, note: '' });
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating status');
    } finally {
      setLoadingId(null);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  const pending = mechanics.filter((m) => m.approval === 'PENDING');
  const approved = mechanics.filter((m) => m.approval === 'APPROVED');
  const rejected = mechanics.filter((m) => m.approval === 'REJECTED');

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminHeader}>
        <div>
           <h1>Admin Dashboard</h1>
           <p>Manage mechanic approvals and platform settings.</p>
        </div>
        <button onClick={handleLogout} className="btn btn-outline">Log Out</button>
      </div>

      {rejectModal.show && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <h3>Reject Mechanic</h3>
            <p>Please provide a reason for rejecting this mechanic. They will see this message.</p>
            <textarea
              className="input list"
              rows={4}
              value={rejectModal.note}
              onChange={(e) => setRejectModal({ ...rejectModal, note: e.target.value })}
              placeholder="e.g. Please provide a valid ID to continue..."
              style={{ width: '100%', marginBottom: 16 }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
               <button 
                 className="btn btn-ghost" 
                 onClick={() => setRejectModal({ show: false, id: null, note: '' })}
                 style={{ flex: 1 }}
               >
                 Cancel
               </button>
               <button 
                 className="btn btn-primary" 
                 style={{ flex: 1, background: '#ef4444', borderColor: '#ef4444' }}
                 onClick={() => handleApproval(rejectModal.id, 'REJECTED', rejectModal.note)}
                 disabled={!rejectModal.note.trim()}
               >
                 Confirm Rejection
               </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Pending Approval</div>
          <div className={styles.statValue} style={{color: '#F59E0B'}}>{pending.length}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Approved Mechanics</div>
          <div className={styles.statValue} style={{color: '#22C55E'}}>{approved.length}</div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Action Required: Pending Approvals</h2>
        {pending.length === 0 ? (
          <div className={styles.emptyState}>No pending mechanics at this time.</div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name & Contact</th>
                  <th>Specialty</th>
                  <th>Location & Exp</th>
                  <th>Date Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <strong>{m.user.name}</strong><br/>
                      <span className="text-muted">{m.user.phone}</span>
                    </td>
                    <td>{m.specialty}</td>
                    <td>
                      {m.location}<br/>
                      <span className="text-muted">{m.experience}</span>
                    </td>
                    <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                         <button 
                           className="btn btn-primary btn-sm"
                           onClick={() => handleApproval(m.id, 'APPROVED')}
                           disabled={loadingId === m.id}
                         >
                           {loadingId === m.id ? '...' : 'Approve'}
                         </button>
                         <button 
                           className="btn btn-outline btn-sm"
                           onClick={() => setRejectModal({ show: true, id: m.id, note: '' })}
                           disabled={loadingId === m.id}
                           style={{ color: '#ef4444', borderColor: '#ef4444', background: 'transparent' }}
                         >
                           Reject
                         </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <h2>Approved Mechanics</h2>
        {approved.length === 0 ? (
          <div className={styles.emptyState}>No approved mechanics yet.</div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name & Contact</th>
                  <th>Specialty</th>
                  <th>Live Status</th>
                  <th>Stats</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {approved.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <strong>{m.user.name}</strong><br/>
                      <span className="text-muted">{m.user.phone}</span>
                    </td>
                    <td>{m.specialty}</td>
                    <td>{m.status}</td>
                    <td>⭐ {m.rating} | 🔧 {m.totalJobs} jobs</td>
                    <td>
                       <button 
                         className="btn btn-ghost btn-sm"
                         onClick={() => setRejectModal({ show: true, id: m.id, note: '' })}
                         disabled={loadingId === m.id}
                         style={{ color: '#ef4444' }}
                       >
                         Revoke Access
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
