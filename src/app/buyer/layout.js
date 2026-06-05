import Header from '@/components/Header';

export default function BuyerLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      {children}
    </div>
  );
}
