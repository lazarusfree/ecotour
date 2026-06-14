import React, { useState, useEffect } from 'react';
import API from '../api';

export default function FundTracker() {
  const [funds, setFunds] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [totalCollected, setTotalCollected] = useState(0);

  useEffect(() => {
    API.getFundStats().then(r => { setFunds(r.data.funds || []); setTotalCollected(r.data.total_collected || 0); }).catch(() => {});
    API.getLedger().then(r => setLedger(r.data || [])).catch(() => {});
  }, []);

  const catTotal = (cat) => funds.filter(f => f.category === cat).reduce((s, f) => s + Number(f.collected_amount || 0), 0);

  return (
    <section id="fund" className="bg-gradient-to-br from-forest to-emerald-800 text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-2">Conservation Fund Tracker</h2>
        <p className="text-emerald-200 mb-8">Real-time payment ledger showing where every ringgit flows.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white/10 p-4 rounded-xl border border-white/20"><div className="text-2xl font-bold">RM {Math.round(totalCollected/1000)}K</div><div className="text-sm text-emerald-200">Total</div></div>
          <div className="bg-white/10 p-4 rounded-xl border border-white/20"><div className="text-2xl font-bold">RM {Math.round(catTotal('wildlife')/1000)}K</div><div className="text-sm text-emerald-200">Wildlife</div></div>
          <div className="bg-white/10 p-4 rounded-xl border border-white/20"><div className="text-2xl font-bold">RM {Math.round(catTotal('community')/1000)}K</div><div className="text-sm text-emerald-200">Community</div></div>
          <div className="bg-white/10 p-4 rounded-xl border border-white/20"><div className="text-2xl font-bold">RM {Math.round(catTotal('reforestation')/1000)}K</div><div className="text-sm text-emerald-200">Reforestation</div></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4">Project Impact</h3>
            {funds.map(fund => {
              const pct = fund.target_amount > 0 ? Math.round((fund.collected_amount / fund.target_amount) * 100) : 0;
              const bar = fund.category === 'wildlife' ? 'bg-amber-400' : fund.category === 'community' ? 'bg-blue-400' : 'bg-green-400';
              return (
                <div key={fund.fund_id} className="bg-white/10 p-4 rounded-lg border border-white/20">
                  <div className="flex justify-between mb-2"><span className="font-medium">{fund.name}</span><span className="text-sm">RM {Math.round(fund.collected_amount/1000)}K / {Math.round(fund.target_amount/1000)}K</span></div>
                  <div className="w-full bg-white/20 rounded-full h-2.5"><div className={bar + ' h-2.5 rounded-full'} style={{width: pct + '%'}}></div></div>
                </div>
              );
            })}
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
            <div className="bg-white/10 rounded-lg border border-white/20 divide-y divide-white/10 max-h-96 overflow-y-auto">
              {ledger.map(entry => (
                <div key={entry.ledger_id} className="p-4 flex justify-between"><div><div className="font-medium">{entry.fund_name}</div><div className="text-xs text-emerald-200">#{entry.booking_ref}</div></div><div className="font-bold text-amber-400">+ RM {Number(entry.amount).toFixed(0)}</div></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
