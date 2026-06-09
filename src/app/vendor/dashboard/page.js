'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Filter, Eye, Settings2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import EditFieldsPanel from '@/components/EditFieldsPanel';

const STATUS_CLASSES = { 'Pending Submission':'status-pending', 'Submitted':'status-submitted', 'Closed':'status-closed', 'Cancelled':'status-cancelled', 'Rejected':'status-rejected' };
const ALL_FIELDS = [{ key:'plant', label:'Plant' }, { key:'noOfItems', label:'No. Of Items' }, { key:'pliName', label:'PLI Name' }, { key:'requestDate', label:'Requested Date' }, { key:'status', label:'Status' }];

export default function VendorDashboard() {
  const router = useRouter();
  const [allRequests, setAllRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showFieldsPanel, setShowFieldsPanel] = useState(false);
  const [visibleFields, setVisibleFields] = useState(ALL_FIELDS.map(f => f.key));
  const [filters, setFilters] = useState({ plant:'', pliName:'', status:'' });
  const [page, setPage] = useState(1);
  const rowsPerPage = 25;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = (vendorCode) => {
    if (!vendorCode) return;
    setLoading(true);
    fetch('/api/vendor/pli?vendorCode=' + vendorCode)
      .then(r => r.json())
      .then(data => {
        const reqs = data.requests || [];
        setAllRequests(reqs);
        setFilteredRequests(reqs);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    let vendorCode = null;
    try {
      const raw = document.cookie.split(';').find(c => c.trim().startsWith('pli-user='));
      if (raw) {
        const parsed = JSON.parse(decodeURIComponent(raw.split('=').slice(1).join('=')));
        setUser(parsed);
        vendorCode = parsed.vendorCode;
        loadData(vendorCode);
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }

    // Auto-refresh when switching back to this tab
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && vendorCode) {
        loadData(vendorCode);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const handleSearch = () => {
    let filtered = [...allRequests];
    if (filters.plant) filtered = filtered.filter(r => r.plant === filters.plant);
    if (filters.pliName) filtered = filtered.filter(r => r.pliName.toLowerCase().includes(filters.pliName.toLowerCase()));
    if (filters.status) filtered = filtered.filter(r => r.status === filters.status);
    setFilteredRequests(filtered);
    setPage(1);
  };

  const handleReset = () => {
    setFilters({ plant:'', pliName:'', status:'' });
    setFilteredRequests(allRequests);
    setPage(1);
  };

  const totalPages = Math.ceil(filteredRequests.length / rowsPerPage) || 1;
  const paginatedRequests = filteredRequests.slice((page-1)*rowsPerPage, page*rowsPerPage);

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <h2 className="font-display text-xl font-bold text-slate-800 mb-5">Dashboard</h2>
      <div className="flex items-center justify-end gap-2 mb-3 relative">
        <button onClick={() => setShowFieldsPanel(!showFieldsPanel)} className="flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50"><Settings2 size={14}/> Fields</button>
        <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-1.5 px-3 py-2 text-sm border rounded-lg ${showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-slate-300 hover:bg-slate-50'}`}><Filter size={14}/></button>
        <EditFieldsPanel fields={ALL_FIELDS} visibleFields={visibleFields} onToggle={key => setVisibleFields(prev => prev.includes(key) ? prev.filter(f => f !== key) : [...prev, key])} onReset={() => setVisibleFields(ALL_FIELDS.map(f => f.key))} onApply={() => setShowFieldsPanel(false)} isOpen={showFieldsPanel} onClose={() => setShowFieldsPanel(false)}/>
      </div>
      {showFilters && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 animate-slide-down">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <select value={filters.plant} onChange={e => setFilters({...filters, plant: e.target.value})} className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-600"><option value="">Plant</option><option>1900</option><option>5100</option></select>
            <input placeholder="PLI Name" value={filters.pliName} onChange={e => setFilters({...filters, pliName: e.target.value})} className="px-3 py-2 border border-slate-300 rounded-lg text-sm"/>
            <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})} className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-600"><option value="">Status</option><option>Pending Submission</option><option>Submitted</option><option>Closed</option><option>Rejected</option></select>
            <div className="flex gap-2 items-center">
              <button onClick={handleSearch} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">Search</button>
              <button onClick={handleReset} className="px-4 py-2 text-sm font-medium text-red-500">Reset</button>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead><tr>{ALL_FIELDS.filter(f => visibleFields.includes(f.key)).map(f => (<th key={f.key}>{f.label}</th>))}<th className="w-16"></th></tr></thead>
            <tbody>
              {loading && (<tr><td colSpan={visibleFields.length+1} className="text-center py-10"><div className="animate-spin w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"/></td></tr>)}
              {!loading && paginatedRequests.map(req => (
                <tr key={req.id}>
                  {visibleFields.includes('plant') && <td>{req.plant}</td>}
                  {visibleFields.includes('noOfItems') && <td>{req.noOfItems}</td>}
                  {visibleFields.includes('pliName') && <td className="font-medium">{req.pliName}</td>}
                  {visibleFields.includes('requestDate') && <td>{req.requestDate}</td>}
                  {visibleFields.includes('status') && (<td><span className={`status-badge ${STATUS_CLASSES[req.status]||''}`}><span className="w-1.5 h-1.5 rounded-full bg-current"/>{req.status}</span></td>)}
                  <td><button onClick={() => router.push(`/vendor/pli/review?id=${req.id}`)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="View"><Eye size={16}/></button></td>
                </tr>
              ))}
              {!loading && paginatedRequests.length === 0 && (<tr><td colSpan={visibleFields.length+1} className="text-center py-10 text-slate-400">No records found</td></tr>)}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-end gap-4 px-5 py-3 border-t border-slate-100 text-xs text-slate-500">
          <span>Rows per page: {rowsPerPage}</span>
          <span>{filteredRequests.length > 0 ? (page-1)*rowsPerPage+1 : 0}-{Math.min(page*rowsPerPage, filteredRequests.length)} of {filteredRequests.length}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(1)} disabled={page===1} className="p-1 hover:bg-slate-100 rounded disabled:opacity-30"><ChevronsLeft size={14}/></button>
            <button onClick={() => setPage(p => p-1)} disabled={page===1} className="p-1 hover:bg-slate-100 rounded disabled:opacity-30"><ChevronLeft size={14}/></button>
            <button className="w-6 h-6 bg-blue-600 text-white rounded text-xs font-medium">{page}</button>
            <button onClick={() => setPage(p => p+1)} disabled={page>=totalPages} className="p-1 hover:bg-slate-100 rounded disabled:opacity-30"><ChevronRight size={14}/></button>
            <button onClick={() => setPage(totalPages)} disabled={page>=totalPages} className="p-1 hover:bg-slate-100 rounded disabled:opacity-30"><ChevronsRight size={14}/></button>
          </div>
        </div>
      </div>
    </div>
  );
}
