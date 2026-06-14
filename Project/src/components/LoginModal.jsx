import React, { useState } from 'react';
import API from '../api';

/**
 * Sign-in / registration modal. On success the authenticated user object is
 * passed to onLogin; the PHP session cookie is set by the server.
 */
export default function LoginModal({ onClose, onLogin }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === 'register') {
        await API.register({ full_name: fullName, email, password });
      }
      const r = await API.login(email, password);
      localStorage.setItem('ecotour_user', JSON.stringify(r.data));
      onLogin(r.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" role="dialog" aria-modal="true" aria-label={mode === 'login' ? 'Sign in' : 'Create account'}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
        <button onClick={onClose} aria-label="Close dialog" className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 text-2xl">&times;</button>
        <div className="text-center mb-6">
          <i className="fa-solid fa-leaf text-primary text-4xl mb-2" aria-hidden="true"></i>
          <h2 className="text-2xl font-bold">{mode === 'login' ? 'Welcome to EcoTour' : 'Create your account'}</h2>
        </div>
        {error && <div role="alert" className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label htmlFor="login-name" className="block text-sm font-medium mb-1">Full Name</label>
              <input id="login-name" type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full border rounded-lg p-2" required maxLength={100} autoComplete="name" />
            </div>
          )}
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium mb-1">Email</label>
            <input id="login-email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded-lg p-2" required autoComplete="email" />
          </div>
          <div>
            <label htmlFor="login-password" className="block text-sm font-medium mb-1">Password</label>
            <input id="login-password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border rounded-lg p-2" required
              minLength={mode === 'register' ? 8 : undefined} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} />
            {mode === 'register' && <p className="text-xs text-stone-400 mt-1">At least 8 characters.</p>}
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-emerald-700 text-white py-3 rounded-lg font-bold transition disabled:opacity-50">
            {loading ? (mode === 'login' ? 'Signing in…' : 'Creating account…') : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>
        <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); }}
          className="w-full text-sm text-primary hover:underline mt-4">
          {mode === 'login' ? "Don't have an account? Register" : 'Already have an account? Sign in'}
        </button>
        <p className="text-xs text-stone-400 text-center mt-4">Demo account: rezza@ecotour.my / password123</p>
      </div>
    </div>
  );
}
