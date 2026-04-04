import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { usePatient } from '../context/PatientContext';
import { patients } from '../services/api';

const statusConfig = {
  completed: { icon: 'check_circle', fill: true, bg: 'bg-tertiary-container', textColor: 'text-on-tertiary-container', badge: 'Completed', badgeBg: 'bg-tertiary-fixed text-on-tertiary-fixed' },
  ongoing: { icon: 'pending', fill: false, bg: 'bg-primary-container', textColor: 'text-on-primary-container', badge: 'In Progress', badgeBg: 'bg-primary-fixed text-on-primary-fixed', borderLeft: 'border-l-4 border-primary' },
  scheduled: { icon: 'event', fill: false, bg: 'bg-secondary-container', textColor: 'text-on-secondary-container', badge: 'Scheduled', badgeBg: 'bg-secondary-fixed text-on-secondary-fixed' },
  in_progress: { icon: 'pending', fill: false, bg: 'bg-primary-container', textColor: 'text-on-primary-container', badge: 'In Progress', badgeBg: 'bg-primary-fixed text-on-primary-fixed', borderLeft: 'border-l-4 border-primary' },
};

export default function Timeline() {
  const { patientId } = usePatient();
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) {
      setMilestones([]);
      setLoading(false);
      return;
    }
    loadTimeline();
  }, [patientId]);

  const loadTimeline = async () => {
    setLoading(true);
    try {
      const data = await patients.getTimeline(patientId);
      setMilestones(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load timeline: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (milestoneId, newStatus) => {
    try {
      const updated = await patients.updateMilestone(patientId, milestoneId, { status: newStatus });
      setMilestones(prev => prev.map(m => m.id === milestoneId ? { ...m, ...updated } : m));
      toast.success(`Milestone updated to "${newStatus}"`);
    } catch (err) {
      toast.error('Update failed: ' + (err.message || 'Unknown error'));
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Present';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const completedCount = milestones.filter(m => m.status === 'completed').length;
  const totalCount = milestones.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-10 pb-32 pt-12">
      {/* Section: Timeline Header */}
      <section className="mb-12">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <span className="mb-1 block text-sm font-semibold tracking-widest text-secondary uppercase">Ongoing</span>
            <h1 className="text-4xl font-extrabold tracking-tight text-primary">Your Medical Journey</h1>
          </div>
          <div className="hidden md:block">
            <span className="rounded-full bg-secondary-container px-4 py-2 text-xs font-bold text-on-secondary-container">
              {milestones.filter(m => m.status === 'ongoing' || m.status === 'in_progress').length > 0 ? 'Active Protocol' : 'No Active Protocol'}
            </span>
          </div>
        </div>
        <p className="max-w-xl text-lg leading-relaxed text-on-surface-variant">
          Track your clinical progression and upcoming milestones in real-time.
        </p>
      </section>

      {/* Timeline Container */}
      <div className="relative space-y-12">
        {/* Vertical Line */}
        <div className="absolute bottom-4 left-6 top-4 hidden w-px bg-outline-variant/30 md:block"></div>

        {milestones.length === 0 ? (
          <div className="rounded-2xl bg-surface-container-lowest p-12 text-center md:ml-20">
            <span className="material-symbols-outlined mb-4 text-5xl text-on-surface-variant/40">timeline</span>
            <p className="text-lg font-semibold text-on-surface-variant">No milestones yet.</p>
            <p className="text-sm text-on-surface-variant/70 mt-2">Upload medical records to automatically generate your clinical timeline.</p>
          </div>
        ) : (
          milestones.map((milestone) => {
            const cfg = statusConfig[milestone.status] || statusConfig.scheduled;
            return (
              <article key={milestone.id} className="relative flex flex-col gap-8 md:flex-row">
                {/* Timeline Marker */}
                <div className="z-10 hidden flex-col items-center md:flex">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${cfg.bg} shadow-sm`}>
                    <span className={`material-symbols-outlined ${cfg.textColor}`} style={{ fontVariationSettings: `'FILL' ${cfg.fill ? 1 : 0}` }}>
                      {cfg.icon}
                    </span>
                  </div>
                </div>

                {/* Content Card */}
                <div className={`flex-1 rounded-xl bg-surface-container-lowest p-8 shadow-[0_8px_24px_rgba(25,28,29,0.04)] duration-300 hover:scale-[1.01] transition-transform ${cfg.borderLeft || ''}`}>
                  <div className="mb-6 flex items-start justify-between">
                    <div>
                      <h2 className="mb-1 text-2xl font-bold text-primary">{milestone.category}</h2>
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase ${cfg.badgeBg}`}>
                        {cfg.badge}
                      </span>
                    </div>
                    <span className="text-sm text-on-surface-variant">
                      {formatDate(milestone.start_date)} — {formatDate(milestone.end_date)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Documents */}
                    <div>
                      <h3 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-widest text-on-surface-variant uppercase">
                        <span className="material-symbols-outlined text-sm">description</span> Documents
                      </h3>
                      {milestone.documents && milestone.documents.length > 0 ? (
                        <ul className="space-y-3">
                          {milestone.documents.map((doc, i) => (
                            <li key={i} className="group flex items-center justify-between rounded-lg bg-surface-container-low p-3 transition-colors hover:bg-surface-container-high cursor-pointer">
                              <span className="font-medium text-on-surface">{typeof doc === 'string' ? doc : doc.name || 'Document'}</span>
                              <span className="material-symbols-outlined cursor-pointer text-xl text-primary group-hover:scale-110 transition-transform">download</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-on-surface-variant/60">No documents attached</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div>
                      <h3 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-widest text-on-surface-variant uppercase">
                        <span className="material-symbols-outlined text-sm">task_alt</span> Actions
                      </h3>
                      {milestone.actions && milestone.actions.length > 0 ? (
                        <ul className="space-y-3">
                          {milestone.actions.map((action, i) => (
                            <li key={i} className="flex items-center gap-3 p-1">
                              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_box</span>
                              <span className="font-medium text-on-surface">{typeof action === 'string' ? action : action.name || 'Action'}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-on-surface-variant/60">No actions defined</p>
                      )}
                      
                      {/* Update Progress Button */}
                      {milestone.status !== 'completed' && (
                        <div className="mt-6">
                          <button
                            onClick={() => handleUpdateStatus(milestone.id, 'completed')}
                            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-container px-8 py-3 text-sm font-bold text-on-primary shadow-md transition-all hover:opacity-90"
                          >
                            Mark Complete <span className="material-symbols-outlined text-sm">check</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        )}

        {/* Summary Card */}
        <article className="rounded-xl border border-secondary-container/30 bg-secondary-container/20 p-6 md:ml-20">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>medical_information</span>
            </div>
            <div>
              <h4 className="font-bold text-secondary">Clinical Summary</h4>
              <p className="text-sm text-on-surface-variant">
                Your journey is {progressPct}% complete. {completedCount} of {totalCount} milestones finished.
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
