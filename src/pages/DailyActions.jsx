import { useState } from 'react';
import toast from 'react-hot-toast';

export default function DailyActions() {
  const [activeTab, setActiveTab] = useState('Today');
  
  const handleTaskToggle = (e, taskName) => {
    if (e.target.checked) {
      toast.success(`Completed: ${taskName}`);
    } else {
      toast(`Unmarked: ${taskName}`, { icon: '🔄' });
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <section className="px-10 py-8 h-full flex flex-col">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-on-surface-variant text-sm font-medium mb-1">Thursday, October 24</p>
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
            {/* Time Slot Group */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-xs font-bold text-primary-container bg-primary-fixed px-3 py-1 rounded-full uppercase tracking-widest">Morning Focus</span>
                <div className="flex-1 h-px bg-surface-container-highest"></div>
              </div>
              {/* Task Card 1 */}
              <div className="bg-surface-container-lowest p-5 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.01] flex items-start gap-4">
                <div className="mt-1">
                  <input onChange={(e) => handleTaskToggle(e, 'Patient Round: Ward 4C')} className="w-5 h-5 rounded-md border-outline-variant text-primary focus:ring-primary/20" type="checkbox" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-on-surface">Patient Round: Ward 4C</h3>
                    <span className="flex items-center text-xs font-semibold text-secondary bg-secondary-container px-2 py-1 rounded-md">
                      <span className="material-symbols-outlined text-sm mr-1">schedule</span>
                      09:00 AM
                    </span>
                  </div>
                  <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">Review post-op recovery metrics for Mr. Henderson and update medication charts.</p>
                  <div className="flex items-center gap-3">
                    <a className="flex items-center text-xs font-medium text-primary hover:underline" href="#">
                      <span className="material-symbols-outlined text-sm mr-1">description</span>
                      Patient_Chart_v4.pdf
                    </a>
                    <span className="text-outline-variant text-xs">•</span>
                    <a className="flex items-center text-xs font-medium text-primary hover:underline" href="#">
                      <span className="material-symbols-outlined text-sm mr-1">link</span>
                      Vital Signs Lab
                    </a>
                  </div>
                </div>
              </div>
              {/* Task Card 2 */}
              <div className="bg-surface-container-lowest p-5 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.01] flex items-start gap-4 border-l-4 border-error">
                <div className="mt-1">
                  <input onChange={(e) => handleTaskToggle(e, 'Emergency Lab Review')} className="w-5 h-5 rounded-md border-outline-variant text-error focus:ring-error/20" type="checkbox" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-on-surface">Emergency Lab Review</h3>
                    <span className="flex items-center text-xs font-semibold text-on-error-container bg-error-container px-2 py-1 rounded-md">
                      <span className="material-symbols-outlined text-sm mr-1">priority_high</span>
                      OVERDUE
                    </span>
                  </div>
                  <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">Urgent pathology results for Room 202 - Cardiac Unit. Needs immediate sign-off.</p>
                  <div className="flex items-center gap-3">
                    <a className="flex items-center text-xs font-medium text-primary hover:underline" href="#">
                      <span className="material-symbols-outlined text-sm mr-1">lab_research</span>
                      Path_Report_Urgent.doc
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Afternoon Slot Group */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center space-x-4">
                <span className="text-xs font-bold text-on-secondary-fixed-variant bg-secondary-fixed px-3 py-1 rounded-full uppercase tracking-widest">Midday Review</span>
                <div className="flex-1 h-px bg-surface-container-highest"></div>
              </div>
              {/* Task Card 3 */}
              <div className="bg-surface-container-lowest p-5 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.01] flex items-start gap-4 opacity-70">
                <div className="mt-1">
                  <input onChange={(e) => handleTaskToggle(e, 'Consultation: Mrs. Gable')} defaultChecked className="w-5 h-5 rounded-md border-outline-variant text-tertiary focus:ring-tertiary/20" type="checkbox" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-on-surface line-through">Consultation: Mrs. Gable</h3>
                    <span className="flex items-center text-xs font-semibold text-tertiary bg-tertiary-fixed px-2 py-1 rounded-md">
                      <span className="material-symbols-outlined text-sm mr-1">check_circle</span>
                      COMPLETED
                    </span>
                  </div>
                  <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">Follow-up on diabetic neuropathy progression. Patient shows positive response to new regimen.</p>
                </div>
              </div>
              {/* Task Card 4 */}
              <div className="bg-surface-container-lowest p-5 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.01] flex items-start gap-4">
                <div className="mt-1">
                  <input onChange={(e) => handleTaskToggle(e, 'Department Briefing')} className="w-5 h-5 rounded-md border-outline-variant text-primary focus:ring-primary/20" type="checkbox" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-on-surface">Department Briefing</h3>
                    <span className="flex items-center text-xs font-semibold text-on-surface-variant bg-surface-container px-2 py-1 rounded-md">
                      <span className="material-symbols-outlined text-sm mr-1">schedule</span>
                      02:00 PM
                    </span>
                  </div>
                  <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">Bi-weekly alignment on diagnostic caseloads and new protocol implementation.</p>
                  <div className="flex items-center gap-3">
                    <a className="flex items-center text-xs font-medium text-primary hover:underline" href="#">
                      <span className="material-symbols-outlined text-sm mr-1">calendar_today</span>
                      Meeting_Invite.ics
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Analytics */}
          <div className="col-span-4 space-y-8 overflow-y-auto">
            {/* Health Streak Visualization */}
            <div className="bg-primary p-6 rounded-[2rem] text-white overflow-hidden relative">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-bold">Health Streak</h3>
                    <p className="text-on-primary-container text-xs">High performance week</p>
                  </div>
                  <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                    <span className="material-symbols-outlined">bolt</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 mb-8">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-20 bg-white/10 rounded-full flex items-end overflow-hidden">
                      <div className="w-full bg-secondary-fixed h-[80%] rounded-full"></div>
                    </div>
                    <span className="text-[10px] font-bold opacity-70">M</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-20 bg-white/10 rounded-full flex items-end overflow-hidden">
                      <div className="w-full bg-secondary-fixed h-[60%] rounded-full"></div>
                    </div>
                    <span className="text-[10px] font-bold opacity-70">T</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-20 bg-white/10 rounded-full flex items-end overflow-hidden">
                      <div className="w-full bg-secondary-fixed h-[95%] rounded-full"></div>
                    </div>
                    <span className="text-[10px] font-bold opacity-70">W</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-20 bg-white/20 rounded-full flex items-end overflow-hidden border-2 border-white/30">
                      <div className="w-full bg-white h-[45%] rounded-full"></div>
                    </div>
                    <span className="text-[10px] font-bold">T</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 opacity-40">
                    <div className="w-8 h-20 bg-white/10 rounded-full flex items-end overflow-hidden">
                      <div className="w-full bg-white h-0 rounded-full"></div>
                    </div>
                    <span className="text-[10px] font-bold">F</span>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-3xl font-extrabold tracking-tight">12</p>
                      <p className="text-[10px] font-medium uppercase tracking-widest text-on-primary-container">Day Streak</p>
                    </div>
                    <button onClick={() => toast.success('Loading statistical data...')} className="bg-white text-primary px-4 py-2 rounded-full text-xs font-bold shadow-lg">View Stats</button>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary-container/30 rounded-full blur-3xl"></div>
            </div>

            {/* Upcoming Alerts / Calendar Card */}
            <div className="bg-surface-container-low p-6 rounded-[2rem] border border-white">
              <h3 className="font-bold text-on-surface mb-4">Priority Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 cursor-pointer hover:bg-surface-container p-2 rounded-xl transition-all" onClick={() => toast.error('Navigating to Critical Actions.')}>
                  <div className="w-10 h-10 rounded-xl bg-error-container flex items-center justify-center text-error">
                    <span className="material-symbols-outlined text-lg">error</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">3 Critical Actions</p>
                    <p className="text-[10px] text-on-surface-variant">Requires attention before EOD</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-300">chevron_right</span>
                </div>
                <div className="flex items-center gap-4 cursor-pointer hover:bg-surface-container p-2 rounded-xl transition-all" onClick={() => toast('Pending sign-offs view opening soon.', { icon: '⏳' })}>
                  <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-lg">schedule_send</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">5 Pending Sign-offs</p>
                    <p className="text-[10px] text-on-surface-variant">Awaiting clinical approval</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-300">chevron_right</span>
                </div>
                <div className="flex items-center gap-4 cursor-pointer hover:bg-surface-container p-2 rounded-xl transition-all" onClick={() => toast.success('Taking a break is good!')}>
                  <div className="w-10 h-10 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary">
                    <span className="material-symbols-outlined text-lg">auto_awesome</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">Personal Wellness</p>
                    <p className="text-[10px] text-on-surface-variant">Recommended 15min break</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-300">chevron_right</span>
                </div>
              </div>
              <div className="mt-8 p-4 bg-primary-fixed/30 rounded-2xl border border-primary-fixed/50">
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-primary text-sm">info</span>
                  <p className="text-xs font-bold text-on-primary-fixed-variant">System Intelligence</p>
                </div>
                <p className="text-[10px] text-on-primary-fixed-variant/80 leading-relaxed">Based on your current pace, you'll complete all tasks 20 minutes earlier than yesterday. Keep it up!</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
