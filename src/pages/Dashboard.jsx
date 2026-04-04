import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from '../context/AuthContext';
import { analytics } from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await analytics.getSummary();
        setStats(data);
      } catch (err) {
        toast.error('Failed to load analytics: ' + (err.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="mx-auto max-w-[1600px] p-10 h-full flex flex-col">
      {/* Page Header */}
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-on-surface">System Overview</h1>
          <p className="text-lg text-on-surface-variant">
            Welcome back{user?.full_name ? `, ${user.full_name}` : ''} to the <span className="font-bold text-primary">Clinical Precision Platform</span>
          </p>
        </div>
        {/* Quick Stats */}
        {stats && (
          <div className="flex gap-4">
            <div className="rounded-2xl bg-primary/10 px-5 py-3 text-center">
              <p className="text-2xl font-extrabold text-primary">{stats.pending_tasks}</p>
              <p className="text-[10px] font-bold tracking-widest text-primary/70 uppercase">Pending</p>
            </div>
            <div className="rounded-2xl bg-tertiary/10 px-5 py-3 text-center">
              <p className="text-2xl font-extrabold text-tertiary">{stats.completed_tasks}</p>
              <p className="text-[10px] font-bold tracking-widest text-tertiary/70 uppercase">Done</p>
            </div>
            <div className="rounded-2xl bg-error/10 px-5 py-3 text-center">
              <p className="text-2xl font-extrabold text-error">{stats.critical_conditions}</p>
              <p className="text-[10px] font-bold tracking-widest text-error/70 uppercase">Critical</p>
            </div>
          </div>
        )}
      </div>

      {/* Analytics Summary Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <span className="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span>
        </div>
      ) : stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="rounded-2xl bg-surface-container-lowest p-6 border border-outline-variant/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <span className="material-symbols-outlined text-primary">group</span>
              </div>
              <span className="text-sm font-semibold text-on-surface-variant">Patients</span>
            </div>
            <p className="text-3xl font-extrabold text-on-surface">{stats.total_patients}</p>
          </div>
          <div className="rounded-2xl bg-surface-container-lowest p-6 border border-outline-variant/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10">
                <span className="material-symbols-outlined text-secondary">description</span>
              </div>
              <span className="text-sm font-semibold text-on-surface-variant">Documents</span>
            </div>
            <p className="text-3xl font-extrabold text-on-surface">{stats.total_documents}</p>
          </div>
          <div className="rounded-2xl bg-surface-container-lowest p-6 border border-outline-variant/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-error/10">
                <span className="material-symbols-outlined text-error">running_with_errors</span>
              </div>
              <span className="text-sm font-semibold text-on-surface-variant">Missed Tasks</span>
            </div>
            <p className="text-3xl font-extrabold text-error">{stats.missed_tasks}</p>
          </div>
          <div className="rounded-2xl bg-surface-container-lowest p-6 border border-outline-variant/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-tertiary/10">
                <span className="material-symbols-outlined text-tertiary">auto_awesome</span>
              </div>
              <span className="text-sm font-semibold text-on-surface-variant">AI Insights</span>
            </div>
            <p className="text-3xl font-extrabold text-on-surface">{stats.recent_insights}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Feature 1 */}
        <Link 
          to="/insights"
          className="group flex flex-col items-start rounded-[2rem] bg-surface-container-lowest p-8 transition-all hover:bg-primary-fixed border border-outline-variant/10 shadow-sm hover:shadow-md cursor-pointer"
        >
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm group-hover:bg-white group-hover:shadow-md transition-all">
            <span className="material-symbols-outlined text-3xl">insights</span>
          </div>
          <h3 className="mb-2 text-2xl font-bold">AI Insights</h3>
          <p className="mb-6 text-on-surface-variant leading-relaxed">View comprehensive health synthesis and AI-driven clinical analytics for your patients.</p>
          <div className="mt-auto flex items-center space-x-1 text-sm font-bold text-primary group-hover:underline">
            <span>Explore Module</span>
            <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
          </div>
        </Link>

        {/* Feature 2 */}
        <Link 
          to="/actions"
          className="group flex flex-col items-start rounded-[2rem] bg-surface-container-lowest p-8 transition-all hover:bg-primary-fixed border border-outline-variant/10 shadow-sm hover:shadow-md cursor-pointer"
        >
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm group-hover:bg-white group-hover:shadow-md transition-all">
            <span className="material-symbols-outlined text-3xl">task_alt</span>
          </div>
          <h3 className="mb-2 text-2xl font-bold">Daily Actions</h3>
          <p className="mb-6 text-on-surface-variant leading-relaxed">Manage your clinically prioritized tasks, view health streaks, and schedule patient appointments.</p>
          <div className="mt-auto flex items-center space-x-1 text-sm font-bold text-primary group-hover:underline">
            <span>Explore Module</span>
            <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
          </div>
        </Link>

        {/* Feature 3 */}
        <Link 
          to="/upload"
          className="group flex flex-col items-start rounded-[2rem] bg-surface-container-lowest p-8 transition-all hover:bg-primary-fixed border border-outline-variant/10 shadow-sm hover:shadow-md cursor-pointer"
        >
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm group-hover:bg-white group-hover:shadow-md transition-all">
            <span className="material-symbols-outlined text-3xl">description</span>
          </div>
          <h3 className="mb-2 text-2xl font-bold">Upload Records</h3>
          <p className="mb-6 text-on-surface-variant leading-relaxed">Securely upload, process, and automatically extract medical histories from patient records.</p>
          <div className="mt-auto flex items-center space-x-1 text-sm font-bold text-primary group-hover:underline">
            <span>Explore Module</span>
            <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
          </div>
        </Link>
      </div>
      
      {/* Footer Info */}
      <div className="mt-auto pt-12 flex items-center text-xs text-on-surface-variant/70 justify-between">
        <p>Platform version: v2.4.1 (Stable Build)</p>
        <p>All clinical inputs are monitored by compliance.</p>
      </div>
    </div>
  );
}
