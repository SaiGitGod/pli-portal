'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
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

const REQUIRED_COLUMNS = ['Customer', 'BU', 'Plant', 'Component (BO Code)', 'Component Description', 'Base Unit of Measure', 'Vendor Code', 'Vendor Name', 'PLI Quarter', 'Price (INR)', 'Purchase Group'];

export default function BuyerPLIDashboard() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [localRequests, setLocalRequests] = useState([]);
  const [activeTile, setActiveTile] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showFieldsPanel, setShowFieldsPanel] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [commentModal, setCommentModal] = useState({ open: false, title: '', action: null, requestId: null });
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [visibleFields, setVisibleFields] = useState(ALL_FIELDS.map(f => f.key));
  const [filters, setFilters] = useState({ requestId: '', vendorCode: '', vendorName: '', plant: '', noOfItems: '', requestDate: '', status: '' });
  const [page, setPage] = useState(1);
  const [notification, setNotification] = useState(null);
  const [buyerName, setBuyerName] = useState('Buyer');
  const rowsPerPage = 25;

  useEffect(() => { fetchData(); }, [activeTile]);
    useEffect(() => {
    try {
      const raw = document.cookie.split(';').find(c => c.trim().startsWith('pli-user='));
      if (raw) {
        const val = decodeURIComponent(raw.split('=').slice(1).join('='));
        const parsed = JSON.parse(val);
        setBuyerName(parsed.name || 'Buyer');
      }
    } catch {}
  }, []);

  const fetchData = () => {
    fetch(`/api/buyer/pli?tile=${activeTile}`).then(res => res.json()).then(d => {
      setData(d);
      if (localRequests.length === 0) {
        setLocalRequests(d.requests);
      }
    }).catch(console.error);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
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
    const { action, requestId } = commentModal;
    await fetch('/api/buyer/pli', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, requestId, comment }),
    });

    setLocalRequests(prev => prev.map(r => {
      if (r.id !== requestId) return r;
      let newStatus = r.status;
      if (action === 'Approve') newStatus = 'Closed';
      if (action === 'Reject') newStatus = 'Rejected';
      if (action === 'Cancel') newStatus = 'Cancelled';
      return { ...r, status: newStatus, items: r.items.map(item => ({ ...item, status: newStatus })) };
    }));

    showNotification(`Request ${requestId} — ${action} successful! Email notification sent.`);
  };

  const handleExcelUpload = async (file) => {
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet);

      if (rows.length === 0) {
        showNotification('Excel file is empty. Please add data rows.', 'error');
        return;
      }

      const headers = Object.keys(rows[0]);
      const missingCols = REQUIRED_COLUMNS.filter(col => !headers.includes(col));
      if (missingCols.length > 0) {
        showNotification(`Missing columns: ${missingCols.join(', ')}. Please use the PLI Excel Template.`, 'error');
        return;
      }

      let hasError = false;
      rows.forEach((row, idx) => {
        REQUIRED_COLUMNS.forEach(col => {
          if (!row[col] && row[col] !== 0) {
            hasError = true;
          }
        });
        if (row['Price (INR)'] && isNaN(Number(row['Price (INR)']))) {
          hasError = true;
        }
      });

      if (hasError) {
        showNotification('Validation failed: All fields are mandatory and Price (INR) must be numeric.', 'error');
        return;
      }

      const customers = [...new Set(rows.map(r => r['Customer']))];
      const bus = [...new Set(rows.map(r => r['BU']))];
      const qtrs = [...new Set(rows.map(r => r['PLI Quarter']))];
      if (customers.length > 1 || bus.length > 1 || qtrs.length > 1) {
        showNotification('Warning: Customer, BU, and PLI Quarter should be the same across all rows. PLI Name may have discrepancies.', 'error');
        return;
      }

      const groups = {};
      rows.forEach(row => {
        const key = `${row['Plant']}_${row['Vendor Code']}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(row);
      });

      const today = new Date().toISOString().split('T')[0];
      const newRequests = [];
      let counter = 1;

      Object.entries(groups).forEach(([key, groupRows]) => {
        const first = groupRows[0];
        const reqId = `REQ-${today}-${String(counter).padStart(3, '0')}`;
        const pliName = `${first['Customer']}_${first['PLI Quarter']}_${first['BU']}_${String(Date.now()).slice(-2)}_${counter}`;

        const items = groupRows.map((row, idx) => ({
          id: `NEW-ITEM-${Date.now()}-${idx}`,
          plant: String(row['Plant']),
          componentCode: String(row['Component (BO Code)']),
          componentDescription: row['Component Description'],
          uom: row['Base Unit of Measure'],
          effectiveQuarter: row['PLI Quarter'],
          effectiveRate: Number(row['Price (INR)']),
          status: 'Pending Submission',
        }));

        newRequests.push({
          id: reqId,
          vendorCode: String(first['Vendor Code']),
          vendorName: first['Vendor Name'],
          plant: String(first['Plant']),
          noOfItems: items.length,
          requestDate: today,
          status: 'Pending Submission',
          pliName: pliName,
          customer: first['Customer'],
          quarter: first['PLI Quarter'],
          category: first['Purchase Group'],
          buyerName: buyerName,
          items: items,
        });

        counter++;
      });

      setLocalRequests(prev => [...newRequests, ...prev]);
      showNotification(`✓ ${newRequests.length} PLI request(s) created from ${rows.length} items in "${file.name}". Email notifications sent to vendors.`);

    } catch (err) {
      console.error(err);
      showNotification('Failed to parse Excel file. Please check the format and try again.', 'error');
    }
  };

  if (!data) {
    return (<div className="flex items-center justify-center h-[80vh]"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>);
  }

  const { tiles } = data;

  let displayRequests = [...localRequests];
  if (activeTile === 'pending') displayRequests = displayRequests.filter(r => r.status === 'Pending Submission' || r.status === 'Rejected');
  else if (activeTile === 'submitted') displayRequests = displayRequests.filter(r => r.status === 'Submitted');
  else if (activeTile === 'closed') displayRequests = displayRequests.filter(r => r.status === 'Closed');

  const allCount = localRequests.reduce((s, r) => s + r.noOfItems, 0);
  const pendingCount = localRequests.filter(r => r.status === 'Pending Submission' || r.status === 'Rejected').reduce((s, r) => s + r.noOfItems, 0);
  const submittedCount = localRequests.filter(r => r.status === 'Submitted').reduce((s, r) => s + r.noOfItems, 0);
  const closedCount = localRequests.filter(r => r.status === 'Closed').reduce((s, r) => s + r.noOfItems, 0);

  const tileConfig = [
    { key: 'all', label: 'All Items', value: allCount, icon: <ListFilter size={20} /> },
    { key: 'pending', label: 'Pending Submissions by Vendors', value: pendingCount, icon: <FileSpreadsheet size={20} /> },
    { key: 'submitted', label: 'Submitted by Vendors', value: submittedCount, icon: <CheckCircle size={20} /> },
    { key: 'closed', label: 'Closed', value: closedCount, icon: <XCircle size={20} /> },
  ];

  const totalPages = Math.ceil(displayRequests.length / rowsPerPage) || 1;
  const paginatedRequests = displayRequests.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {notification && (
        <div className={`fixed top-4 right-4 z-50 max-w-md px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-fade-in ${notification.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {notification.message}
          <button onClick={() => setNotification(null)} className="ml-3 text-current opacity-50 hover:opacity-100">✕</button>
        </div>
      )}

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
              {paginatedRequests.length === 0 && (
                <tr><td colSpan={visibleFields.length + 2} className="text-center py-10 text-slate-400">No records found</td></tr>
              )}
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
          <span>{displayRequests.length > 0 ? (page - 1) * rowsPerPage + 1 : 0}-{Math.min(page * rowsPerPage, displayRequests.length)} of {displayRequests.length}</span>
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
      <ImportExcelModal isOpen={showImportModal} onClose={() => setShowImportModal(false)} onSubmit={handleExcelUpload} />
    </div>
  );
}
