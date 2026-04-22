'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import styles from './track.module.css';

// TrackClient imports and initial setup

const STATUS_META = {
  available: { label: 'Available', color: '#22C55E', icon: '🟢' },
  'en-route': { label: 'En Route', color: '#0057FF', icon: '🔵' },
  busy: { label: 'Busy', color: '#F59E0B', icon: '🟡' },
};

// Haversine distance in km
function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getETA(distKm) {
  const mins = Math.round((distKm / 40) * 60);
  if (mins < 5) return '< 5 min';
  if (mins > 60) return '> 1 hr';
  return `~${mins} min`;
}

// ── Map Sub-component implementation follows
function LeafletMap({ userLocation, mechanics, onMechanicClick, selectedId }) {
  const mapRef = useRef(null);
  const leafletRef = useRef(null);
  const markersRef = useRef({});
  const userMarkerRef = useRef(null);
  const animFrameRef = useRef(null);
  const positionsRef = useRef({});

  // Animate en-route mechanics
  useEffect(() => {
    const tick = () => {
      mechanics.forEach((m) => {
        if (m.status === 'en-route' && userLocation) {
          const pos = positionsRef.current[m.id] || { lat: m.lat, lng: m.lng };
          const speed = 0.00005;
          const dLat = userLocation.lat - pos.lat;
          const dLng = userLocation.lng - pos.lng;
          const dist = Math.sqrt(dLat ** 2 + dLng ** 2);
          if (dist > 0.0005) {
            positionsRef.current[m.id] = {
              lat: pos.lat + (dLat / dist) * speed,
              lng: pos.lng + (dLng / dist) * speed,
            };
            if (markersRef.current[m.id]) {
              markersRef.current[m.id].setLatLng([
                positionsRef.current[m.id].lat,
                positionsRef.current[m.id].lng,
              ]);
            }
          }
        }
      });
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [mechanics, userLocation]);

  useEffect(() => {
    let cancelled = false;

    if (mapRef.current && !leafletRef.current) {
      import('leaflet').then((L) => {
        // Bail out if the effect was cleaned up before the import resolved
        // (handles React Strict Mode double-invoke)
        if (cancelled || leafletRef.current) return;

        // Fix default icons
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        const center = userLocation
          ? [userLocation.lat, userLocation.lng]
          : [5.6037, -0.187];

        const map = L.map(mapRef.current, {
          zoomControl: true,
          scrollWheelZoom: true,
        }).setView(center, 13);

        L.tileLayer(
          'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
          {
            attribution: '© OpenStreetMap contributors © CARTO',
            subdomains: 'abcd',
            maxZoom: 19,
          }
        ).addTo(map);

        leafletRef.current = { L, map };

        // Add mechanic markers
        mechanics.forEach((m) => {
          positionsRef.current[m.id] = { lat: m.lat, lng: m.lng };
          const icon = L.divIcon({
            className: '',
            html: `
              <div style="
                width:46px;height:46px;border-radius:50%;
                background:${m.color};
                border:3px solid white;
                display:flex;align-items:center;justify-content:center;
                font-weight:800;font-size:13px;color:white;
                font-family:Inter,sans-serif;
                box-shadow:0 2px 12px rgba(0,0,0,0.5);
                cursor:pointer;
                position:relative;
              ">
                ${m.avatar}
                ${m.status === 'en-route' ? `
                  <span style="
                    position:absolute;bottom:-6px;left:50%;transform:translateX(-50%);
                    background:#0057FF;color:white;font-size:9px;font-weight:700;
                    padding:1px 5px;border-radius:6px;white-space:nowrap;
                  ">EN ROUTE</span>
                ` : ''}
              </div>
            `,
            iconSize: [46, 46],
            iconAnchor: [23, 23],
          });

          const marker = L.marker([m.lat, m.lng], { icon })
            .addTo(map)
            .on('click', () => onMechanicClick(m));

          markersRef.current[m.id] = marker;
        });

        // Add user marker
        if (userLocation) {
          const userIcon = L.divIcon({
            className: '',
            html: `
              <div style="position:relative;width:24px;height:24px;">
                <div style="
                  width:24px;height:24px;border-radius:50%;
                  background:#FF6B00;border:3px solid white;
                  box-shadow:0 2px 12px rgba(255,107,0,0.6);
                "></div>
                <div style="
                  position:absolute;inset:-8px;border-radius:50%;
                  border:2px solid rgba(255,107,0,0.4);
                  animation:pulse 1.5s ease-out infinite;
                "></div>
              </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });
          userMarkerRef.current = L.marker(
            [userLocation.lat, userLocation.lng],
            { icon: userIcon }
          )
            .addTo(map)
            .bindPopup('<b>📍 Your Location</b>');
        }
      });
    }

    return () => {
      // Mark as cancelled so the async import doesn't proceed after unmount
      cancelled = true;
      // Destroy the Leaflet map so re-mounting doesn't hit "already initialized"
      if (leafletRef.current) {
        leafletRef.current.map.remove();
        leafletRef.current = null;
        markersRef.current = {};
        userMarkerRef.current = null;
      }
    };
  }, []);

  // Update user marker if location changes
  useEffect(() => {
    if (!leafletRef.current || !userLocation) return;
    const { L, map } = leafletRef.current;
    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
    } else {
      const userIcon = L.divIcon({
        className: '',
        html: `<div style="width:24px;height:24px;border-radius:50%;background:#FF6B00;border:3px solid white;box-shadow:0 2px 12px rgba(255,107,0,0.6);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      userMarkerRef.current = L.marker(
        [userLocation.lat, userLocation.lng],
        { icon: userIcon }
      ).addTo(map).bindPopup('<b>📍 Your Location</b>');
    }
    map.setView([userLocation.lat, userLocation.lng], 13, { animate: true });
  }, [userLocation]);

  // Pan to selected mechanic
  useEffect(() => {
    if (!leafletRef.current || !selectedId) return;
    const { map } = leafletRef.current;
    const pos = positionsRef.current[selectedId];
    if (pos) map.panTo([pos.lat, pos.lng], { animate: true });
  }, [selectedId]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </>
  );
}

// ── Main Client Component ─────────────────────────────────────────────────
export default function TrackClient() {
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState('');
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');
  const [mechanics, setMechanics] = useState([]);
  const [tick, setTick] = useState(0);

  // Fetch real mechanics from database
  useEffect(() => {
    const fetchMechanics = async () => {
      try {
        const res = await fetch('/api/mechanics');
        if (res.ok) {
          const data = await res.json();
          // Transform db data to map format (add avatar, color, etc)
          const formatted = data.mechanics.map(m => ({
             ...m,
             status: m.status.toLowerCase().replace('_', '-'),
             avatar: m.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
             color: m.status === 'AVAILABLE' ? '#22C55E' : 
                    m.status === 'EN_ROUTE' ? '#0057FF' : '#F59E0B',
          }));
          setMechanics(formatted);
        }
      } catch (err) {
        console.error('Failed to load mechanics', err);
      }
    };
    fetchMechanics();
    // Poll every 30s for updates
    const id = setInterval(fetchMechanics, 30000);
    return () => clearInterval(id);
  }, []);

  // Refresh distances every 3s to simulate movement
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(id);
  }, []);

  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocError('Geolocation not supported. Using Accra city centre.');
      setUserLocation({ lat: 5.6037, lng: -0.187 });
      return;
    }
    setLocating(true);
    setLocError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setLocError('Could not get location. Defaulting to Accra city centre.');
        setUserLocation({ lat: 5.6037, lng: -0.187 });
        setLocating(false);
      },
      { timeout: 8000 }
    );
  }, []);

  // Auto-locate on mount
  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  const mechanicsWithDist = mechanics.map((m) => {
    const pos = { lat: m.lat, lng: m.lng };
    const dist = userLocation
      ? getDistance(userLocation.lat, userLocation.lng, pos.lat, pos.lng)
      : null;
    return { ...m, dist, eta: dist ? getETA(dist) : '—' };
  });

  const filtered = mechanicsWithDist
    .filter((m) => filter === 'all' || m.status === filter)
    .sort((a, b) => (a.dist ?? 999) - (b.dist ?? 999));

  const available = mechanicsWithDist.filter((m) => m.status === 'available').length;
  const enRoute = mechanicsWithDist.filter((m) => m.status === 'en-route').length;

  return (
    <div className={styles.trackPage}>
      {/* ── Header ── */}
      <div className={styles.trackHeader}>
        <div className={styles.trackHeaderInner}>
          <div>
            <div className={styles.trackTitle}>
              <span className={styles.liveIndicator} />
              Live Mechanic Map
            </div>
            <p className={styles.trackSubtitle}>
              See mechanics near you in real time — track distance &amp; ETA before booking.
            </p>
          </div>
          <div className={styles.trackHeaderStats}>
            <div className={styles.headerStat}>
              <span className={styles.headerStatNum} style={{ color: '#22C55E' }}>{available}</span>
              <span>Available</span>
            </div>
            <div className={styles.headerStat}>
              <span className={styles.headerStatNum} style={{ color: '#0057FF' }}>{enRoute}</span>
              <span>En Route</span>
            </div>
            <div className={styles.headerStat}>
              <span className={styles.headerStatNum}>{mechanics.length}</span>
              <span>Total</span>
            </div>
          </div>
          <div className={styles.trackHeaderActions}>
            <button
              className={`btn btn-ghost ${styles.locateBtn}`}
              onClick={getUserLocation}
              disabled={locating}
              id="locate-me-btn"
            >
              {locating ? '⏳ Locating…' : '📍 Update My Location'}
            </button>
            <Link href="/book" className="btn btn-primary" id="track-book-btn">
              📅 Book a Mechanic
            </Link>
          </div>
        </div>
        {locError && <div className={styles.locError}>⚠️ {locError}</div>}
      </div>

      {/* ── Main Body ── */}
      <div className={styles.trackBody}>
        {/* ── Sidebar ── */}
        <aside className={styles.sidebar}>
          {/* Filter Tabs */}
          <div className={styles.filterTabs}>
            {['all', 'available', 'en-route', 'busy'].map((f) => (
              <button
                key={f}
                className={`${styles.filterTab} ${filter === f ? styles.filterTabActive : ''}`}
                onClick={() => setFilter(f)}
                id={`filter-${f}`}
              >
                {f === 'all' ? 'All' : STATUS_META[f]?.icon + ' ' + STATUS_META[f]?.label}
              </button>
            ))}
          </div>

          {/* Mechanic List */}
          <div className={styles.mechanicList}>
            {filtered.length === 0 && (
              <div className={styles.emptyState}>No mechanics found for this filter.</div>
            )}
            {filtered.map((m) => (
              <div
                key={m.id}
                className={`${styles.mechanicCard} ${selected?.id === m.id ? styles.mechanicCardSelected : ''}`}
                onClick={() => setSelected(m)}
                id={`mechanic-card-${m.id}`}
              >
                <div className={styles.cardTop}>
                  <div
                    className={styles.cardAvatar}
                    style={{ background: m.color }}
                  >
                    {m.avatar}
                  </div>
                  <div className={styles.cardInfo}>
                    <div className={styles.cardName}>{m.name}</div>
                    <div className={styles.cardSpecialty}>{m.specialty}</div>
                    <div className={styles.cardRating}>
                      ⭐ {m.rating} &nbsp;·&nbsp; {m.jobs} jobs
                    </div>
                  </div>
                  <span
                    className={styles.statusBadge}
                    style={{ background: `${m.color}22`, color: m.color, borderColor: `${m.color}55` }}
                  >
                    {STATUS_META[m.status].icon} {STATUS_META[m.status].label}
                  </span>
                </div>

                <div className={styles.cardMeta}>
                  <div className={styles.cardMetaItem}>
                    <span className={styles.cardMetaIcon}>📏</span>
                    <span>{m.dist != null ? `${m.dist.toFixed(1)} km away` : 'Calculating…'}</span>
                  </div>
                  <div className={styles.cardMetaItem}>
                    <span className={styles.cardMetaIcon}>⏱️</span>
                    <span>ETA {m.eta}</span>
                  </div>
                </div>

                {selected?.id === m.id && (
                  <div className={styles.cardActions}>
                    <a
                      href={`tel:${m.phone}`}
                      className="btn btn-ghost"
                      style={{ flex: 1, fontSize: 13, padding: '10px 12px' }}
                      id={`call-mechanic-${m.id}`}
                    >
                      📞 Call
                    </a>
                    <a
                      href={`https://wa.me/233${m.phone.replace(/^0/, '')}?text=Hi%20${encodeURIComponent(m.name)}%2C%20I%20need%20help%20with%20my%20car.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost"
                      style={{ flex: 1, fontSize: 13, padding: '10px 12px' }}
                      id={`whatsapp-mechanic-${m.id}`}
                    >
                      💬 WhatsApp
                    </a>
                    <Link
                      href={`/book?mechanic=${m.id}`}
                      className="btn btn-primary"
                      style={{ flex: 1, fontSize: 13, padding: '10px 12px' }}
                      id={`book-mechanic-${m.id}`}
                    >
                      Book
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className={styles.legend}>
            <div className={styles.legendTitle}>Map Legend</div>
            <div className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: '#22C55E' }} />
              Available — Ready to take a job
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: '#0057FF' }} />
              En Route — Heading to a customer
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: '#F59E0B' }} />
              Busy — Currently on a job
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: '#FF6B00' }} />
              You — Your current location
            </div>
          </div>
        </aside>

        {/* ── Map ── */}
        <div className={styles.mapContainer}>
          <LeafletMap
            userLocation={userLocation}
            mechanics={mechanics}
            onMechanicClick={setSelected}
            selectedId={selected?.id}
          />

          {/* Selected mechanic overlay on map */}
          {selected && (
            <div className={styles.mapOverlay} id="map-mechanic-overlay">
              <div className={styles.overlayCard}>
                <button
                  className={styles.overlayClose}
                  onClick={() => setSelected(null)}
                  id="close-overlay-btn"
                >
                  ✕
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    className={styles.overlayAvatar}
                    style={{ background: selected.color }}
                  >
                    {selected.avatar}
                  </div>
                  <div>
                    <div className={styles.overlayName}>{selected.name}</div>
                    <div className={styles.overlaySpec}>{selected.specialty}</div>
                  </div>
                </div>
                <div className={styles.overlayStats}>
                  <div className={styles.overlayStat}>
                    <span>📏 Distance</span>
                    <strong>{selected.dist != null ? `${selected.dist.toFixed(1)} km` : '—'}</strong>
                  </div>
                  <div className={styles.overlayStat}>
                    <span>⏱️ ETA</span>
                    <strong>{selected.eta}</strong>
                  </div>
                  <div className={styles.overlayStat}>
                    <span>⭐ Rating</span>
                    <strong>{selected.rating}</strong>
                  </div>
                  <div className={styles.overlayStat}>
                    <span>🔧 Jobs</span>
                    <strong>{selected.jobs}</strong>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <a href={`tel:${selected.phone}`} className="btn btn-ghost" style={{ flex: 1, fontSize: 13 }} id="overlay-call-btn">
                    📞 Call
                  </a>
                  <Link href="/book" className="btn btn-primary" style={{ flex: 1, fontSize: 13 }} id="overlay-book-btn">
                    📅 Book Now
                  </Link>
                </div>
              </div>

              {/* Moving animation bar for en-route mechanics */}
              {selected.status === 'en-route' && (
                <div className={styles.enRouteBar}>
                  <div className={styles.enRouteBarInner} />
                  <span>🚗 Mechanic is on the way to a customer</span>
                </div>
              )}
            </div>
          )}

          {/* Locate button on map */}
          <button
            className={styles.mapLocateBtn}
            onClick={getUserLocation}
            disabled={locating}
            title="Center on my location"
            id="map-locate-btn"
          >
            {locating ? '⏳' : '🎯'}
          </button>
        </div>
      </div>
    </div>
  );
}
