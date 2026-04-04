import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { alerts as alertsApi, actions as actionsApi } from '../services/api';

const typeConfig = {
  critical: {
    badge: 'CRITICAL',
    border: 'border-l-error',
    badgeBg: 'bg-error/10 text-error',
    iconBg: 'bg-error/10 text-error',
    pulse: true,
  },
  warning: {
    badge: 'WARNING',
    border: 'border-l-[#E6A700]',
    badgeBg: 'bg-[#E6A700]/10 text-[#A67B00]',
    iconBg: 'bg-[#E6A700]/10 text-[#A67B00]',
    pulse: false,
  },
  info: {
    badge: 'INFO',
    border: 'border-l-primary',
    badgeBg: 'bg-primary/10 text-primary',
    iconBg: 'bg-primary/10 text-primary',
    pulse: false,
  },
};

const categoryIcons = {
  medication: 'medication',
  appointment: 'calendar_today',
  lab_result: 'biotech',
  system: 'monitor_heart',
};

export default function Alerts() {
  const { user } = useAuth();
  const [alertsList, setAlertsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    loadAlerts();
  }, [activeFilter]);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeFilter !== 'all') params.severity = activeFilter;
      const data = await alertsApi.getAll(params);
      setAlertsList(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load alerts: ' + (err.message || 'Unknown error'));
      setAlertsList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = async (alertId) => {
    try {
      await alertsApi.update(alertId, 'dismissed');
      setAlertsList(prev => prev.filter(a => a.id !== alertId));
      toast.success('Alert dismissed.', { icon: '🔕' });
    } catch (err) {
      toast.error('Failed to dismiss: ' + (err.message || 'Unknown error'));
    }
  };

  const handleSnooze = async (alertId) => {
    try {
      await alertsApi.update(alertId, 'snoozed');
      setAlertsList(prev => prev.filter(a => a.id !== alertId));
      toast.success('Alert snoozed.', { icon: '🔕' });
    } catch (err) {
      toast.error('Failed to snooze: ' + (err.message || 'Unknown error'));
    }
  };

  const handleRefill = async (alert) => {
    try {
      await actionsApi.refill({
        patient_id: alert.patient_id || user?.id,
        medication: alert.title || 'Medication',
        notes: alert.message,
      });
      toast.success('Pharmacy refill request submitted.', { icon: '💊' });
    } catch (err) {
      toast.error('Refill request failed: ' + (err.message || 'Unknown error'));
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - d) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff} min ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hr${Math.floor(diff / 60) > 1 ? 's' : ''} ago`;
    return d.toLocaleDateString();
  };

  const filters = ['all', 'critical', 'warning', 'info'];
  const criticalCount = alertsList.filter(a => a.severity === 'critical').length;

  return (
    <div className="mx-auto max-w-4xl p-10 pb-32 pt-12">
      {/* Header */}
      <section className="mb-10">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <span className="mb-1 block text-sm font-semibold tracking-widest text-error uppercase">Priority</span>
            <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">Health Alerts</h1>
          </div>
          <span className="rounded-full bg-error/10 px-4 py-2 text-xs font-bold text-error">
            {criticalCount} Critical
          </span>
        </div>
        <p className="max-w-xl text-lg leading-relaxed text-on-surface-variant">
          Manage your clinical updates and health alerts.
        </p>
        <p className="mt-4 italic text-on-surface-variant/60 text-sm">
          "Your health is a curated journey. Every notification is a step toward wellness."
        </p>
      </section>

      {/* Filters */}
      <div className="mb-8 flex gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`rounded-full px-5 py-2 text-xs font-bold capitalize tracking-wide transition-all ${
              activeFilter === f
                ? 'bg-primary text-on-primary shadow-md'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span>
          </div>
        ) : alertsList.length === 0 ? (
          <div className="rounded-2xl bg-surface-container-lowest p-12 text-center">
            <span className="material-symbols-outlined mb-4 text-5xl text-on-surface-variant/40">notifications_off</span>
            <p className="text-lg font-semibold text-on-surface-variant">No alerts to display.</p>
            <p className="text-sm text-on-surface-variant/70 mt-2">You're all clear! No {activeFilter !== 'all' ? activeFilter : ''} alerts at this time.</p>
          </div>
        ) : (
          alertsList.map((alert) => {
            const severity = alert.severity || 'info';
            const cfg = typeConfig[severity] || typeConfig.info;
            const icon = categoryIcons[alert.category] || 'notifications';

            return (
              <article
                key={alert.id}
                className={`relative rounded-xl border-l-4 ${cfg.border} bg-surface-container-lowest p-6 shadow-[0_4px_16px_rgba(25,28,29,0.04)] transition-all hover:shadow-md`}
              >
                <div className="flex items-start gap-5">
                  {/* Icon */}
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${cfg.iconBg}`}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                    {cfg.pulse && (
                      <span className="absolute left-8 top-4 h-3 w-3 animate-ping rounded-full bg-error/60"></span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${cfg.badgeBg}`}>
                        {cfg.badge}
                      </span>
                      <span className="text-xs text-on-surface-variant">{formatTime(alert.created_at)}</span>
                    </div>
                    <h3 className="mb-1 text-lg font-bold text-on-surface">{alert.title}</h3>
                    <p className="text-sm leading-relaxed text-on-surface-variant">{alert.message}</p>

                    {/* Actions */}
                    <div className="mt-4 flex gap-3">
                      {alert.category === 'medication' && (
                        <button
                          onClick={() => handleRefill(alert)}
                          className="rounded-full px-5 py-2 text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20 transition-all"
                        >
                          Reorder Now
                        </button>
                      )}
                      {alert.category === 'lab_result' && (
                        <button
                          onClick={() => toast.loading('Loading clinical protocol...', { duration: 2000 })}
                          className="rounded-full px-5 py-2 text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20 transition-all"
                        >
                          Review Protocol
                        </button>
                      )}
                      {alert.category === 'appointment' && (
                        <button
                          onClick={() => toast.success('Viewing appointment details.')}
                          className="rounded-full px-5 py-2 text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20 transition-all"
                        >
                          View Details
                        </button>
                      )}
                      <button
                        onClick={() => handleSnooze(alert.id)}
                        className="rounded-full px-5 py-2 text-xs font-bold bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition-all"
                      >
                        Snooze
                      </button>
                      <button
                        onClick={() => handleDismiss(alert.id)}
                        className="rounded-full px-5 py-2 text-xs font-bold bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition-all"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
