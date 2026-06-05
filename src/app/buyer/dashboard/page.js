'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Filter, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getRequests, computeSummary, computePLIStatus, computeCategorySummary, computePLINames, computeVendorSummary } from '@/lib/store';

const COLORS = { Approved: '#22c55e', Pending: '#eab308', Cancelled: '#3b82f6' };

function Pagination({ page, totalPages, total, rowsPerPage, onPageChange }) {
  return (
    <div className="flex items-center justify-end gap-4 px-5 py-3 border-t border-slate-100 text-xs text-slate-500">
      <span>Rows per page: {rowsPerPage}</span>
      <span>{(page-1)*rowsPerPage+1}-{Math.min(page*rowsPerPage, total)} of {total}</span>
      <div className="flex items-center gap-1">
        <button onClick={() => onPageChange(1)} disabled={page===1} className="p-1 hover:bg-slate-100 rounded disabled:opacity-30"><ChevronsLeft size={14}/></button>
        <button onClick={() => onPageChange(page-1)} disabled={page===1} className="p-1 hover:bg-slate-100 rounded disabled:opacity-30"><ChevronLeft size={14}/></button>
        {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(
          <button key={p} onClick={()=>onPageChange(p)} className={`w-6 h-6 rounded text-xs font-medium ${p===page?'bg-blue-600 text-white':'hover:bg-slate-100'}`}>{p}</button>
        ))}
        <button onClick={() => onPageChange(page+1)} disabled={page===totalPages} className="p-1 hover:bg-slate-100 rounded disabled:opacity-30"><ChevronRight size={14}/></button>
        <button onClick={() => onPageChange(totalPages)} disabled={page===totalPages} className="p-1 hover:bg-slate-100 rounded disabled:opacity-30"><ChevronsRight size={14}/></button>
      </div>
    </div>
  );
}

export default function BuyerDashboard() {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ pliName:'', dateRaised:'', customer:'', plant:'', vendor:'', quarter:'', category:'' });
  const [pliPage, setPliPage] = useState(1);
  const [vendorPage, setVendorPage] = useState(1);
  const rowsPerPage = 25;

  useEffect(() => { setRequests(getRequests()); }, []);

  if (requests.length === 0) {
    return (<div className="flex items-center justify-center h-[80vh]"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"/></div>);
  }

  const summary = computeSummary(requests);
  const pliStatus = computePLIStatus(requests);
  const categorySummary = computeCategorySummary(requests);
  const pliSummary = computePLINames(requests);
  const vendorSummaryData = computeVendorSummary(requests);

  const tiles = [
    { label: 'Total PLI raised by Varroc', value: summary.totalPLI },
    { label: 'Total BO Codes raised by Varroc', value: summary.totalBOCodes },
    { label: 'Average days of closure', value: summary.avgDaysClosure },
    { label: 'Pending Submissions by Vendors', value: summary.pendingSubmissions },
    { label: 'No. of active PLI', value: summary.activePLI }
  ];

  const pliTotalPages = Math.ceil(pliSummary.length/rowsPerPage) || 1;
  const vendorTotalPages = Math.ceil(vendorSummaryData.length/rowsPerPage) || 1;

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-xl font-bold text-slate-800">Overall Summary</h2>
        <button onClick={()=>setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${showFilters?'bg-blue-50 border-blue-300 text-blue-700':'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
          <Filter size={15}/>Filters
        </button>
      </div>

      {showFilters && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-5 animate-slide-down">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <input placeholder="PLI Name" value={filters.pliName} onChange={e=>setFilters({...filters,pliName:e.target.value})} className="px-3 py-2 border border-slate-300 rounded-lg text-sm"/>
            <select value={filters.customer} onChange={e=>setFilters({...filters,customer:e.target.value})} className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-600">
              <option value="">Select Customer</option><option>TATA</option><option>Birla</option><option>Mahindra</option>
            </select>
            <select value={filters.plant} onChange={e=>setFilters({...filters,plant:e.target.value})} className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-600">
              <option value="">Select Plant</option><option>1900</option><option>5100</option>
            </select>
            <select value={filters.vendor} onChange={e=>setFilters({...filters,vendor:e.target.value})} className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-600">
              <option value="">Select Vendor</option><option>CCJ0040</option><option>CSS0905</option>
            </select>
            <input type="date" value={filters.dateRaised} onChange={e=>setFilters({...filters,dateRaised:e.target.value})} className="px-3 py-2 border border-slate-300 rounded-lg text-sm"/>
            <select value={filters.quarter} onChange={e=>setFilters({...filters,quarter:e.target.value})} className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-600">
              <option value="">Select Quarter</option><option>Q2FY2526</option><option>Q3FY2526</option>
            </select>
            <select value={filters.category} onChange={e=>setFilters({...filters,category:e.target.value})} className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-600">
              <option value="">Select Category</option><option>Electrical</option><option>Molding</option><option>SM&F</option>
            </select>
            <div className="flex gap-2 items-center">
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">Search</button>
              <button onClick={()=>setFilters({pliName:'',dateRaised:'',customer:'',plant:'',vendor:'',quarter:'',category:''})} className="px-4 py-2 text-sm font-medium text-red-500">Reset</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {tiles.map((tile,i)=>(
          <div key={i} onClick={()=>router.push('/buyer/pli')} className="metric-tile">
            <p className="text-xs text-slate-500 font-medium mb-1 leading-tight">{tile.label}</p>
            <p className="text-2xl font-bold text-blue-800">{tile.value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-display font-semibold text-slate-800 mb-4">PLI Status Overview</h3>
          <div className="flex items-center justify-center gap-4 mb-3 flex-wrap">
            {pliStatus.map(s=>(<div key={s.name} className="flex items-center gap-1.5 text-xs"><span className="w-3 h-3 rounded-sm" style={{backgroundColor:s.color}}/>{s.name} ({s.value})</div>))}
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart><Pie data={pliStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" stroke="none">{pliStatus.map((entry,idx)=>(<Cell key={idx} fill={entry.color}/>))}</Pie><Tooltip/></PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-display font-semibold text-slate-800 mb-4">Category Summary</h3>
          <div className="flex items-center justify-center gap-4 mb-3 flex-wrap">
            {['Approved','Pending','Cancelled'].map(s=>(<div key={s} className="flex items-center gap-1.5 text-xs"><span className="w-3 h-3 rounded-sm" style={{backgroundColor:COLORS[s]}}/>{s}</div>))}
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categorySummary}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/><XAxis dataKey="name" tick={{fontSize:12}}/><YAxis tick={{fontSize:12}}/><Tooltip/><Bar dataKey="Approved" fill={COLORS.Approved} radius={[4,4,0,0]}/><Bar dataKey="Pending" fill={COLORS.Pending} radius={[4,4,0,0]}/><Bar dataKey="Cancelled" fill={COLORS.Cancelled} radius={[4,4,0,0]}/></BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 mb-6 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200"><h3 className="font-display font-semibold text-slate-800">PLI Summary</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead><tr><th>PLI Name</th><th>Total Parts</th><th>Approved</th><th>Cancelled</th><th>Pending</th><th>Start Date</th></tr></thead>
            <tbody>{pliSummary.slice((pliPage-1)*rowsPerPage,pliPage*rowsPerPage).map((row,i)=>(<tr key={i}><td className="font-medium text-blue-700">{row.name}</td><td>{row.totalParts}</td><td>{row.approved}</td><td>{row.cancelled}</td><td>{row.pending}</td><td>{row.startDate}</td></tr>))}</tbody>
          </table>
        </div>
        <Pagination page={pliPage} totalPages={pliTotalPages} total={pliSummary.length} rowsPerPage={rowsPerPage} onPageChange={setPliPage}/>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200"><h3 className="font-display font-semibold text-slate-800">Vendor Summary</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead><tr><th>Vendor Code</th><th>Total Parts</th><th>Approved</th><th>Cancelled</th><th>Pending</th></tr></thead>
            <tbody>{vendorSummaryData.slice((vendorPage-1)*rowsPerPage,vendorPage*rowsPerPage).map((row,i)=>(<tr key={i}><td className="font-medium text-blue-700">{row.vendorCode}</td><td>{row.totalParts}</td><td>{row.approved}</td><td>{row.cancelled}</td><td>{row.pending}</td></tr>))}</tbody>
          </table>
        </div>
        <Pagination page={vendorPage} totalPages={vendorTotalPages} total={vendorSummaryData.length} rowsPerPage={rowsPerPage} onPageChange={setVendorPage}/>
      </div>
    </div>
  );
}
