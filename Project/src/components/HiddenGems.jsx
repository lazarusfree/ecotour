import React from 'react';
import TourImage from './TourImage';

export default function HiddenGems({ tours }) {
  if (!tours || tours.length === 0) return null;
  return (
    <section>
      <h2 className="text-3xl font-bold text-stone-900 mb-2">Hidden Gems Near You</h2>
      <p className="text-stone-600 mb-8">Small community operators surfaced by our geospatial algorithm.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tours.slice(0, 4).map(tour => (
          <a key={tour.tour_id} href="#booking" className="flex items-center gap-4 bg-white p-4 rounded-xl border border-stone-200 shadow-sm hover:shadow-md hover:border-primary transition">
            <TourImage tour={tour} className="w-16 h-16 rounded-lg flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-bold text-stone-900">{tour.title}</h3>
              <p className="text-sm text-stone-500">{tour.location}, {tour.state}</p>
            </div>
            <div className="text-right"><div className="font-bold text-primary">RM {tour.price}</div><div className="text-xs text-stone-400">/pax</div></div>
          </a>
        ))}
      </div>
    </section>
  );
}
