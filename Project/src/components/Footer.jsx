import React from 'react';
export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <i className="fa-solid fa-leaf text-primary text-2xl"></i>
          <span className="text-xl font-bold text-white">EcoTour</span>
        </div>
        <p className="mb-6">Sustainable Eco-Tourism Marketplace for Malaysian Experiences</p>
        <p className="text-xs">&copy; 2026 EcoTour Malaysia. All rights reserved.</p>
      </div>
    </footer>
  );
}
