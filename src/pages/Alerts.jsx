import { useState } from 'react';
import toast from 'react-hot-toast';

const alertsData = [
  {
    id: 1,
    type: 'critical',
    icon: 'warning',
    title: 'Blood Sugar 180 mg/dL',
    description: 'Glucose levels have exceeded the safe threshold. Immediate dietary adjustment or insulin dosage review recommended.',
    time: '12 min ago',
    actions: ['Review Protocol', 'Dismiss'],
  },
  {
    id: 2,
    type: 'warning',
    icon: 'medication',
    title: 'Low Medicine Supply',
    description: 'Metformin supply is projected to run out in 3 days. Contact pharmacy for a refill or adjust prescription.',
    time: '1 hr ago',
    actions: ['Reorder Now', 'Snooze'],
  },
  {
    id: 3,
    type: 'info',
    icon: 'calendar_today',
    title: 'Appointment Tomorrow at 10 AM',
    description: 'Follow-up consultation with Dr. Aris Thorne scheduled. Please bring updated lab results.',
    time: '3 hrs ago',
    actions: ['View Details', 'Reschedule'],
  },
  {
    id: 4,
    type: 'info',
    icon: 'monitor_heart',
    title: 'Weekly Vitals Summary Ready',
    description: 'Your weekly heart rate, blood pressure, and sleep analysis report has been generated.',
    time: '5 hrs ago',
    actions: ['View Report'],
  },
];

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

export default function Alerts() {
  const [dismissed, setDismissed] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');

  const handleAction = (alertId, action) => {
    if (action === 'Dismiss' || action === 'Snooze') {
      setDismissed((prev) => [...prev, alertId]);
      toast.success(`Alert ${action === 'Dismiss' ? 'dismissed' : 'snoozed'}.`, { icon: '🔕' });
    } else if (action === 'Reorder Now') {
      toast.success('Pharmacy refill request submitted.', { icon: '💊' });
    } else if (action === 'Review Protocol') {
      toast.loading('Loading clinical protocol...', { duration: 2000 });
    } else {
      toast.success(`${action} action triggered.`);
    }
  };

  const filters = ['all', 'critical', 'warning', 'info'];

  const visibleAlerts = alertsData
    .filter((a) => !dismissed.includes(a.id))
    .filter((a) => activeFilter === 'all' || a.type === activeFilter);

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
            {alertsData.filter((a) => !dismissed.includes(a.id) && a.type === 'critical').length} Critical
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
        {visibleAlerts.length === 0 && (
          <div className="rounded-2xl bg-surface-container-lowest p-12 text-center">
            <span className="material-symbols-outlined mb-4 text-5xl text-on-surface-variant/40">notifications_off</span>
            <p className="text-lg font-semibold text-on-surface-variant">No alerts to display.</p>
          </div>
        )}

        {visibleAlerts.map((alert) => {
          const cfg = typeConfig[alert.type];
          return (
            <article
              key={alert.id}
              className={`relative rounded-xl border-l-4 ${cfg.border} bg-surface-container-lowest p-6 shadow-[0_4px_16px_rgba(25,28,29,0.04)] transition-all hover:shadow-md`}
            >
              <div className="flex items-start gap-5">
                {/* Icon */}
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${cfg.iconBg}`}>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{alert.icon}</span>
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
                    <span className="text-xs text-on-surface-variant">{alert.time}</span>
                  </div>
                  <h3 className="mb-1 text-lg font-bold text-on-surface">{alert.title}</h3>
                  <p className="text-sm leading-relaxed text-on-surface-variant">{alert.description}</p>

                  {/* Actions */}
                  <div className="mt-4 flex gap-3">
                    {alert.actions.map((action) => (
                      <button
                        key={action}
                        onClick={() => handleAction(alert.id, action)}
                        className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
                          action === 'Dismiss' || action === 'Snooze'
                            ? 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                            : 'bg-primary/10 text-primary hover:bg-primary/20'
                        }`}
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
