import React, { useState, useEffect } from 'react';
import API from './api';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Discover from './components/Discover';
import HiddenGems from './components/HiddenGems';
import MapSection from './components/MapSection';
import ExperienceVideo from './components/ExperienceVideo';
import BookingFlow from './components/BookingFlow';
import FundTracker from './components/FundTracker';
import AdminDashboard from './components/AdminDashboard';
import Profile from './components/Profile';
import Footer from './components/Footer';

const USER_KEY = 'ecotour_user';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [tours, setTours] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  // Bumped whenever a booking completes so dependent sections (Profile booking
  // history, fund contributions) refetch without a page reload.
  const [bookingVersion, setBookingVersion] = useState(0);

  // Restore the session: paint immediately from localStorage, then confirm
  // with the server — the PHP session cookie may have expired, in which case
  // authenticated calls would fail, so we sign the user out cleanly.
  useEffect(() => {
    const saved = localStorage.getItem(USER_KEY);
    if (saved) {
      try { setCurrentUser(JSON.parse(saved)); } catch {}
      API.getSession()
        .then(r => setCurrentUser(r.data))
        .catch(() => {
          setCurrentUser(null);
          localStorage.removeItem(USER_KEY);
        });
    }
  }, []);

  // Load shared page data.
  useEffect(() => {
    Promise.all([
      API.getTours().catch(() => ({ data: [] })),
      API.getStats().catch(() => ({ data: null })),
    ]).then(([toursRes, statsRes]) => {
      setTours(toursRes.data || []);
      setStats(statsRes.data);
    }).finally(() => setLoading(false));
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  };

  const handleLogout = () => {
    API.logout().catch(() => {}); // best effort — clear locally regardless
    setCurrentUser(null);
    localStorage.removeItem(USER_KEY);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-stone-50" role="status">
        <div className="text-center">
          <i className="fa-solid fa-leaf text-primary text-5xl mb-4 animate-bounce" aria-hidden="true"></i>
          <p className="text-stone-600 text-lg">Loading EcoTour...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar currentUser={currentUser} onLogout={handleLogout} onLogin={handleLogin} />
      <Hero stats={stats} />

      {/* A page may only have one <main>; full-width sections live inside it. */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
          <Discover tours={tours} currentUser={currentUser} />
          <HiddenGems tours={tours.filter(t => t.operator_score && t.operator_score < 85)} />
          <ExperienceVideo />
        </div>

        <MapSection tours={tours} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
          <BookingFlow tours={tours} currentUser={currentUser} onBookingComplete={() => setBookingVersion(v => v + 1)} />
        </div>

        <FundTracker />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
          <AdminDashboard currentUser={currentUser} />
          <Profile currentUser={currentUser} onLogin={handleLogin} refreshKey={bookingVersion} />
        </div>
      </main>

      <Footer />
    </>
  );
}
