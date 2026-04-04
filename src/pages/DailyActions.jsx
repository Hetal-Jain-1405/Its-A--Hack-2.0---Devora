import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { tasks, analytics } from '../services/api';

const filterMap = { 'Today': 'today', 'Upcoming': 'upcoming', 'Missed': 'missed' };

export default function DailyActions() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Today');
  const [taskList, setTaskList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadTasks();
  }, [activeTab]);

  useEffect(() => {
    analytics.getSummary().then(setStats).catch(() => {});
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await tasks.getAll(filterMap[activeTab]);
      setTaskList(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load tasks: ' + (err.message || 'Unknown error'));
      setTaskList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskToggle = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await tasks.update(task.id, { status: newStatus });
      setTaskList(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
      if (newStatus === 'completed') {
        toast.success(`Completed: ${task.title}`);
      } else {
        toast(`Unmarked: ${task.title}`, { icon: '🔄' });
      }
    } catch (err) {
      toast.error('Failed to update task: ' + (err.message || 'Unknown error'));
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const completedCount = taskList.filter(t => t.status === 'completed').length;
  const totalCount = taskList.length;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <section className="px-10 py-8 h-full flex flex-col">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-on-surface-variant text-sm font-medium mb-1">{formatDate(new Date().toISOString())}</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-primary">Daily Actions</h1>
          </div>
          {/* Filter Tabs */}
          <div className="flex bg-surface-container-low p-1 rounded-full space-x-1">
            {['Today', 'Upcoming', 'Missed'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full text-sm transition-all ${
                  activeTab === tab 
                    ? 'font-semibold bg-white shadow-sm text-primary' 
                    : 'font-medium text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8 flex-1 overflow-hidden">
          {/* Main Task Column */}
          <div className="col-span-8 space-y-6 overflow-y-auto custom-scrollbar pr-4 pb-20">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <span className="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span>
              </div>
            ) : taskList.length === 0 ? (
              <div className="rounded-2xl bg-surface-container-lowest p-12 text-center">
                <span className="material-symbols-outlined mb-4 text-5xl text-on-surface-variant/40">task_alt</span>
                <p className="text-lg font-semibold text-on-surface-variant">No {activeTab.toLowerCase()} tasks found.</p>
                <p className="text-sm text-on-surface-variant/70 mt-2">Tasks will appear here once created from insights or uploaded records.</p>
              </div>
            ) : (
              <>
                {/* Active / Pending Tasks */}
                {taskList.filter(t => t.status !== 'completed').length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <span className="text-xs font-bold text-primary-container bg-primary-fixed px-3 py-1 rounded-full uppercase tracking-widest">Pending Tasks</span>
                      <div className="flex-1 h-px bg-surface-container-highest"></div>
                    </div>
                    {taskList.filter(t => t.status !== 'completed').map(task => (
                      <div key={task.id} className={`bg-surface-container-lowest p-5 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.01] flex items-start gap-4 ${task.priority === 'critical' ? 'border-l-4 border-error' : ''}`}>
                        <div className="mt-1">
                          <input
                            onChange={() => handleTaskToggle(task)}
                            checked={task.status === 'completed'}
                            className={`w-5 h-5 rounded-md border-outline-variant focus:ring-primary/20 ${task.priority === 'critical' ? 'text-error focus:ring-error/20' : 'text-primary'}`}
                            type="checkbox"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-on-surface">{task.title}</h3>
                            {task.priority === 'critical' ? (
                              <span className="flex items-center text-xs font-semibold text-on-error-container bg-error-container px-2 py-1 rounded-md">
                                <span className="material-symbols-outlined text-sm mr-1">priority_high</span>
                                CRITICAL
                              </span>
                            ) : task.status === 'missed' ? (
                              <span className="flex items-center text-xs font-semibold text-on-error-container bg-error-container px-2 py-1 rounded-md">
                                <span className="material-symbols-outlined text-sm mr-1">priority_high</span>
                                OVERDUE
                              </span>
                            ) : (
                              <span className="flex items-center text-xs font-semibold text-secondary bg-secondary-container px-2 py-1 rounded-md">
                                <span className="material-symbols-outlined text-sm mr-1">schedule</span>
                                {formatTime(task.due_datetime)}
                              </span>
                            )}
                          </div>
                          {task.description && (
                            <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">{task.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Completed Tasks */}
                {taskList.filter(t => t.status === 'completed').length > 0 && (
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center space-x-4">
                      <span className="text-xs font-bold text-on-secondary-fixed-variant bg-secondary-fixed px-3 py-1 rounded-full uppercase tracking-widest">Completed</span>
                      <div className="flex-1 h-px bg-surface-container-highest"></div>
                    </div>
                    {taskList.filter(t => t.status === 'completed').map(task => (
                      <div key={task.id} className="bg-surface-container-lowest p-5 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.01] flex items-start gap-4 opacity-70">
                        <div className="mt-1">
                          <input
                            onChange={() => handleTaskToggle(task)}
                            checked
                            className="w-5 h-5 rounded-md border-outline-variant text-tertiary focus:ring-tertiary/20"
                            type="checkbox"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-on-surface line-through">{task.title}</h3>
                            <span className="flex items-center text-xs font-semibold text-tertiary bg-tertiary-fixed px-2 py-1 rounded-md">
                              <span className="material-symbols-outlined text-sm mr-1">check_circle</span>
                              COMPLETED
                            </span>
                          </div>
                          {task.description && (
                            <p className="text-on-surface-variant text-sm leading-relaxed">{task.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar Analytics */}
          <div className="col-span-4 space-y-8 overflow-y-auto">
            {/* Health Streak Visualization */}
            <div className="bg-primary p-6 rounded-[2rem] text-white overflow-hidden relative">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-bold">Task Progress</h3>
                    <p className="text-on-primary-container text-xs">
                      {completedCount}/{totalCount} completed
                    </p>
                  </div>
                  <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                    <span className="material-symbols-outlined">bolt</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 mb-8">
                  {['M','T','W','T','F'].map((day, i) => {
                    const pct = totalCount > 0 ? Math.min(((completedCount + i * 10) / (totalCount + 20)) * 100, 95) : 10;
                    return (
                      <div key={day + i} className="flex flex-col items-center gap-2">
                        <div className="w-8 h-20 bg-white/10 rounded-full flex items-end overflow-hidden">
                          <div className="w-full bg-secondary-fixed rounded-full" style={{ height: `${pct}%` }}></div>
                        </div>
                        <span className="text-[10px] font-bold opacity-70">{day}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-3xl font-extrabold tracking-tight">{completedCount}</p>
                      <p className="text-[10px] font-medium uppercase tracking-widest text-on-primary-container">Completed</p>
                    </div>
                    <button onClick={loadTasks} className="bg-white text-primary px-4 py-2 rounded-full text-xs font-bold shadow-lg">Refresh</button>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary-container/30 rounded-full blur-3xl"></div>
            </div>

            {/* Priority Summary */}
            <div className="bg-surface-container-low p-6 rounded-[2rem] border border-white">
              <h3 className="font-bold text-on-surface mb-4">Priority Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-2 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-error-container flex items-center justify-center text-error">
                    <span className="material-symbols-outlined text-lg">error</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{taskList.filter(t => t.priority === 'critical' && t.status !== 'completed').length} Critical Tasks</p>
                    <p className="text-[10px] text-on-surface-variant">Requires immediate attention</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-2 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-lg">schedule_send</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{taskList.filter(t => t.status === 'pending').length} Pending</p>
                    <p className="text-[10px] text-on-surface-variant">Awaiting completion</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-2 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary">
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{completedCount} Completed</p>
                    <p className="text-[10px] text-on-surface-variant">Great progress!</p>
                  </div>
                </div>
              </div>
              {stats && (
                <div className="mt-8 p-4 bg-primary-fixed/30 rounded-2xl border border-primary-fixed/50">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-primary text-sm">info</span>
                    <p className="text-xs font-bold text-on-primary-fixed-variant">System Intelligence</p>
                  </div>
                  <p className="text-[10px] text-on-primary-fixed-variant/80 leading-relaxed">
                    You have {stats.pending_tasks} pending tasks and {stats.recent_insights} AI insights generated. {stats.missed_tasks > 0 ? `⚠️ ${stats.missed_tasks} tasks are overdue.` : 'All tasks on track!'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
