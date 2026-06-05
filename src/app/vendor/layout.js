import Header from '@/components/Header';

export default function VendorLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      {children}
    </div>
  );
}
