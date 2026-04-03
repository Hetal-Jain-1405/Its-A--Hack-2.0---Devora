import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import toast from 'react-hot-toast';

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

  const handleModeSwitch = (mode) => {
    setIsSimpleMode(mode === 'Simple');
    toast.success(`${mode} view enabled.`, { icon: '🔄' });
  };

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
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_Srtjr_03bIKw2LKbZYE76s_0JOPkm1OWPXwegzhfoucnD0F7Ddum_9SpNjll8pwTKb3Y2ZE-5Nx1q1Dr19WSrdSkOs8IQAfrKXvdGZZgJ3f5x9Oh9pugDe_TXoA-Ba1gV5dW_TDmy_WoXx2lQ5Vhz2bNS3tugsl05T3Ffn953VEVP9bJkmH6Hfv7xNzHmFXOKMr5nL0GxiqCZO5EuqQVQJZarC5ZBvlev7-nsWzlzChO_63CGQNQQfGyD-LY0Qpcc-ZGG5QZaQ"
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900">Dr. Aris Thorne</span>
              <span className="text-xs text-slate-500">Hematology</span>
            </div>
          </div>
        </div>
      </aside>

      <header className="fixed left-64 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-100 bg-white/80 px-8 backdrop-blur-md">
        <div className="flex flex-1 items-center space-x-6">
          <div className="relative w-96">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400">search</span>
            <input
              type="text"
              placeholder="Search patient data..."
              className="w-full rounded-full border-none bg-surface-container-low py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20"
            />
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
          <button className="relative rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-50">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-error"></span>
          </button>
          <div className="mx-2 h-8 w-[1px] bg-slate-200"></div>
          <button className="text-sm font-medium text-primary hover:underline">Profile Settings</button>
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
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">API Latency</span>
            <p className="mt-1 text-2xl font-extrabold text-primary">42<span className="text-sm font-medium text-slate-400">ms</span></p>
            <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100"><div className="h-1.5 w-[30%] rounded-full bg-primary"></div></div>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">FHIR Sync</span>
            <p className="mt-1 text-sm font-bold text-tertiary">Connected</p>
            <p className="text-xs text-slate-400">Last sync: 3 min ago</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Active Sessions</span>
            <p className="mt-1 text-2xl font-extrabold text-on-surface">2</p>
            <p className="text-xs text-slate-400">iPhone 15 Pro, MacBook Pro</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Encryption</span>
            <div className="mt-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              <span className="text-sm font-bold text-tertiary">AES-256</span>
            </div>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">System Load</span>
            <p className="mt-1 text-2xl font-extrabold text-on-surface">12<span className="text-sm font-medium text-slate-400">%</span></p>
            <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100"><div className="h-1.5 w-[12%] rounded-full bg-tertiary"></div></div>
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
