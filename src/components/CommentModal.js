'use client';
import { useState } from 'react';
import { X } from 'lucide-react';

export default function CommentModal({ title, isOpen, onClose, onSubmit, maxChars = 200 }) {
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!comment.trim()) return;
    onSubmit(comment);
    setComment('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="font-display font-semibold text-slate-800">{title || 'Comments'}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={18} className="text-slate-400" />
          </button>
        </div>
        <div className="px-6 py-5">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, maxChars))}
            placeholder="Enter Comments"
            rows={4}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <p className="text-right text-xs text-slate-400 mt-1">{comment.length}/{maxChars}</p>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl">
          <button onClick={onClose} className="px-5 py-2 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-100">Cancel</button>
          <button onClick={handleSubmit} disabled={!comment.trim()} className="px-5 py-2 text-sm font-medium text-white bg-blue-800 rounded-lg hover:bg-blue-900 disabled:opacity-40 disabled:cursor-not-allowed">Submit</button>
        </div>
      </div>
    </div>
  );
}
