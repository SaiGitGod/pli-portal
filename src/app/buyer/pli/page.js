'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Filter, ChevronRight, ChevronDown, Pencil, Trash2, Download, CheckCircle, XCircle,
  ListFilter, FileSpreadsheet, ArrowLeft, ChevronLeft, ChevronsLeft, ChevronsRight, Settings2
} from 'lucide-react';
import CommentModal from '@/components/CommentModal';
import ImportExcelModal from '@/components/ImportExcelModal';
import EditFieldsPanel from '@/components/EditFieldsPanel';

const STATUS_CLASSES = {
  'Pending Submission': 'status-pending',
  'Submitted': 'status-submitted',
  'Closed': 'status-closed',
  'Cancelled': 'status-cancelled',
  'Rejected': 'status-rejected',
};

const ALL_FIELDS = [
  { key: 'id', label: 'Request ID' },
  { key: 'vendorCode', label: 'Vendor Code' },
  { key: 'vendorName', label: 'Vendor Name' },
  { key: 'plant', label: 'Plant' },
  { key: 'noOfItems', label: 'No. Of Items' },
  { key: 'requestDate', label: 'Request Date' },
  { key: 'status', label: 'Status' },
];

export default function BuyerPLIDashboard() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [activeTile, setActiveTile] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showFieldsPanel, setShowFieldsPanel] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [commentModal, setCommentModal] = useState({ open: false, title: '', action: null, requestId: null });
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [visibleFields, setVisibleFields] = useState(ALL_FIELDS.map(f => f.key));
  const [filters, setFilters] = useState({ requestId: '', vendorCode: '', vendorName: '', plant: '', noOfItems: '', requestDate: '', status: '' });
  const [page, setPage] = useState(1);
  const rowsPerPage = 25;

  useEffect(() => { fetchData(); }, [activeTile]);

  const fetchData = () => {
    fetch(`/api/buyer/pli?tile=${activeTile}`).then(res => res.json()).then(setData).catch(console.error);
  };

  const toggleExpand = (id) => {
    const next = new Set(expandedRows);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedRows(next);
  };

  const handleAction = (action, requestId) => {
    if (action === 'edit') {
      router.push(`/buyer/pli/review?id=${requestId}`);
    } else {
      setCommentModal({ open: true, title: `${action} PLI Request`, action, requestId });
    }
  };

  const handleCommentSubmit = async (comment) => {
    await fetch('/api/buyer/pli', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: commentModal.action, requestId: commentModal.requestId, comment }),
    });
    alert(`${commentModal.action} action completed successfully!`);
    fetchData();
  };

  if (!data) {
    return (<div className="flex items-center justify-center h-[80vh]"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>);
  }

  const { tiles, requests } = data;

  const tileConfig = [
    { key: 'all', label: 'All Items', value: tiles.all, icon: <ListFilter size={20} /> },
    { key: 'pending', label: 'Pending Submissions by Vendors', value: tiles.pending, icon: <FileSpreadsheet size={20} /> },
    { key: 'submitted', label: 'Submitted by Vendors', value: tiles.submitted, icon: <CheckCircle size={20} /> },
    { key: 'closed', label: 'Closed', value: tiles.closed, icon: <XCircle size={20} /> },
  ];

  const totalPages = Math.ceil(requests.length / rowsPerPage) || 1;
  const paginatedRequests = requests.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => router.push('/buyer/dashboard')} className="p-1.5 hover:bg-slate-200 rounded-lg"><ArrowLeft size={18} className="text-slate-600" /></button>
        <h2 className="font-display text-xl font-bold text-slate-800">Dashboard</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {tileConfig.map((tile) => (
          <div key={tile.key} onClick={() => { setActiveTile(tile.key); setPage(1); }} className={`metric-tile flex items-start gap-3 ${activeTile === tile.key ? 'active' : ''}`}>
            <div className="text-slate-400 mt-0.5">{tile.icon}</div>
            <div>
              <p className="text-2xl font-bold text-blue-800">{tile.value}</p>
              <p className="text-xs text-slate-500 font-medium leading-tight">{tile.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-2 mb-3 relative">
        <button onClick={() => setShowFieldsPanel(!showFieldsPanel)} className="flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50"><Settings2 size={14} /> Fields</button>
        <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-1.5 px-3 py-2 text-sm border rounded-lg ${showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-slate-300 hover:bg-slate-50'}`}><Filter size={14} /></button>
        <button onClick={() => setShowImportModal(true)} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"><FileSpreadsheet size={14} /> Import from Excel</button>
        <EditFieldsPanel fields={ALL_FIELDS} visibleFields={visibleFields} onToggle={(key) => setVisibleFields(prev => prev.includes(key) ? prev.filter(f => f !== key) : [...prev, key])} onReset={() => setVisibleFields(ALL_FIELDS.map(f => f.key))} onApply={() => setShowFieldsPanel(false)} isOpen={showFieldsPanel} onClose={() => setShowFieldsPanel(false)} />
      </div>

      {showFilters && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 animate-slide-down">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <input placeholder="Request ID" value={filters.requestId} onChange={e => setFilters({ ...filters, requestId: e.target.value })} className="px-3 py-2 border border-slate-300 rounded-lg text-sm" />
            <input placeholder="Vendor Code" value={filters.vendorCode} onChange={e => setFilters({ ...filters, vendorCode: e.target.value })} className="px-3 py-2 border border-slate-300 rounded-lg text-sm" />
            <select value={filters.vendorName} onChange={e => setFilters({ ...filters, vendorName: e.target.value })} className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-600">
              <option value="">Vendor Name</option>
              <option>JOSTS ENGINEERING COMPANY</option>
              <option>SHREE SWAMI ENTERPRISES</option>
              <option>SN WATER SOLUTIONS</option>
            </select>
            <select value={filters.plant} onChange={e => setFilters({ ...filters, plant: e.target.value })} className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-600">
              <option value="">Plant</option><option>1900</option><option>5100</option>
            </select>
            <input placeholder="No. Of Items" value={filters.noOfItems} onChange={e => setFilters({ ...filters, noOfItems: e.target.value })} className="px-3 py-2 border border-slate-300 rounded-lg text-sm" />
            <input type="date" value={filters.requestDate} onChange={e => setFilters({ ...filters, requestDate: e.target.value })} className="px-3 py-2 border border-slate-300 rounded-lg text-sm" />
            <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })} className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-600">
              <option value="">Select Status</option>
              <option>Pending Submission</option><option>Submitted</option><option>Closed</option><option>Cancelled</option>
            </select>
            <div className="flex gap-2 items-center">
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">Search</button>
              <button onClick={() => setFilters({ requestId: '', vendorCode: '', vendorName: '', plant: '', noOfItems: '', requestDate: '', status: '' })} className="px-4 py-2 text-sm font-medium text-red-500">Reset</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="w-10"></th>
                {ALL_FIELDS.filter(f => visibleFields.includes(f.key)).map(f => (<th key={f.key}>{f.label}</th>))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRequests.map((req) => (
                <React.Fragment key={req.id}>
                  <tr>
                    <td><button onClick={() => toggleExpand(req.id)} className="p-1 hover:bg-slate-100 rounded">{expandedRows.has(req.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</button></td>
                    {visibleFields.includes('id') && <td className="font-medium">{req.id}</td>}
                    {visibleFields.includes('vendorCode') && <td>{req.vendorCode}</td>}
                    {visibleFields.includes('vendorName') && <td className="max-w-[200px] truncate">{req.vendorName}</td>}
                    {visibleFields.includes('plant') && <td>{req.plant}</td>}
                    {visibleFields.includes('noOfItems') && <td>{req.noOfItems}</td>}
                    {visibleFields.includes('requestDate') && <td>{req.requestDate}</td>}
                    {visibleFields.includes('status') && (<td><span className={`status-badge ${STATUS_CLASSES[req.status] || ''}`}><span className="w-1.5 h-1.5 rounded-full bg-current" />{req.status}</span></td>)}
                    <td>
                      <div className="flex items-center gap-1">
                        {(req.status === 'Pending Submission' || req.status === 'Rejected') && (
                          <>
                            <button onClick={() => handleAction('edit', req.id)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Edit"><Pencil size={14} /></button>
                            <button onClick={() => handleAction('Cancel', req.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded" title="Cancel"><Trash2 size={14} /></button>
                          </>
                        )}
                        {req.status === 'Submitted' && (
                          <>
                            <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded" title="Download"><Download size={14} /></button>
                            <button onClick={() => handleAction('Approve', req.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Approve"><CheckCircle size={14} /></button>
                            <button onClick={() => handleAction('Reject', req.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded" title="Reject"><XCircle size={14} /></button>
                          </>
                        )}
                        {req.status === 'Closed' && (<button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded" title="Download"><Download size={14} /></button>)}
                      </div>
                    </td>
                  </tr>
                  {expandedRows.has(req.id) && (
                    <tr>
                      <td colSpan={visibleFields.length + 2} className="bg-slate-50 p-0">
                        <div className="px-8 py-4 animate-fade-in">
                          <table className="w-full text-sm">
                            <thead><tr className="text-xs text-slate-500 uppercase">
                              <th className="text-left pb-2">Component (SAP Code)</th>
                              <th className="text-left pb-2">Description</th>
                              <th className="text-left pb-2">UOM</th>
                              <th className="text-left pb-2">Effective Quarter</th>
                              <th className="text-left pb-2">Buyer Name</th>
                              <th className="text-right pb-2">Effective Rate (INR)</th>
                            </tr></thead>
                            <tbody>
                              {req.items.map(item => (
                                <tr key={item.id} className="border-t border-slate-200">
                                  <td className="py-2 font-mono text-xs">{item.componentCode}</td>
                                  <td className="py-2">{item.componentDescription}</td>
                                  <td className="py-2">{item.uom}</td>
                                  <td className="py-2">{item.effectiveQuarter}</td>
                                  <td className="py-2">{req.buyerName}</td>
                                  <td className="py-2 text-right font-medium">₹{item.effectiveRate.toLocaleString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-end gap-4 px-5 py-3 border-t border-slate-100 text-xs text-slate-500">
          <span>Rows per page: {rowsPerPage}</span>
          <span>{(page - 1) * rowsPerPage + 1}-{Math.min(page * rowsPerPage, requests.length)} of {requests.length}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(1)} disabled={page === 1} className="p-1 hover:bg-slate-100 rounded disabled:opacity-30"><ChevronsLeft size={14} /></button>
            <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="p-1 hover:bg-slate-100 rounded disabled:opacity-30"><ChevronLeft size={14} /></button>
            <button className="w-6 h-6 bg-blue-600 text-white rounded text-xs font-medium">{page}</button>
            <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages} className="p-1 hover:bg-slate-100 rounded disabled:opacity-30"><ChevronRight size={14} /></button>
            <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="p-1 hover:bg-slate-100 rounded disabled:opacity-30"><ChevronsRight size={14} /></button>
          </div>
        </div>
      </div>

      <CommentModal title={commentModal.title} isOpen={commentModal.open} onClose={() => setCommentModal({ open: false, title: '', action: null, requestId: null })} onSubmit={handleCommentSubmit} />
      <ImportExcelModal isOpen={showImportModal} onClose={() => setShowImportModal(false)} onSubmit={(file) => { alert(`File "${file.name}" uploaded successfully! PLI requests will be created.`); }} />
    </div>
  );
}
