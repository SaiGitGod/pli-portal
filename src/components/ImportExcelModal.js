'use client';
import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { X, Upload, FileSpreadsheet, AlertCircle, Download } from 'lucide-react';

export default function ImportExcelModal({ isOpen, onClose, onSubmit }) {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileRef = useRef(null);

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls'))) {
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 5 * 1024 * 1024) { alert('File size must not exceed 5 MB'); return; }
      if (!selected.name.endsWith('.xlsx') && !selected.name.endsWith('.xls')) { alert('Only .xlsx and .xls files are allowed'); return; }
      setFile(selected);
    }
  };

  const handleSubmit = () => {
    if (file) {
      onSubmit(file);
      setFile(null);
      onClose();
    }
  };

  const downloadTemplate = () => {
    const headers = ['Customer', 'BU', 'Plant', 'Component (BO Code)', 'Component Description', 'Base Unit of Measure', 'Vendor Code', 'Vendor Name', 'PLI Quarter', 'Price (INR)', 'Purchase Group'];
    const sampleRow = ['TATA', 'BU_26', '1900', 'B00019000001', 'ADHESIVE ANABOND-221 SI 001', 'KG', 'CCJ0040', 'JOSTS ENGINEERING COMPANY', 'Q3FY2526', '3500', 'Electrical'];
    const ws = XLSX.utils.aoa_to_sheet([headers, sampleRow]);
    const colWidths = headers.map(h => ({ wch: Math.max(h.length + 5, 20) }));
    ws['!cols'] = colWidths;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'PLI Template');
    XLSX.writeFile(wb, 'PLI_Excel_Template.xlsx');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="font-display font-semibold text-slate-800">Import From Excel</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg"><X size={18} className="text-slate-400" /></button>
        </div>

        <div className="px-6 py-5">
          <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50'}`}>
            {file ? (
              <div className="flex items-center gap-3 justify-center">
                <FileSpreadsheet size={24} className="text-green-600" />
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-700">{file.name}</p>
                  <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button onClick={() => setFile(null)} className="ml-2 text-red-400 hover:text-red-600"><X size={16} /></button>
              </div>
            ) : (
              <>
                <Upload size={32} className="mx-auto text-slate-400 mb-3" />
                <p className="text-sm text-slate-600 mb-2">Drag & Drop Files here to Upload</p>
                <button onClick={() => fileRef.current?.click()} className="px-4 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">Upload</button>
                <input ref={fileRef} type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="hidden" />
              </>
            )}
          </div>

          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex gap-2">
              <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-700 space-y-1">
                <p>Please upload .xlsx/.xls file only and minimum upload size is greater than 0 KB. Maximum upload size is 5 MB per document.</p>
                <p>Download the <button onClick={downloadTemplate} className="text-blue-600 underline font-medium inline-flex items-center gap-1"><Download size={11} />PLI Excel Template</button> file here.</p>
                <p>Excel file must contain only one Customer, one PLI Quarter, one BU, and one Vendor Code.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl">
          <button onClick={onClose} className="px-5 py-2 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-100">Cancel</button>
          <button onClick={handleSubmit} disabled={!file} className="px-5 py-2 text-sm font-medium text-white bg-blue-800 rounded-lg hover:bg-blue-900 disabled:opacity-40 disabled:cursor-not-allowed">Submit</button>
        </div>
      </div>
    </div>
  );
}
