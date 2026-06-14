import React, { useState, useEffect } from 'react';
import API from '../api';
import { formatRM } from '../lib/booking';

export default function Profile({ currentUser, onLogin, refreshKey }) {
  const [bookings, setBookings] = useState([]);
  const [fundStats, setFundStats] = useState(null);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState(null);

  // Refetch when the user changes OR when refreshKey is bumped after a new
  // booking, so the history and contributions stay in sync without a reload.
  useEffect(() => {
    if (currentUser) {
      API.getBookings().then(r => setBookings(r.data || [])).catch(() => {});
      API.getFundStats().then(r => setFundStats(r.data)).catch(() => {});
    } else {
      setBookings([]);
    }
  }, [currentUser, refreshKey]);

  // Performs a real login so the server session exists — a fake client-side
  // user would fail every authenticated API call.
  const handleDemoLogin = async () => {
    setDemoLoading(true);
    setError(null);
    try {
      const r = await API.login('rezza@ecotour.my', 'password123');
      localStorage.setItem('ecotour_user', JSON.stringify(r.data));
      onLogin(r.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setDemoLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <section id="profile" className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <i className="fa-solid fa-user-circle text-6xl text-stone-300 mb-4" aria-hidden="true"></i>
        <h2 className="text-2xl font-bold text-stone-900 mb-2">My Eco-Impact Profile</h2>
        <p className="text-stone-500 mb-6">Sign in to track your conservation contributions and booking history.</p>
        {error && <div role="alert" className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm max-w-md mx-auto">{error}</div>}
        <button onClick={handleDemoLogin} disabled={demoLoading}
          className="bg-primary hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition disabled:opacity-50">
          {demoLoading ? 'Signing in…' : 'Sign In (Demo)'}
        </button>
      </section>
    );
  }

  // Personal impact comes from the user's own bookings, not platform totals.
  const totalContributed = bookings.reduce((s, b) => s + Number(b.conservation_levy || 0), 0);
  const statesVisited = new Set(bookings.map(b => b.state).filter(Boolean)).size;
  const platformTotal = fundStats?.funds?.reduce((s, f) => s + Number(f.collected_amount || 0), 0) || 0;

  return (
    <section id="profile" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 text-center sticky top-24">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl text-primary" aria-hidden="true">
            <i className="fa-solid fa-user"></i>
          </div>
          <h3 className="text-xl font-bold text-stone-900">{currentUser.full_name}</h3>
          <p className="text-sm text-stone-500 mb-4 capitalize">{currentUser.role}</p>
          <div className="grid grid-cols-3 gap-2 mb-6 text-center">
            <div className="bg-stone-50 p-2 rounded"><div className="text-xl font-bold">{bookings.length}</div><div className="text-xs text-stone-500">Trips</div></div>
            <div className="bg-stone-50 p-2 rounded"><div className="text-xl font-bold text-primary">{formatRM(totalContributed)}</div><div className="text-xs text-stone-500">Contributed</div></div>
            <div className="bg-stone-50 p-2 rounded"><div className="text-xl font-bold">{statesVisited}</div><div className="text-xs text-stone-500">States</div></div>
          </div>
        </div>
      </div>
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
          <h3 className="font-bold text-stone-900 mb-1">Where Conservation Funds Go</h3>
          <p className="text-xs text-stone-400 mb-4">Platform-wide totals across all travelers</p>
          {['wildlife', 'community', 'reforestation'].map(cat => {
            const amt = fundStats?.funds?.filter(f => f.category === cat).reduce((s, f) => s + Number(f.collected_amount || 0), 0) || 0;
            const pct = platformTotal > 0 ? Math.round(amt / platformTotal * 100) : 0;
            const bar = cat === 'wildlife' ? 'bg-amber-500' : cat === 'community' ? 'bg-blue-500' : 'bg-green-500';
            return (
              <div key={cat} className="mb-4">
                <div className="flex justify-between mb-1 text-sm">
                  <span className="font-medium capitalize">{cat}</span>
                  <span className="font-bold">RM {Math.round(amt).toLocaleString()}</span>
                </div>
                <div className="w-full bg-stone-200 rounded-full h-2" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={cat + ' fund share'}>
                  <div className={bar + ' h-2 rounded-full'} style={{ width: pct + '%' }}></div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
          <h3 className="font-bold text-stone-900 mb-4">Booking History</h3>
          <div className="space-y-4">
            {bookings.length === 0 && <p className="text-stone-400 text-center py-4">No bookings yet.</p>}
            {bookings.map(b => (
              <div key={b.booking_id} className={'flex items-center gap-4 p-3 rounded-lg border ' + (b.status === 'confirmed' ? 'bg-emerald-50 border-emerald-100' : 'bg-stone-50 border-stone-200')}>
                <div className={'w-10 h-10 rounded text-white flex items-center justify-center ' + (b.status === 'confirmed' ? 'bg-emerald-600' : 'bg-amber-600')} aria-hidden="true">
                  <i className={'fa-solid ' + (b.status === 'confirmed' ? 'fa-tree' : 'fa-campground')}></i>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-stone-900">{b.tour_name}</div>
                  <div className="text-xs text-stone-500">{b.location} · {new Date(b.booking_date).toLocaleDateString()} · {b.booking_ref}</div>
                </div>
                <span className={'px-2 py-1 rounded text-xs font-bold capitalize ' + (b.status === 'confirmed' ? 'bg-emerald-200 text-emerald-800' : b.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-stone-200 text-stone-600')}>
                  {b.status === 'confirmed' ? 'Upcoming' : b.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
