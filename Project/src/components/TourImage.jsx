import React, { useState } from 'react';

/**
 * Tour hero image with a graceful fallback. If the tour has no image_url, or
 * the image fails to load, we fall back to the themed gradient + icon so the
 * card never looks broken. Always renders descriptive alt text for screen
 * readers (WCAG).
 */
export default function TourImage({ tour, className = '', children }) {
  const [failed, setFailed] = useState(false);
  const gradient = tour.image_gradient || 'from-emerald-600 to-green-800';
  const showImage = tour.image_url && !failed;

  return (
    <div className={'relative overflow-hidden bg-gradient-to-br ' + gradient + ' ' + className}>
      {showImage ? (
        <img
          src={tour.image_url}
          alt={`${tour.title} — ${tour.location}, ${tour.state}`}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <i className={'fa-solid ' + (tour.icon || 'fa-tree') + ' text-6xl text-white/30'} aria-hidden="true"></i>
        </div>
      )}
      {children}
    </div>
  );
}
