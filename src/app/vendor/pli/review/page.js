'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Download, Upload, Eye, Trash2, FileText, AlertCircle, Loader2 } from 'lucide-react';

function VendorReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestId = searchParams.get('id');
  const [request, setRequest] = useState(null);
  const [signedFile, setSignedFile] = useState(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState('');
  const [comment, setComment] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    if (requestId) {
      fetch(`/api/vendor/pli?requestId=${requestId}`).then(r => r.json()).then(data => {
        if (data.requests && data.requests.length > 0) setRequest(data.requests[0]);
      });
    }
  }, [requestId]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { alert('File size must not exceed 10 MB'); return; }
    if (!file.name.endsWith('.pdf')) { alert('Only PDF files are allowed'); return; }
    setSignedFile(file);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('requestId', requestId);
      formData.append('fileType', 'signed-document');
      const res = await fetch('/api/files/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setUploadedFileUrl(data.fileUrl);
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'));
        setSignedFile(null);
      }
    } catch (err) {
      alert('Upload failed: ' + (data?.error || 'Unknown error. Please try again.'));
      setSignedFile(null);
    }
    setUploading(false);
  };

  const handleSubmit = async () => {
    if (!uploadedFileUrl && (request?.status === 'Pending Submission' || request?.status === 'Rejected')) {
      alert('Please upload a signed document before submitting');
      return;
    }
    setSubmitting(true);
    try {
      await fetch('/api/vendor/pli', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, comment, fileName: signedFile?.name || 'Signed Document.pdf', fileUrl: uploadedFileUrl })
      });
      alert('Document submitted successfully! Email sent to buyer for review.');
      router.push('/vendor/dashboard');
    } catch (err) {
      alert('Submission failed. Please try again.');
    }
    setSubmitting(false);
  };

  if (!request) return (<div className="flex items-center justify-center h-[80vh]"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"/></div>);

  const isSubmittable = request.status === 'Pending Submission' || request.status === 'Rejected';

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => router.push('/vendor/dashboard')} className="p-1.5 hover:bg-slate-200 rounded-lg"><ArrowLeft size={18} className="text-slate-600"/></button>
        <h2 className="font-display text-xl font-bold text-slate-800">PLI Item Review</h2>
        <span className={`ml-auto status-badge ${request.status === 'Pending Submission' ? 'status-pending' : request.status === 'Submitted' ? 'status-submitted' : request.status === 'Closed' ? 'status-closed' : request.status === 'Rejected' ? 'status-rejected' : ''}`}><span className="w-1.5 h-1.5 rounded-full bg-current"/>{request.status}</span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-slate-200"><h3 className="font-semibold text-sm text-slate-700">Line Items</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead><tr><th>Plant</th><th>Component (SAP Code)</th><th>Company Name</th><th>Description</th><th>UOM</th><th>Quarter</th><th>Rate (INR)</th></tr></thead>
            <tbody>
              {request.items.map(item => (
                <tr key={item.id}><td>{item.plant}</td><td className="font-mono text-xs">{item.componentCode}</td><td>{request.vendorName}</td><td>{item.componentDescription}</td><td>{item.uom}</td><td>{item.effectiveQuarter}</td><td className="font-medium">₹{item.effectiveRate.toLocaleString()}</td></tr>
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
              <FileText size={20} className="text-slate-400"/>
              <span className="text-sm text-slate-700 flex-1">Annexure Vendor Sample.pdf</span>
              <a href="/api/annexure" download="Annexure_Vendor_Sample.pdf" className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Download"><Download size={16}/></a>
            </div>
          </div>

          {isSubmittable && (
            <div>
              <h4 className="text-sm font-medium text-slate-600 mb-2">Signed Documents</h4>
              {!signedFile ? (
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 max-w-md">
                  <span className="text-sm text-slate-500 flex-1">Upload your signed document (PDF only)</span>
                  <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"><Upload size={14}/> Upload PDF</button>
                  <input ref={fileRef} type="file" accept=".pdf" onChange={handleFileUpload} className="hidden"/>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200 max-w-md">
                  <FileText size={20} className="text-green-600"/>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">{signedFile.name}</p>
                    <p className="text-xs text-green-600">{uploading ? 'Uploading...' : 'Uploaded successfully'}</p>
                  </div>
                  {uploading && <Loader2 size={16} className="animate-spin text-blue-500"/>}
                  {!uploading && uploadedFileUrl && <a href={uploadedFileUrl} target="_blank" className="p-1.5 text-blue-500 hover:bg-blue-50 rounded" title="View"><Eye size={16}/></a>}
                  {!uploading && <button onClick={() => { setSignedFile(null); setUploadedFileUrl(''); }} className="p-1.5 text-red-500 hover:bg-red-50 rounded" title="Remove"><Trash2 size={16}/></button>}
                </div>
              )}
              <div className="mt-3 space-y-1.5">
                <div className="flex items-start gap-2 text-xs text-slate-500"><AlertCircle size={13} className="text-slate-400 shrink-0 mt-0.5"/>File size: greater than 0 KB, max 10 MB</div>
                <div className="flex items-start gap-2 text-xs text-slate-500"><AlertCircle size={13} className="text-slate-400 shrink-0 mt-0.5"/>Only PDF format accepted</div>
              </div>
            </div>
          )}

          {request.status === 'Submitted' && request.submittedFileName && (
            <div>
              <h4 className="text-sm font-medium text-slate-600 mb-2">Submitted Document</h4>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200 max-w-md">
                <FileText size={20} className="text-green-600"/>
                <div className="flex-1"><p className="text-sm font-medium text-slate-700">{request.submittedFileName}</p><p className="text-xs text-slate-400">Submitted on {request.submittedDate}</p></div>
                {request.submittedFileUrl && <a href={request.submittedFileUrl} target="_blank" className="p-1.5 text-blue-500 hover:bg-blue-50 rounded" title="View"><Eye size={16}/></a>}
              </div>
            </div>
          )}

          {request.status === 'Closed' && request.submittedFileName && (
            <div>
              <h4 className="text-sm font-medium text-slate-600 mb-2">Approved Document</h4>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200 max-w-md">
                <FileText size={20} className="text-green-600"/>
                <div className="flex-1"><p className="text-sm font-medium text-slate-700">{request.submittedFileName}</p><p className="text-xs text-green-600">Approved</p></div>
                {request.submittedFileUrl && <a href={request.submittedFileUrl} target="_blank" className="p-1.5 text-blue-500 hover:bg-blue-50 rounded" title="Download"><Download size={16}/></a>}
              </div>
            </div>
          )}
        </div>
      </div>

      {request.status === 'Rejected' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-slate-200"><h3 className="font-semibold text-sm text-red-600">Rejection Details</h3></div>
          <table className="w-full data-table"><thead><tr><th>S.No</th><th>Rejected By</th><th>Comments</th><th>Date</th></tr></thead>
          <tbody><tr><td>1</td><td>{request.rejectedBy || 'Buyer'}</td><td>{request.rejectionComment || 'Please review and resubmit'}</td><td>{request.rejectionDate || '-'}</td></tr></tbody></table>
        </div>
      )}

      {isSubmittable && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-slate-200"><h3 className="font-semibold text-sm text-slate-700">Comments</h3></div>
          <div className="p-5">
            <textarea value={comment} onChange={e => setComment(e.target.value.slice(0,200))} placeholder="Enter Comment (optional)" rows={3} className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"/>
            <p className="text-right text-xs text-slate-400 mt-1">{comment.length}/200</p>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button onClick={() => router.push('/vendor/dashboard')} className="px-6 py-2.5 text-sm font-medium border border-slate-300 rounded-lg hover:bg-slate-50">Back</button>
        {isSubmittable && (
          <button onClick={handleSubmit} disabled={submitting || uploading || (!uploadedFileUrl && !signedFile)} className="px-6 py-2.5 text-sm font-medium text-white bg-blue-900 rounded-lg hover:bg-blue-950 disabled:opacity-50 disabled:cursor-not-allowed">
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function VendorReviewPage() {
  return (<Suspense fallback={<div className="flex items-center justify-center h-[80vh]"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"/></div>}><VendorReviewContent/></Suspense>);
}
