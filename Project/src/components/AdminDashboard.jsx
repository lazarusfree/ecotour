import React, { useState, useEffect } from 'react';
import API from '../api';

const ACTION_LABELS = { approve: 'approved', reject: 'rejected', flag: 'flagged' };

export default function AdminDashboard({ currentUser }) {
  const [pending, setPending] = useState([]);
  const [verifiedCount, setVerifiedCount] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    if (!isAdmin) return;
    API.getPendingOperators().then(r => setPending(r.data || [])).catch(e => setError(e.message));
    API.getStats().then(r => setVerifiedCount(r.data?.operator_count ?? null)).catch(() => {});
  }, [isAdmin]);

  const handleAction = async (id, action) => {
    setError(null);
    try {
      await API.verifyOperator(id, action);
      setPending(pending.filter(p => p.operator_id !== id));
      if (action === 'approve') setVerifiedCount(c => (c == null ? c : c + 1));
      setMessage('Operator ' + ACTION_LABELS[action]);
      setTimeout(() => setMessage(null), 3000);
    } catch (e) {
      setError(e.message);
    }
  };

  // The backend rejects non-admin calls anyway (401/403) — this just shows
  // a friendly explanation instead of an error.
  if (!isAdmin) {
    return (
      <section id="admin" className="bg-white rounded-2xl shadow-xl border border-stone-200 p-8 text-center">
        <i className="fa-solid fa-user-shield text-5xl text-stone-300 mb-4" aria-hidden="true"></i>
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Admin Verification Dashboard</h2>
        <p className="text-stone-500">Sign in with an administrator account to review operator applications.</p>
      </section>
    );
  }

  return (
    <section id="admin" className="bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
      <div className="p-6 border-b bg-stone-50 flex flex-wrap gap-4 justify-between items-center">
        <div><h2 className="text-2xl font-bold">Admin Verification Dashboard</h2><p className="text-stone-600 text-sm">Review operator applications</p></div>
        <div className="flex gap-4">
          <div className="text-center"><div className="text-2xl font-bold text-primary">{verifiedCount ?? '—'}</div><div className="text-xs text-stone-500">Verified</div></div>
          <div className="text-center"><div className="text-2xl font-bold text-amber-500">{pending.length}</div><div className="text-xs text-stone-500">Pending</div></div>
        </div>
      </div>
      <div className="p-6">
        {message && <div role="status" className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-sm">{message}</div>}
        {error && <div role="alert" className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        <div className="space-y-4">
          {pending.map(op => (
            <div key={op.operator_id} className="flex flex-wrap gap-4 items-center justify-between p-4 bg-stone-50 rounded-lg border">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold" aria-hidden="true">{op.business_name?.charAt(0)}</div>
                <div>
                  <div className="font-bold">{op.business_name}</div>
                  <div className="text-xs text-stone-500">{op.location} · Score: {op.eco_score} {op.verification_status === 'flagged' && <span className="text-red-500 font-bold">· Flagged</span>}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleAction(op.operator_id, 'approve')} className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200">Approve</button>
                <button onClick={() => handleAction(op.operator_id, 'reject')} className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200">Reject</button>
              </div>
            </div>
          ))}
          {pending.length === 0 && <p className="text-center text-stone-400 py-8">No pending operators.</p>}
        </div>
      </div>
    </section>
  );
}
