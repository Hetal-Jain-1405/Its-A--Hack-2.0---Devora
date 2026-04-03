import toast from "react-hot-toast";

export default function AIInsights() {
  return (
    <div className="mx-auto max-w-[1600px] p-10">
      {/* Page Header */}
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-on-surface">AI Insights & Analytics</h1>
          <p className="text-lg text-on-surface-variant">
            Comprehensive health synthesis for <span className="font-bold text-primary">Patient #4829-X</span>
          </p>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => toast.success('Report exported successfully!')} className="flex items-center space-x-2 rounded-full bg-primary-fixed px-6 py-2.5 text-sm font-semibold text-on-primary-fixed-variant transition-all hover:opacity-90">
            <span className="material-symbols-outlined text-lg">ios_share</span>
            <span>Export Report</span>
          </button>
          <button onClick={() => toast.loading('Re-analyzing patient data...', {duration: 2000})} className="flex items-center space-x-2 rounded-full bg-gradient-to-r from-primary to-primary-container px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/10 transition-all hover:scale-[1.02]">
            <span className="material-symbols-outlined text-lg">refresh</span>
            <span>Re-analyze</span>
          </button>
        </div>
      </div>

      {/* Split Screen Layout */}
      <div className="grid grid-cols-12 gap-10">
        {/* Left Column: Report Summary & Risk Indicators */}
        <div className="col-span-12 space-y-10 lg:col-span-5">
          {/* AI Executive Summary Card */}
          <section className="rounded-[2rem] border-l-4 border-primary bg-surface-container-lowest p-8 shadow-sm">
            <div className="mb-6 flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined">auto_awesome</span>
              </div>
              <h2 className="text-xl font-bold">Executive Summary</h2>
            </div>
            <p className="mb-6 leading-relaxed text-on-surface-variant">
              Current analysis indicates a steady recovery trajectory. Most vital parameters have stabilized over the last 48 hours. Primary focus remains on <span className="font-semibold text-on-surface">Iron Metabolism</span> and <span className="font-semibold text-on-surface">Erythrocyte Stability</span>. Neurological markers show no signs of concern.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-surface-container-low p-4">
                <span className="text-xs font-bold tracking-wider text-on-surface-variant uppercase">Primary Finding</span>
                <p className="mt-1 text-sm font-semibold">Normocytic Anemia</p>
              </div>
              <div className="rounded-2xl bg-surface-container-low p-4">
                <span className="text-xs font-bold tracking-wider text-on-surface-variant uppercase">Confidence Score</span>
                <p className="mt-1 text-sm font-semibold text-secondary">98.4% Match</p>
              </div>
            </div>
          </section>

          {/* Risk Indicators */}
          <section className="space-y-6">
            <h2 className="px-2 text-xl font-bold">Risk Risk Profile</h2>
            <div className="grid grid-cols-2 gap-6">
              {/* Card 1 */}
              <div className="flex h-48 flex-col justify-between rounded-[2rem] bg-error-container p-6">
                <span className="material-symbols-outlined text-3xl text-on-error-container">warning</span>
                <div>
                  <p className="text-3xl font-extrabold text-on-error-container">Critical</p>
                  <p className="text-sm font-medium opacity-80 text-on-error-container">Acute Inflammation Risk</p>
                </div>
              </div>
              {/* Card 2 */}
              <div className="flex h-48 flex-col justify-between rounded-[2rem] bg-secondary-container p-6">
                <span className="material-symbols-outlined text-3xl text-on-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>trending_down</span>
                <div>
                  <p className="text-3xl font-extrabold text-on-secondary-container">Decreasing</p>
                  <p className="text-sm font-medium opacity-80 text-on-secondary-container">Post-Op Complication Risk</p>
                </div>
              </div>
              {/* Card 3 (Wide) */}
              <div className="col-span-2 flex items-center justify-between rounded-[2rem] border border-outline-variant/10 bg-surface-container-lowest p-8">
                <div>
                  <h3 className="mb-4 text-sm font-bold tracking-widest text-on-surface-variant uppercase">Metabolic Stability</h3>
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-32 overflow-hidden rounded-full bg-surface-container-high">
                      <div className="h-full w-3/4 bg-tertiary"></div>
                    </div>
                    <span className="text-lg font-bold">Stable</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-primary">82</span>
                  <span className="ml-1 text-sm text-on-surface-variant">/100</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Abnormal Values & Actions */}
        <div className="col-span-12 space-y-10 lg:col-span-7">
          {/* Abnormal Values Grid */}
          <section>
            <div className="mb-6 flex items-center justify-between px-2">
              <h2 className="text-xl font-bold">Prioritized Abnormalities</h2>
              <span className="rounded-full bg-error-container px-3 py-1 text-xs font-bold text-on-error-container">3 Urgent Alerts</span>
            </div>
            <div className="space-y-4">
              {/* High Priority Row */}
              <div className="group flex items-center rounded-[1.5rem] border border-transparent bg-surface-container-lowest p-6 shadow-sm transition-all hover:border-error/20 hover:bg-white">
                <div className="mr-6 h-12 w-2 rounded-full bg-error"></div>
                <div className="flex-1">
                  <h4 className="mb-1 text-xs font-bold tracking-widest text-error uppercase">Critical Deviation</h4>
                  <p className="text-lg font-bold">Serum Ferritin</p>
                  <p className="text-sm text-on-surface-variant">Potential iron deficiency anemia indicator</p>
                </div>
                <div className="border-x border-outline-variant/20 px-8 text-right">
                  <p className="text-2xl font-black text-on-surface">12 <span className="text-sm font-medium">ng/mL</span></p>
                  <p className="text-xs font-bold text-error">↓ 85% from norm</p>
                </div>
                <div className="pl-8">
                  <span className="material-symbols-outlined cursor-pointer text-outline transition-colors group-hover:text-primary">chevron_right</span>
                </div>
              </div>
              {/* Medium Priority Row */}
              <div className="group flex items-center rounded-[1.5rem] border border-transparent bg-surface-container-lowest p-6 shadow-sm transition-all hover:border-primary/20 hover:bg-white">
                <div className="mr-6 h-12 w-2 rounded-full bg-primary-container"></div>
                <div className="flex-1">
                  <h4 className="mb-1 text-xs font-bold tracking-widest text-primary uppercase">Moderate Alert</h4>
                  <p className="text-lg font-bold">C-Reactive Protein (CRP)</p>
                  <p className="text-sm text-on-surface-variant">Elevated marker, suggests residual inflammation</p>
                </div>
                <div className="border-x border-outline-variant/20 px-8 text-right">
                  <p className="text-2xl font-black text-on-surface">8.4 <span className="text-sm font-medium">mg/L</span></p>
                  <p className="text-xs font-bold text-primary">↑ 24% over ref</p>
                </div>
                <div className="pl-8">
                  <span className="material-symbols-outlined cursor-pointer text-outline transition-colors group-hover:text-primary">chevron_right</span>
                </div>
              </div>
              {/* Trending Row */}
              <div className="group flex items-center rounded-[1.5rem] border border-transparent bg-surface-container-lowest p-6 shadow-sm transition-all hover:border-secondary/20 hover:bg-white">
                <div className="mr-6 h-12 w-2 rounded-full bg-secondary"></div>
                <div className="flex-1">
                  <h4 className="mb-1 text-xs font-bold tracking-widest text-secondary uppercase">Watching</h4>
                  <p className="text-lg font-bold">Hemoglobin (Hb)</p>
                  <p className="text-sm text-on-surface-variant">Recovering trend, monitor for next 24 hours</p>
                </div>
                <div className="border-x border-outline-variant/20 px-8 text-right">
                  <p className="text-2xl font-black text-on-surface">11.2 <span className="text-sm font-medium">g/dL</span></p>
                  <p className="text-xs font-bold text-secondary">↑ Trending Up</p>
                </div>
                <div className="pl-8">
                  <span className="material-symbols-outlined cursor-pointer text-outline transition-colors group-hover:text-primary">chevron_right</span>
                </div>
              </div>
            </div>
          </section>

          {/* Suggested Actions (Bento Style) */}
          <section>
            <h2 className="mb-6 px-2 text-xl font-bold">AI-Driven Suggested Actions</h2>
            <div className="grid grid-cols-2 gap-6">
              {/* Action 1 */}
              <div onClick={() => toast.success('Prescription sent to pharmacy.')} className="group flex cursor-pointer flex-col items-start rounded-[2rem] bg-surface-container-high/50 p-6 transition-colors hover:bg-primary-fixed">
                <div className="mb-6 rounded-2xl bg-white p-3 shadow-sm">
                  <span className="material-symbols-outlined text-primary">pill</span>
                </div>
                <h3 className="mb-2 text-lg font-bold">Adjust Iron Supplementation</h3>
                <p className="mb-6 text-sm text-on-surface-variant">Increase dosage to 65mg elemental iron daily. Review after 7 days.</p>
                <button className="mt-auto flex items-center space-x-1 text-sm font-bold text-primary group-hover:underline">
                  <span>Prescribe Now</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
              {/* Action 2 */}
              <div onClick={() => toast.success('Visit scheduled successfully.')} className="group flex cursor-pointer flex-col items-start rounded-[2rem] bg-surface-container-high/50 p-6 transition-colors hover:bg-secondary-container">
                <div className="mb-6 rounded-2xl bg-white p-3 shadow-sm">
                  <span className="material-symbols-outlined text-secondary">event_repeat</span>
                </div>
                <h3 className="mb-2 text-lg font-bold">Follow-up Lab Work</h3>
                <p className="mb-6 text-sm text-on-surface-variant">Schedule repeat CBC and Iron Panel for 10/14/2023.</p>
                <button className="mt-auto flex items-center space-x-1 text-sm font-bold text-secondary group-hover:underline">
                  <span>Schedule Visit</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
              {/* Action 3 (Wide with Image/Graphic) */}
              <div className="relative col-span-2 flex items-center justify-between overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary to-primary-container p-8 text-white">
                <div className="z-10 max-w-md">
                  <h3 className="mb-2 text-2xl font-bold">Nutrition Plan Generation</h3>
                  <p className="mb-6 text-on-primary-container">Create a bio-available iron-rich nutrition guide tailored to patient dietary restrictions.</p>
                  <button onClick={() => toast.success('Nutrition plan generation initiated.')} className="rounded-full bg-white px-8 py-3 text-sm font-bold text-primary shadow-xl hover:bg-gray-100 transition-colors">Generate Patient Guide</button>
                </div>
                <div className="absolute -bottom-10 -right-10 rotate-12 transform opacity-20">
                  <span className="material-symbols-outlined text-[12rem]" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
