'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Download, Upload, Eye, Trash2, FileText, AlertCircle } from 'lucide-react';
import { pliRequests } from '@/data/mockData';

function VendorReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestId = searchParams.get('id');
  const [request, setRequest] = useState(null);
  const [signedFile, setSignedFile] = useState(null);
  const [comment, setComment] = useState('');
  const fileRef = useRef(null);

  useEffect(() => {
    const found = pliRequests.find(r => r.id === requestId);
    if (found) setRequest(found);
  }, [requestId]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { alert('File size must not exceed 10 MB'); return; }
      if (!file.name.endsWith('.pdf')) { alert('Only PDF files are allowed'); return; }
      setSignedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!signedFile && request?.status === 'Pending Submission') { alert('Please upload a signed document before submitting'); return; }
    await fetch('/api/vendor/pli', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId, comment, fileName: signedFile?.name }),
    });
    alert('Document submitted successfully!');
    router.push('/vendor/dashboard');
  };

  if (!request) {
    return (<div className="flex items-center justify-center h-[80vh]"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>);
  }

  const isSubmittable = request.status === 'Pending Submission' || request.status === 'Rejected';

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => router.push('/vendor/dashboard')} className="p-1.5 hover:bg-slate-200 rounded-lg"><ArrowLeft size={18} className="text-slate-600" /></button>
        <h2 className="font-display text-xl font-bold text-slate-800">PLI Item Review</h2>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-slate-200"><h3 className="font-semibold text-sm text-slate-700">Line Items</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead><tr><th>Plant</th><th>Component (SAP Code)</th><th>Company Name</th><th>Component Description</th><th>UOM</th><th>Effective Quarter</th><th>Effective Rate (INR)</th></tr></thead>
            <tbody>
              {request.items.map(item => (
                <tr key={item.id}>
                  <td>{item.plant}</td>
                  <td className="font-mono text-xs">{item.componentCode}</td>
                  <td>{request.vendorName}</td>
                  <td>{item.componentDescription}</td>
                  <td>{item.uom}</td>
                  <td>{item.effectiveQuarter}</td>
                  <td className="font-medium">₹{item.effectiveRate.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-slate-200"><h3 className="font-semibold text-sm text-slate-700">Documents</h3></div>
        <div className="p-5 space-y-5">
          <div>
            <h4 className="text-sm font-medium text-slate-600 mb-2">Annexure</h4>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 max-w-md">
              <FileText size={20} className="text-slate-400" />
              <span className="text-sm text-slate-700 flex-1">Annexure Vendor Sample.docx</span>
              <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Download"><Download size={16} /></button>
            </div>
          </div>

          {isSubmittable && (
            <div>
              <h4 className="text-sm font-medium text-slate-600 mb-2">Signed Documents</h4>
              {!signedFile ? (
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 max-w-md">
                  <span className="text-sm text-slate-500 flex-1">Fill The Signed Document</span>
                  <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50">
                    <Upload size={14} /> Fill Document
                  </button>
                  <input ref={fileRef} type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200 max-w-md">
                  <FileText size={20} className="text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">{signedFile.name}</p>
                    <p className="text-xs text-slate-400">Uploaded</p>
                  </div>
                  <button className="p-1.5 text-blue-500 hover:bg-blue-50 rounded" title="View"><Eye size={16} /></button>
                  <button onClick={() => setSignedFile(null)} className="p-1.5 text-red-500 hover:bg-red-50 rounded" title="Delete"><Trash2 size={16} /></button>
                </div>
              )}
              <div className="mt-3 space-y-1.5">
                <div className="flex items-start gap-2 text-xs text-slate-500"><AlertCircle size={13} className="text-slate-400 shrink-0 mt-0.5" />Note: File size must be greater than 0 KB and not exceed 10 MB</div>
                <div className="flex items-start gap-2 text-xs text-slate-500"><AlertCircle size={13} className="text-slate-400 shrink-0 mt-0.5" />Note: File name can only contain letters (A-Z, a-z), numbers (0-9), spaces, underscores (_), hyphens (-), parentheses (()), and dots (.).</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {request.status === 'Rejected' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-slate-200"><h3 className="font-semibold text-sm text-red-600">Rejection Details</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead><tr><th>S.No</th><th>Rejected By</th><th>Comments</th><th>Date</th></tr></thead>
              <tbody><tr><td>1</td><td>Sanjay Kumar</td><td>Company Seal is Missing on the Signed Document. Please Add the Company Seal and Resubmit</td><td>10-11-2025 13:00</td></tr></tbody>
            </table>
          </div>
        </div>
      )}

      {isSubmittable && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-slate-200"><h3 className="font-semibold text-sm text-slate-700">Comments</h3></div>
          <div className="p-5">
            <textarea value={comment} onChange={(e) => setComment(e.target.value.slice(0, 200))} placeholder="Enter Comment" rows={3} className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            <p className="text-right text-xs text-slate-400 mt-1">{comment.length}/200</p>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button onClick={() => router.push('/vendor/dashboard')} className="px-6 py-2.5 text-sm font-medium border border-slate-300 rounded-lg hover:bg-slate-50">Back</button>
        {isSubmittable && (<button onClick={handleSubmit} className="px-6 py-2.5 text-sm font-medium text-white bg-blue-800 rounded-lg hover:bg-blue-900">Submit</button>)}
      </div>
    </div>
  );
}

export default function VendorReviewPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-[80vh]"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>}>
      <VendorReviewContent />
    </Suspense>
  );
}
