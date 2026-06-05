'use client';
import { X } from 'lucide-react';

export default function EditFieldsPanel({ fields, visibleFields, onToggle, onReset, onApply, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 z-40 animate-fade-in">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <h3 className="font-semibold text-sm text-slate-800">Edit Fields</h3>
        <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
          <X size={16} className="text-slate-400" />
        </button>
      </div>
      <div className="p-4 max-h-80 overflow-y-auto space-y-3">
        {fields.map((field) => (
          <label key={field.key} className="flex items-center justify-between cursor-pointer group">
            <span className="text-sm text-slate-700 group-hover:text-slate-900 font-medium">{field.label}</span>
            <button
              onClick={() => onToggle(field.key)}
              className={`w-10 h-5 rounded-full transition-colors duration-200 relative ${
                visibleFields.includes(field.key) ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  visibleFields.includes(field.key) ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </label>
        ))}
      </div>
      <div className="flex justify-end gap-2 px-4 py-3 border-t border-slate-200 bg-slate-50 rounded-b-xl">
        <button onClick={onReset} className="px-4 py-1.5 text-xs font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-100">Reset Default</button>
        <button onClick={onApply} className="px-4 py-1.5 text-xs font-medium text-white bg-blue-800 rounded-lg hover:bg-blue-900">Apply</button>
      </div>
    </div>
  );
}
