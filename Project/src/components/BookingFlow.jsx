import React, { useState, useEffect } from 'react';
import API from '../api';
import TourImage from './TourImage';
import { levyPct, priceBreakdown, buildCartItem, cartTotals, formatRM, todayISO, defaultBookingDate } from '../lib/booking';

const CART_KEY = 'ecotour_cart';

const TABS = [
  { id: 'details', label: 'Tour Details', icon: 'fa-circle-info' },
  { id: 'cart', label: 'Cart', icon: 'fa-cart-shopping' },
  { id: 'payment', label: 'Payment', icon: 'fa-credit-card' },
  { id: 'confirm', label: 'Confirmation', icon: 'fa-check-circle' },
];

export default function BookingFlow({ tours, currentUser, onBookingComplete }) {
  const [activeTab, setActiveTab] = useState('details');
  const [selectedTour, setSelectedTour] = useState(null);
  const [tourLoading, setTourLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [bookingDate, setBookingDate] = useState(defaultBookingDate());
  const [participants, setParticipants] = useState(2);
  // Confirmation keeps its own totals snapshot — the cart is emptied on
  // success, so reading cart totals here would always show RM 0.
  const [confirmation, setConfirmation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cart persists across page refreshes (browser-based caching requirement).
  useEffect(() => {
    const saved = localStorage.getItem(CART_KEY);
    if (saved) { try { setCart(JSON.parse(saved)); } catch {} }
  }, []);

  const saveCart = (next) => {
    setCart(next);
    localStorage.setItem(CART_KEY, JSON.stringify(next));
  };

  const openTour = (tourId) => {
    setTourLoading(true);
    setError(null);
    API.getTour(tourId)
      .then(r => setSelectedTour(r.data))
      .catch(e => setError(e.message))
      .finally(() => setTourLoading(false));
  };

  const addToCart = (tour) => {
    if (bookingDate < todayISO()) { setError('Please choose a date in the future.'); return; }
    saveCart([...cart, buildCartItem(tour, bookingDate, participants)]);
    setActiveTab('cart');
  };

  const removeFromCart = (idx) => saveCart(cart.filter((_, i) => i !== idx));

  const handlePayment = async () => {
    if (!currentUser) { setError('Please sign in first.'); return; }
    if (cart.length === 0) { setError('Your cart is empty.'); return; }
    setLoading(true); setError(null);
    const booked = [];
    const remaining = [...cart];
    try {
      for (const item of cart) {
        const r = await API.createBooking({ tour_id: item.tour_id, date: item.date, participants: item.participants });
        booked.push(r.data);
        remaining.shift();
      }
      setConfirmation({ bookings: booked, levy: cartTotals(cart).levy });
      saveCart([]);
      setActiveTab('confirm');
    } catch (e) {
      // Keep unbooked items in the cart so the user can retry just those.
      saveCart(remaining);
      setError(booked.length > 0
        ? `${booked.length} booking(s) succeeded, but one failed: ${e.message} The remaining items are still in your cart.`
        : e.message);
    } finally {
      setLoading(false);
      // Tell the app at least one booking landed so Profile/history refresh.
      if (booked.length > 0) onBookingComplete?.();
    }
  };

  const totals = cartTotals(cart);
  const maxGroup = selectedTour?.group_size || 8;
  const tourPct = selectedTour ? levyPct(selectedTour.funds) : 0;
  const breakdown = selectedTour ? priceBreakdown(selectedTour.price, participants, tourPct) : null;

  return (
    <section id="booking" className="bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
      <div className="flex border-b border-stone-200 bg-stone-50 overflow-x-auto" role="tablist" aria-label="Booking steps">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} role="tab" aria-selected={activeTab === tab.id}
            className={'flex-1 py-4 px-6 font-medium flex items-center justify-center gap-2 whitespace-nowrap transition ' + (activeTab === tab.id ? 'text-primary border-b-2 border-primary bg-white' : 'text-stone-500 border-b-2 border-transparent hover:text-primary')}>
            <i className={'fa-solid ' + tab.icon} aria-hidden="true"></i> {tab.label}
            {tab.id === 'cart' && cart.length > 0 && <span className="bg-primary text-white text-xs rounded-full px-2">{cart.length}</span>}
          </button>
        ))}
      </div>
      <div className="p-6 md:p-8">
        {error && (
          <div role="alert" className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">
            {error}
            <button onClick={() => setError(null)} aria-label="Dismiss error" className="float-right font-bold">&times;</button>
          </div>
        )}

        {activeTab === 'details' && (
          <div>
            {tourLoading ? (
              <p className="text-center text-stone-400 py-12" role="status"><i className="fa-solid fa-spinner fa-spin mr-2" aria-hidden="true"></i>Loading tour…</p>
            ) : selectedTour ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <TourImage tour={selectedTour} className="h-56 rounded-xl mb-4" />
                  <h2 className="text-2xl font-bold text-stone-900 mb-2">{selectedTour.title}</h2>
                  <div className="flex items-center gap-4 mb-6 text-sm text-stone-600">
                    <span><i className="fa-solid fa-leaf text-primary" aria-hidden="true"></i> Eco Score {selectedTour.eco_score}/100</span>
                    <span><i className="fa-solid fa-user-shield text-primary" aria-hidden="true"></i> {selectedTour.business_name}</span>
                  </div>
                  <p className="text-stone-600 mb-6">{selectedTour.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-stone-50 p-3 rounded-lg text-center"><div className="text-xs text-stone-500">Duration</div><div className="font-bold">{selectedTour.duration}</div></div>
                    <div className="bg-stone-50 p-3 rounded-lg text-center"><div className="text-xs text-stone-500">Group</div><div className="font-bold">Max {selectedTour.group_size}</div></div>
                    <div className="bg-stone-50 p-3 rounded-lg text-center"><div className="text-xs text-stone-500">Difficulty</div><div className="font-bold capitalize">{selectedTour.difficulty}</div></div>
                    <div className="bg-stone-50 p-3 rounded-lg text-center"><div className="text-xs text-stone-500">State</div><div className="font-bold">{selectedTour.state}</div></div>
                  </div>
                  {selectedTour.funds?.length > 0 && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                      <h3 className="font-bold text-emerald-900 text-sm mb-2"><i className="fa-solid fa-leaf" aria-hidden="true"></i> Conservation breakdown for this tour</h3>
                      <ul className="text-sm text-emerald-800 space-y-1">
                        {selectedTour.funds.map(f => (
                          <li key={f.fund_id} className="flex justify-between"><span>{f.fund_name}</span><span>{Number(f.allocation_pct)}%</span></li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="bg-stone-50 p-6 rounded-xl border border-stone-200 sticky top-24">
                  <div className="text-3xl font-bold mb-1">RM {selectedTour.price} <span className="text-sm font-normal text-stone-500">/ person</span></div>
                  <p className="text-xs text-primary mb-6">Includes {tourPct}% conservation levy</p>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label htmlFor="booking-date" className="block text-sm font-medium mb-1">Date</label>
                      <input id="booking-date" type="date" value={bookingDate} min={todayISO()} onChange={e => setBookingDate(e.target.value)} className="w-full border rounded-lg p-2 text-sm" />
                    </div>
                    <div>
                      <label htmlFor="booking-participants" className="block text-sm font-medium mb-1">Participants</label>
                      <select id="booking-participants" value={Math.min(participants, maxGroup)} onChange={e => setParticipants(Number(e.target.value))} className="w-full border rounded-lg p-2 text-sm">
                        {Array.from({ length: maxGroup }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n} {n === 1 ? 'person' : 'persons'}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="border-t pt-4 space-y-2 mb-6 text-sm">
                    <div className="flex justify-between"><span>{participants} × RM {selectedTour.price}</span><span>{formatRM(breakdown.subtotal)}</span></div>
                    <div className="flex justify-between text-primary"><span>Conservation levy ({tourPct}%)</span><span>{formatRM(breakdown.levy)}</span></div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t"><span>Total</span><span>{formatRM(breakdown.total)}</span></div>
                  </div>
                  <button onClick={() => addToCart(selectedTour)} className="w-full bg-primary hover:bg-emerald-700 text-white py-3 rounded-lg font-bold transition shadow-md">Add to Cart</button>
                  <button onClick={() => setSelectedTour(null)} className="w-full text-stone-500 hover:text-stone-700 text-sm mt-2">← Back to tours</button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tours.map(tour => (
                  <button key={tour.tour_id} onClick={() => openTour(tour.tour_id)}
                    className="text-left cursor-pointer bg-stone-50 p-4 rounded-xl border border-stone-200 hover:border-primary hover:shadow-md transition">
                    <i className={'fa-solid ' + (tour.icon || 'fa-tree') + ' text-3xl text-primary mb-3'} aria-hidden="true"></i>
                    <h3 className="font-bold">{tour.title}</h3>
                    <p className="text-sm text-stone-500">{tour.location}, {tour.state}</p>
                    <div className="flex justify-between mt-3"><span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Eco {tour.eco_score}</span><span className="font-bold text-primary">RM {tour.price}</span></div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'cart' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Your Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})</h2>
            {cart.length === 0 ? <p className="text-stone-400 text-center py-12">Cart is empty.</p> : (
              <>
                {cart.map((item, i) => (
                  <div key={i} className="bg-stone-50 p-6 rounded-xl border mb-4 flex justify-between items-center">
                    <div><h3 className="font-bold">{item.title}</h3><p className="text-sm text-stone-500">{item.date} · {item.participants} {item.participants === 1 ? 'person' : 'persons'} · {item.operator}</p></div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold">{formatRM(item.total)}</span>
                      <button onClick={() => removeFromCart(i)} aria-label={'Remove ' + item.title + ' from cart'} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
                    </div>
                  </div>
                ))}
                <div className="mt-8 flex gap-4">
                  <button onClick={() => setActiveTab('payment')} className="flex-1 bg-primary hover:bg-emerald-700 text-white py-3 rounded-lg font-bold transition">Proceed to Payment</button>
                  <button onClick={() => setActiveTab('details')} className="flex-1 bg-white border text-stone-700 py-3 rounded-lg font-bold hover:bg-stone-50 transition">Continue Browsing</button>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="max-w-3xl mx-auto">
            {cart.length === 0 ? (
              <p className="text-stone-400 text-center py-12">Nothing to pay — your cart is empty.</p>
            ) : (
              <>
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg mb-6 flex items-center gap-3">
                  <i className="fa-solid fa-triangle-exclamation text-xl" aria-hidden="true"></i>
                  <div><p className="font-bold">Sandbox Mode Active</p><p className="text-sm">Payment processed through sandbox gateway — no real charge is made.</p></div>
                </div>
                <div className="bg-stone-50 p-6 rounded-xl mb-6">
                  <h3 className="font-bold text-lg mb-4">Order Summary</h3>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between"><span>Subtotal</span><span>{formatRM(totals.subtotal)}</span></div>
                    <div className="flex justify-between"><span>Conservation Levy</span><span>{formatRM(totals.levy)}</span></div>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-4 border-t"><span>Total</span><span>{formatRM(totals.total)}</span></div>
                </div>
                {!currentUser && <p className="text-sm text-stone-500 mb-4 text-center">You need to sign in before paying.</p>}
                <div className="flex gap-4">
                  <button onClick={handlePayment} disabled={loading || !currentUser} className="flex-1 bg-primary hover:bg-emerald-700 text-white py-3 rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? <><i className="fa-solid fa-spinner fa-spin mr-2" aria-hidden="true"></i>Processing…</> : 'Confirm & Pay ' + formatRM(totals.total)}
                  </button>
                  <button onClick={() => setActiveTab('cart')} disabled={loading} className="flex-1 bg-white border text-stone-700 py-3 rounded-lg font-bold hover:bg-stone-50 transition">Back</button>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'confirm' && (
          <div className="max-w-2xl mx-auto text-center py-8">
            {confirmation ? (
              <>
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"><i className="fa-solid fa-check text-4xl text-primary" aria-hidden="true"></i></div>
                <h2 className="text-3xl font-bold mb-2">Booking Confirmed!</h2>
                <div className="text-stone-600 mb-8">
                  {confirmation.bookings.map(c => <span key={c.booking_id} className="block font-mono bg-stone-100 px-2 py-1 rounded text-sm my-1">Booking ID: {c.booking_ref}</span>)}
                </div>
                <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 text-left mb-8">
                  <h3 className="font-bold text-emerald-900 mb-2"><i className="fa-solid fa-leaf" aria-hidden="true"></i> Your Conservation Impact</h3>
                  <p className="text-sm text-emerald-800">{formatRM(confirmation.levy)} split to verified conservation projects. See the <a href="#fund" className="underline font-medium">Fund Tracker</a> for the live ledger.</p>
                </div>
              </>
            ) : (
              <p className="text-stone-400 py-12">No confirmed booking yet — complete a payment first.</p>
            )}
            <button onClick={() => { setActiveTab('details'); setConfirmation(null); }} className="bg-stone-100 hover:bg-stone-200 text-stone-800 px-6 py-2 rounded-lg font-medium">Explore More Tours</button>
          </div>
        )}
      </div>
    </section>
  );
}
