import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Dashboard() {
  const handleFeatureClick = (featureName) => {
    toast.success(`Navigating to ${featureName} module!`);
  };

  return (
    <div className="mx-auto max-w-[1600px] p-10 h-full flex flex-col">
      {/* Page Header */}
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-on-surface">System Overview</h1>
          <p className="text-lg text-on-surface-variant">
            Welcome back to the <span className="font-bold text-primary">Clinical Precision Platform</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Feature 1 */}
        <Link 
          to="/insights"
          onClick={() => handleFeatureClick('AI Insights')}
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
          onClick={() => handleFeatureClick('Daily Actions')}
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
          onClick={() => handleFeatureClick('Upload Records')}
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
