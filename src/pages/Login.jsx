import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [isReg, setIsReg] = useState(false);
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('user');
  const [busy, setBusy] = useState(false);
  const { login, register } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault(); setBusy(true);
    try {
      if (isReg) { await register(email, pw, name, role); toast.success('Account created!'); }
      else { await login(email, pw); toast.success('Welcome back!'); }
      nav('/');
    } catch (err) { toast.error(err.message || 'Auth failed'); }
    finally { setBusy(false); }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface font-sans">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-secondary/5 blur-3xl"></div>
      </div>
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-container shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-3xl text-white" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">CareFlow <span className="text-primary">AI</span></h1>
          <p className="mt-2 text-sm text-on-surface-variant">{isReg ? 'Create your clinical account' : 'Sign in to your dashboard'}</p>
        </div>
        <div className="rounded-2xl bg-surface-container-lowest p-8 shadow-[0_8px_32px_rgba(12,59,94,0.08)]">
          <div className="mb-8 flex rounded-full bg-surface-container-low p-1">
            <button onClick={() => setIsReg(false)} className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition-all ${!isReg ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant'}`}>Sign In</button>
            <button onClick={() => setIsReg(true)} className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition-all ${isReg ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant'}`}>Register</button>
          </div>
          <form onSubmit={submit} className="space-y-5">
            {isReg && (
              <div>
                <label className="mb-1.5 block text-xs font-bold tracking-widest text-on-surface-variant uppercase">Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required={isReg} placeholder="Dr. Aris Thorne" className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm focus:ring-2 focus:ring-primary/30" />
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-xs font-bold tracking-widest text-on-surface-variant uppercase">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="physician@careflow.ai" className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold tracking-widest text-on-surface-variant uppercase">Password</label>
              <input type="password" value={pw} onChange={e => setPw(e.target.value)} required placeholder="••••••••" minLength={8} className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm focus:ring-2 focus:ring-primary/30" />
            </div>
            {isReg && (
              <div>
                <label className="mb-1.5 block text-xs font-bold tracking-widest text-on-surface-variant uppercase">Role</label>
                <select value={role} onChange={e => setRole(e.target.value)} className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm focus:ring-2 focus:ring-primary/30">
                  <option value="user">Patient / User</option>
                  <option value="physician">Physician</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            )}
            <button type="submit" disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-container py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:opacity-90 disabled:opacity-50">
              {busy ? (<><span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>{isReg ? 'Creating...' : 'Signing In...'}</>) : (<><span className="material-symbols-outlined text-sm">{isReg ? 'person_add' : 'login'}</span>{isReg ? 'Create Account' : 'Sign In'}</>)}
            </button>
          </form>
        </div>
        <p className="mt-8 text-center text-xs text-on-surface-variant/50">HIPAA Compliant · AES-256 Encryption · SOC 2 Certified</p>
      </div>
    </div>
  );
}
