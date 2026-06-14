import React, { useState } from 'react';
import LoginModal from './LoginModal';

const NAV_LINKS = [
  { href: '#discover', label: 'Discover' },
  { href: '#map', label: 'Map' },
  { href: '#booking', label: 'Book' },
  { href: '#fund', label: 'Fund Tracker' },
  { href: '#profile', label: 'Profile' },
];

export default function Navbar({ currentUser, onLogout, onLogin }) {
  const [showLogin, setShowLogin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // The admin dashboard link is only useful (and only authorized) for admins.
  const links = currentUser?.role === 'admin'
    ? [...NAV_LINKS, { href: '#admin', label: 'Admin' }]
    : NAV_LINKS;

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <a href="#top" className="flex items-center gap-2" aria-label="EcoTour home">
              <i className="fa-solid fa-leaf text-primary text-2xl" aria-hidden="true"></i>
              <span className="text-xl font-bold text-stone-900">EcoTour</span>
            </a>
            <div className="hidden md:flex space-x-8">
              {links.map(l => (
                <a key={l.href} href={l.href} className="text-stone-600 hover:text-primary font-medium transition">{l.label}</a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              {currentUser ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-stone-700 hidden sm:inline">{currentUser.full_name}</span>
                  <button onClick={onLogout} className="text-xs text-red-500 hover:text-red-700">Sign Out</button>
                </div>
              ) : (
                <button onClick={() => setShowLogin(true)} className="bg-primary hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm">
                  Sign In
                </button>
              )}
              <button onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}
                className="md:hidden text-stone-600 hover:text-primary text-xl p-2">
                <i className={'fa-solid ' + (menuOpen ? 'fa-xmark' : 'fa-bars')} aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-stone-200 bg-white px-4 py-2">
            {links.map(l => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                className="block py-3 text-stone-600 hover:text-primary font-medium border-b border-stone-100 last:border-0">{l.label}</a>
            ))}
          </div>
        )}
      </nav>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={(u) => { onLogin(u); setShowLogin(false); }} />}
    </>
  );
}
