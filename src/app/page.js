'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const [step, setStep] = useState('select');
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }
      document.cookie = `pli-token=${data.token}; path=/; max-age=${8 * 3600}`;
      document.cookie = `pli-user=${encodeURIComponent(JSON.stringify(data.user))}; path=/; max-age=${8 * 3600}`;
      if (data.user.role === 'buyer') {
        router.push('/buyer/dashboard');
      } else {
        router.push('/vendor/dashboard');
      }
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen login-gradient flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {step === 'select' ? (
          <div className="text-center animate-fade-in">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-10 border border-white/20 shadow-2xl">
              <h1 className="font-display text-3xl font-bold text-white mb-2 tracking-tight">PLI</h1>
              <p className="text-white/60 text-sm mb-10">Price List Information Portal</p>
              <div className="space-y-3">
                <button onClick={() => { setRole('buyer'); setStep('login'); }} className="w-full flex items-center justify-center gap-3 bg-white/15 hover:bg-white/25 text-white rounded-lg px-6 py-3.5 font-medium transition-all duration-200 border border-white/20 hover:border-white/40">
                  <LogIn size={18} />Login as Buyer
                </button>
                <button onClick={() => { setRole('vendor'); setStep('login'); }} className="w-full flex items-center justify-center gap-3 bg-white/15 hover:bg-white/25 text-white rounded-lg px-6 py-3.5 font-medium transition-all duration-200 border border-white/20 hover:border-white/40">
                  <LogIn size={18} />Login as Vendor
                </button>
              </div>
              <p className="text-white/30 text-xs mt-10">&copy; Varroc Engineering {new Date().getFullYear()}</p>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="text-center mb-6">
              <p className="text-white/70 text-sm font-medium uppercase tracking-widest">
                {role === 'buyer' ? 'PROD-VARROC-PLI-BUYER' : 'PROD-VARROC-PLI-VENDOR'}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <h2 className="text-center text-slate-800 font-display text-lg font-semibold mb-6">Sign in to your account</h2>
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm text-slate-500 mb-1.5">Username or email</label>
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder={role === 'buyer' ? 'buyer@varroc.com' : 'vendor1@josts.com'} required />
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1.5">Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="••••••••" required />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-slate-600">Remember me</span>
                </label>
                {error && (<div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-sm text-red-600">{error}</div>)}
                <button type="submit" disabled={loading} className="w-full bg-blue-800 hover:bg-blue-900 text-white rounded-lg py-3 font-semibold text-sm transition-colors disabled:opacity-50">
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
              <button onClick={() => { setStep('select'); setError(''); setUsername(''); setPassword(''); }} className="mt-4 w-full text-center text-sm text-slate-400 hover:text-slate-600 transition-colors">
                ← Back to role selection
              </button>
            </div>
            <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <p className="text-white/60 text-xs font-medium mb-1">Demo Credentials:</p>
              {role === 'buyer' ? (
                <p className="text-white/80 text-xs">buyer@varroc.com / buyer123</p>
              ) : (
                <div className="text-white/80 text-xs space-y-0.5">
                  <p>vendor1@josts.com / vendor123</p>
                  <p>vendor2@shreeswami.com / vendor123</p>
                  <p>vendor3@snwater.com / vendor123</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
