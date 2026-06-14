import React from 'react';

/**
 * Hero banner with live platform stats. Falls back to an em-dash when the
 * stats API is unreachable — never to fabricated numbers, and `??` (not `||`)
 * so a legitimate 0 still displays.
 */
export default function Hero({ stats }) {
  const stat = (key) => (stats && stats[key] != null ? stats[key] : '—');

  return (
    <header id="top" className="relative bg-gradient-to-br from-forest to-emerald-800 text-white overflow-hidden">
      {/* Rainforest backdrop, dimmed so foreground text keeps high contrast (WCAG). */}
      <img
        src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=70"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-forest/80 to-emerald-900/70" aria-hidden="true"></div>
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-400 rounded-full blur-3xl"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28">
        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Explore Malaysia <span className="text-amber-400">Responsibly</span>
          </h1>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl">
            Verified eco-operators. Transparent conservation funds. Authentic wilderness experiences.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
            <div className="text-2xl font-bold">{stat('operator_count')}</div>
            <div className="text-sm text-emerald-200">Verified Operators</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
            <div className="text-2xl font-bold">{stats?.total_funded != null ? 'RM ' + Math.round(stats.total_funded).toLocaleString() : '—'}</div>
            <div className="text-sm text-emerald-200">Conservation Funded</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
            <div className="text-2xl font-bold">{stat('states_covered')}</div>
            <div className="text-sm text-emerald-200">States Covered</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
            <div className="text-2xl font-bold">{stat('avg_eco_score')}<span className="text-base font-normal">/100</span></div>
            <div className="text-sm text-emerald-200">Avg. Eco Score</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href="#map" className="px-4 py-2 bg-white text-forest rounded-full font-medium shadow-md hover:bg-stone-100 transition">🗺 Explore Map</a>
          {['🐒 Wildlife', '🏕 Jungle Trek', '🌊 River & Coast', '🦜 Birdwatching', '🌺 Community'].map(label => (
            <a key={label} href="#discover" className="px-4 py-2 bg-emerald-700/50 border border-emerald-500 text-white rounded-full font-medium hover:bg-emerald-700 transition">{label}</a>
          ))}
        </div>
      </div>
    </header>
  );
}
