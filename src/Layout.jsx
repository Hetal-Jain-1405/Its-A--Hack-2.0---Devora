import { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import { usePatient } from './context/PatientContext';
import { search, analytics } from './services/api';

const navItems = [
  { name: 'Dashboard', path: '/', icon: 'dashboard' },
  { name: 'Insights', path: '/insights', icon: 'insights' },
  { name: 'Actions', path: '/actions', icon: 'task_alt' },
  { name: 'Documents', path: '/upload', icon: 'description' },
  { name: 'Timeline', path: '/timeline', icon: 'timeline' },
  { name: 'Alerts', path: '/alerts', icon: 'notifications_active' },
  { name: 'Family', path: '/family', icon: 'family_restroom' },
  { name: 'Profile', path: '/profile', icon: 'account_circle' },
];

export default function Layout() {
  const [isSimpleMode, setIsSimpleMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [diagData, setDiagData] = useState(null);
  const searchRef = useRef(null);
  const { user, isAuth, loading, logout } = useAuth();
  const { setPatientId } = usePatient();
  const nav = useNavigate();

  // Auth guard
  useEffect(() => {
    if (!loading && !isAuth) nav('/login', { replace: true });
  }, [loading, isAuth, nav]);

  // Close search results on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowResults(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Load diagnostics data
  useEffect(() => {
    if (isAuth && !isSimpleMode) {
      analytics.getSummary().then(setDiagData).catch(() => {});
    }
  }, [isAuth, isSimpleMode]);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults(null); setShowResults(false); return; }
    const timeout = setTimeout(async () => {
      try {
        const data = await search.query(searchQuery);
        setSearchResults(data);
        setShowResults(true);
      } catch { setSearchResults(null); }
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleModeSwitch = (mode) => {
    setIsSimpleMode(mode === 'Simple');
    toast.success(`${mode} view enabled.`, { icon: '🔄' });
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
    </div>
  );

  if (!isAuth) return null;

  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface">
      <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-slate-50 py-6 dark:bg-slate-900">
        <div className="mb-8 px-6">
          <span className="text-xl font-bold text-blue-900 dark:text-blue-200">Clinical Precision</span>
          <p className="mt-1 text-[10px] uppercase tracking-widest text-slate-400">Medical Management</p>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-6 py-3 font-sans text-sm tracking-tight transition-colors duration-200 ${isActive && item.path !== '#' && !item.path.startsWith('#')
                  ? 'border-r-4 border-blue-700 bg-white font-bold text-blue-700'
                  : 'font-medium text-slate-500 hover:bg-blue-50'
                }`
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-6 border-t border-slate-100 px-6 pt-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary-fixed">
              <span className="material-symbols-outlined text-primary">person</span>
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-bold text-slate-900 truncate">{user?.full_name || 'User'}</span>
              <span className="text-xs text-slate-500 capitalize">{user?.role || 'user'}</span>
            </div>
          </div>
          <button
            onClick={() => { logout(); nav('/login'); }}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-error/10 px-4 py-2 text-xs font-bold text-error transition-all hover:bg-error/20"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Sign Out
          </button>
        </div>
      </aside>

      <header className="fixed left-64 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-100 bg-white/80 px-8 backdrop-blur-md">
        <div className="flex flex-1 items-center space-x-6">
          <div className="relative w-96" ref={searchRef}>
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchResults && setShowResults(true)}
              placeholder="Search patient data..."
              className="w-full rounded-full border-none bg-surface-container-low py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20"
            />
            {/* Search Results Dropdown */}
            {showResults && searchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 max-h-80 overflow-y-auto rounded-2xl bg-white p-3 shadow-2xl border border-slate-100 z-50">
                {searchResults.total === 0 ? (
                  <p className="p-4 text-center text-sm text-on-surface-variant">No results found for "{searchResults.query}"</p>
                ) : (
                  <div className="space-y-1">
                    <p className="px-3 py-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">{searchResults.total} result{searchResults.total !== 1 ? 's' : ''}</p>
                    {searchResults.results.map((r) => (
                      <div
                        key={r.id}
                        onClick={() => {
                          if (r.type === 'patient') setPatientId(r.id);
                          setShowResults(false);
                          setSearchQuery('');
                          if (r.type === 'patient') toast.success('Active patient updated', { icon: '👤' });
                        }}
                        className="flex items-center gap-3 rounded-xl p-3 cursor-pointer hover:bg-surface-container-low transition-colors"
                      >
                        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${r.type === 'alert' ? 'bg-error/10 text-error' : r.type === 'patient' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                          <span className="material-symbols-outlined text-sm">{r.type === 'alert' ? 'warning' : r.type === 'patient' ? 'person' : 'article'}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{r.title}</p>
                          <p className="text-xs text-on-surface-variant truncate">{r.description}</p>
                        </div>
                        <span className="rounded-full bg-surface-container-low px-2 py-0.5 text-[10px] font-bold text-on-surface-variant capitalize">{r.type}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex rounded-full bg-surface-container-high p-1">
            <button
              onClick={() => handleModeSwitch('Simple')}
              className={`rounded-full px-4 py-1 text-xs transition-all ${isSimpleMode ? 'bg-white font-semibold text-primary shadow-sm' : 'font-medium text-slate-500 hover:text-slate-700'}`}>
              Simple
            </button>
            <button
              onClick={() => handleModeSwitch('Technical')}
              className={`rounded-full px-4 py-1 text-xs transition-all ${!isSimpleMode ? 'bg-white font-semibold text-primary shadow-sm' : 'font-medium text-slate-500 hover:text-slate-700'}`}>
              Technical
            </button>
          </div>
          <button onClick={() => nav('/alerts')} className="relative rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-50">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-error"></span>
          </button>
          <div className="mx-2 h-8 w-[1px] bg-slate-200"></div>
          <button onClick={() => nav('/profile')} className="text-sm font-medium text-primary hover:underline">Profile Settings</button>
        </div>
      </header>

      <main className={`ml-64 min-h-screen bg-surface pt-16 transition-all duration-300 ${!isSimpleMode ? 'mr-72' : ''}`}>
        <Outlet />
      </main>

      {/* Technical Mode: Diagnostics Panel */}
      <div className={`fixed right-0 top-16 bottom-0 w-72 border-l border-slate-100 bg-slate-50 p-6 shadow-inner transition-transform duration-300 ${!isSimpleMode ? 'translate-x-0' : 'translate-x-full'}`}>
        <h3 className="mb-6 flex items-center gap-2 text-xs font-bold tracking-widest text-slate-400 uppercase">
          <span className="material-symbols-outlined text-sm">terminal</span> Diagnostics
        </h3>
        <div className="space-y-4">
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Pending Tasks</span>
            <p className="mt-1 text-2xl font-extrabold text-primary">{diagData?.pending_tasks ?? '—'}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Total Patients</span>
            <p className="mt-1 text-2xl font-extrabold text-on-surface">{diagData?.total_patients ?? '—'}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Documents</span>
            <p className="mt-1 text-2xl font-extrabold text-on-surface">{diagData?.total_documents ?? '—'}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Critical Conditions</span>
            <p className="mt-1 text-2xl font-extrabold text-error">{diagData?.critical_conditions ?? '—'}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Encryption</span>
            <div className="mt-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              <span className="text-sm font-bold text-tertiary">AES-256</span>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 right-8 flex flex-col items-end space-y-4">
        <div className="flex flex-col items-center space-y-4 rounded-2xl border border-outline-variant/10 bg-white p-4 shadow-2xl">
          <button className="p-3 text-slate-400 transition-colors hover:text-primary">
            <span className="material-symbols-outlined">chat_bubble</span>
          </button>
          <button className="p-3 text-slate-400 transition-colors hover:text-primary">
            <span className="material-symbols-outlined">help</span>
          </button>
          <div className="h-[1px] w-10 bg-slate-100"></div>
          <button className="rounded-full bg-primary p-4 text-white shadow-lg transition-transform hover:scale-110">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 600" }}>add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
