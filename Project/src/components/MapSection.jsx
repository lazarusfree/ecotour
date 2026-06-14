import React, { useEffect, useRef, useState } from 'react';

const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
const LEAFLET_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
const MALAYSIA_CENTER = [4.2, 108.5];

/** Loads Leaflet from CDN once; resolves with the global L object. */
function loadLeaflet() {
  if (window.L) return Promise.resolve(window.L);
  if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = LEAFLET_CSS;
    document.head.appendChild(link);
  }
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${LEAFLET_JS}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(window.L));
      existing.addEventListener('error', reject);
      return;
    }
    const script = document.createElement('script');
    script.src = LEAFLET_JS;
    script.onload = () => resolve(window.L);
    script.onerror = () => reject(new Error('Failed to load Leaflet'));
    document.body.appendChild(script);
  });
}

/**
 * Real interactive map (Leaflet + OpenStreetMap — the external geocoding/map
 * API integration). Tours with coordinates become clickable markers; if the
 * CDN is unreachable or no tour has coordinates, a decorative fallback with
 * positioned pins is shown instead.
 */
export default function MapSection({ tours }) {
  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const [mapFailed, setMapFailed] = useState(false);

  const located = tours.filter(t => t.latitude != null && t.longitude != null);
  const stateCount = new Set(tours.map(t => t.state)).size;

  useEffect(() => {
    if (located.length === 0 || !mapEl.current || mapRef.current) return;
    let cancelled = false;

    loadLeaflet().then(L => {
      if (cancelled || !mapEl.current) return;
      const map = L.map(mapEl.current).setView(MALAYSIA_CENTER, 6);
      mapRef.current = map;
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      located.forEach(tour => {
        L.marker([Number(tour.latitude), Number(tour.longitude)])
          .addTo(map)
          .bindPopup(
            `<strong>${tour.title}</strong><br>${tour.location}, ${tour.state}<br>` +
            `Eco Score ${tour.eco_score}/100 · RM ${tour.price}<br>` +
            `<a href="#booking">Book this tour</a>`
          );
      });
    }).catch(() => {
      if (!cancelled) setMapFailed(true);
    });

    return () => {
      cancelled = true;
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
    // located is derived from tours; re-running on tours covers it.
  }, [tours]);

  const showRealMap = located.length > 0 && !mapFailed;

  return (
    <section id="map" className="bg-stone-100 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-stone-900 mb-2">Interactive Geospatial Explorer</h2>
        <p className="text-stone-600 mb-8">Pin discovery — click any marker to explore local eco-tours.</p>
        {showRealMap ? (
          <div ref={mapEl} className="rounded-xl h-[400px] border-4 border-white shadow-lg z-0" role="application" aria-label="Map of eco-tour locations in Malaysia"></div>
        ) : (
          <div className="bg-forest rounded-xl h-[400px] relative overflow-hidden border-4 border-white flex items-center justify-center">
            <div className="text-white text-center z-10">
              <i className="fa-solid fa-map-location-dot text-6xl mb-4 text-emerald-400" aria-hidden="true"></i>
              <p className="text-xl font-semibold">Interactive Map</p>
              <p className="text-emerald-200">{tours.length} Locations · {stateCount} States</p>
            </div>
            {tours.slice(0, 6).map((tour, i) => (
              <div key={tour.tour_id} className="absolute bg-amber-400 rounded-full border-2 border-white shadow-lg w-8 h-8 flex items-center justify-center text-xs font-bold text-forest cursor-pointer hover:scale-125 transition"
                style={{ top: (20 + i * 12) + '%', left: (25 + i * 10) + '%' }} title={tour.title}>
                {tour.eco_score}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
