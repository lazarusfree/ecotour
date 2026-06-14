import React, { useState } from 'react';
import TourImage from './TourImage';

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'wildlife', label: '🐒 Wildlife' },
  { value: 'jungle_trek', label: '🏕 Jungle Trek' },
  { value: 'river_coast', label: '🌊 River & Coast' },
  { value: 'birdwatching', label: '🦜 Birdwatching' },
  { value: 'community', label: '🌺 Community' },
];

export default function Discover({ tours }) {
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const filtered = tours.filter(t => {
    const matchesCategory = filter === 'all' || t.category === filter;
    const matchesQuery = q === '' ||
      [t.title, t.location, t.state].some(v => (v || '').toLowerCase().includes(q));
    return matchesCategory && matchesQuery;
  });

  return (
    <section id="discover">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-stone-900">Featured Verified Tours</h2>
          <p className="text-stone-600 mt-2">Every listing has passed our Operator Verification Algorithm.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <label htmlFor="discover-search" className="sr-only">Search tours</label>
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" aria-hidden="true"></i>
            <input id="discover-search" type="search" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search by name or location" className="border border-stone-300 rounded-lg p-2 pl-9 text-sm w-full sm:w-64 focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
          </div>
          <label htmlFor="discover-filter" className="sr-only">Filter by category</label>
          <select id="discover-filter" value={filter} onChange={e => setFilter(e.target.value)} className="border border-stone-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary outline-none">
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
      </div>
      {filtered.length === 0 ? (
        <p className="text-stone-400 text-center py-12">No tours match your search.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(tour => (
            <article key={tour.tour_id} className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-lg transition">
              <TourImage tour={tour} className="h-48">
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-xs font-bold text-primary shadow-md">
                  <i className="fa-solid fa-leaf" aria-hidden="true"></i> {tour.eco_score}/100
                </div>
                <div className="absolute top-4 left-4 bg-amber-500 text-white px-2 py-1 rounded text-xs font-bold">
                  {tour.verification_status === 'verified' ? '✓ Verified' : 'Pending'}
                </div>
              </TourImage>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-stone-900">{tour.title}</h3>
                  <span className="text-lg font-bold text-primary whitespace-nowrap">RM {tour.price}</span>
                </div>
                <p className="text-stone-500 text-sm mb-4"><i className="fa-solid fa-location-dot" aria-hidden="true"></i> {tour.location}, {tour.state}</p>
                <p className="text-stone-600 text-sm mb-2">{tour.description?.substring(0, 100)}…</p>
                <div className="flex gap-4 text-xs text-stone-500 mb-4">
                  <span>{tour.duration}</span><span>Max {tour.group_size}</span><span className="capitalize">{tour.difficulty}</span>
                </div>
                <a href="#booking" className="block w-full text-center bg-stone-100 hover:bg-primary hover:text-white text-stone-800 py-2 rounded-lg font-medium transition">
                  View Details
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
