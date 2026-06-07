'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Search } from 'lucide-react';

function ReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestId = searchParams.get('id');
  const [request, setRequest] = useState(null);
  const [editedRates, setEditedRates] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/buyer/pli?tile=all`).then(r => r.json()).then(data => {
      const found = (data.requests || []).find(r => r.id === requestId);
      if (found) {
        setRequest(found);
        const rates = {};
        found.items.forEach(item => { rates[item.id] = item.effectiveRate; });
        setEditedRates(rates);
      }
    });
  }, [requestId]);

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/buyer/pli', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'edit', requestId, rates: editedRates })
    });
    setSaving(false);
    alert('Effective rates updated! Email sent to Vendor and Category Manager.');
    router.push('/buyer/pli');
  };

  if (!request) return (<div className="flex items-center justify-center h-[80vh]"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"/></div>);

  const filteredItems = request.items.filter(item =>
    item.componentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.componentDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => router.push('/buyer/pli')} className="p-1.5 hover:bg-slate-200 rounded-lg"><ArrowLeft size={18} className="text-slate-600"/></button>
        <h2 className="font-display text-xl font-bold text-slate-800">Review Items</h2>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <div className="relative max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
            <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search..." className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead><tr><th>Plant</th><th>Component(Purchasing SAP Code)</th><th>Component Description</th><th>UOM</th><th>Effective Quarter</th><th>Effective Rate (INR)</th></tr></thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item.id}>
                  <td>{item.plant}</td>
                  <td className="font-mono text-xs">{item.componentCode}</td>
                  <td>{item.componentDescription}</td>
                  <td>{item.uom}</td>
                  <td>{item.effectiveQuarter}</td>
                  <td><div className="flex items-center gap-1 justify-end"><span className="text-slate-400">₹</span><input type="number" value={editedRates[item.id] || ''} onChange={e => setEditedRates({ ...editedRates, [item.id]: parseFloat(e.target.value) || 0 })} className="w-28 px-3 py-1.5 border border-slate-200 bg-slate-50 rounded-lg text-sm font-medium text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"/></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-end gap-4 px-5 py-3 border-t border-slate-100 text-xs text-slate-500">
          <span>Rows per page: 25</span>
          <span>1-{filteredItems.length} of {filteredItems.length}</span>
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-5">
        <button onClick={() => router.push('/buyer/pli')} className="px-6 py-2.5 text-sm font-medium border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
        <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 text-sm font-medium text-white bg-blue-900 rounded-lg hover:bg-blue-950 disabled:opacity-50">{saving ? 'Saving...' : 'Save & Send Request'}</button>
      </div>
    </div>
  );
}

export default function BuyerReviewPage() {
  return (<Suspense fallback={<div className="flex items-center justify-center h-[80vh]"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"/></div>}><ReviewContent/></Suspense>);
}
