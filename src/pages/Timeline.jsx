import React from 'react';

export default function Timeline() {
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
            <span className="rounded-full bg-secondary-container px-4 py-2 text-xs font-bold text-on-secondary-container">Active Protocol</span>
          </div>
        </div>
        <p className="max-w-xl text-lg leading-relaxed text-on-surface-variant">
          Track your clinical progression and upcoming milestones in real-time.
        </p>
      </section>

      {/* Timeline Container */}
      <div className="relative space-y-12">
        {/* Vertical Line Logic (Visual Only) */}
        <div className="absolute bottom-4 left-6 top-4 hidden w-px bg-outline-variant/30 md:block"></div>

        {/* Card 1: Diagnosis (Completed) */}
        <article className="relative flex flex-col gap-8 md:flex-row">
          {/* Timeline Marker */}
          <div className="z-10 hidden flex-col items-center md:flex">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-tertiary-container shadow-sm">
              <span className="material-symbols-outlined text-on-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
          </div>

          {/* Content Card */}
          <div className="flex-1 rounded-xl bg-surface-container-lowest p-8 shadow-[0_8px_24px_rgba(25,28,29,0.04)] duration-300 hover:scale-[1.01] transition-transform">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="mb-1 text-2xl font-bold text-primary">Diagnosis</h2>
                <span className="inline-flex items-center rounded-full bg-tertiary-fixed px-3 py-1 text-xs font-bold tracking-wider text-on-tertiary-fixed uppercase">Completed</span>
              </div>
              <span className="text-sm text-on-surface-variant">Oct 12 — Oct 28</span>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Documents */}
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-widest text-on-surface-variant uppercase">
                  <span className="material-symbols-outlined text-sm">description</span> Documents
                </h3>
                <ul className="space-y-3">
                  <li className="group flex items-center justify-between rounded-lg bg-surface-container-low p-3 transition-colors hover:bg-surface-container-high cursor-pointer">
                    <span className="font-medium text-on-surface">Symptom Log</span>
                    <span className="material-symbols-outlined cursor-pointer text-xl text-primary group-hover:scale-110 transition-transform">download</span>
                  </li>
                  <li className="group flex items-center justify-between rounded-lg bg-surface-container-low p-3 transition-colors hover:bg-surface-container-high cursor-pointer">
                    <span className="font-medium text-on-surface">Initial Consultation</span>
                    <span className="material-symbols-outlined cursor-pointer text-xl text-primary group-hover:scale-110 transition-transform">download</span>
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-widest text-on-surface-variant uppercase">
                  <span className="material-symbols-outlined text-sm">task_alt</span> Actions
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 p-1">
                    <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>check_box</span>
                    <span className="text-on-surface-variant line-through">Blood Test</span>
                  </li>
                  <li className="flex items-center gap-3 p-1">
                    <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>check_box</span>
                    <span className="text-on-surface-variant line-through">MRI</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </article>

        {/* Card 2: Treatment (Pending) */}
        <article className="relative flex flex-col gap-8 md:flex-row">
          {/* Timeline Marker */}
          <div className="z-10 hidden flex-col items-center md:flex">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-container shadow-sm">
              <span className="material-symbols-outlined text-on-primary-container" style={{ fontVariationSettings: "'FILL' 0" }}>pending</span>
            </div>
          </div>

          {/* Content Card */}
          <div className="flex-1 rounded-xl border-l-4 border-primary bg-surface-container-lowest p-8 shadow-[0_8px_24px_rgba(25,28,29,0.04)] hover:shadow-md transition-shadow">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="mb-1 text-2xl font-bold text-primary">Treatment</h2>
                <span className="inline-flex items-center rounded-full bg-primary-fixed px-3 py-1 text-xs font-bold tracking-wider text-on-primary-fixed uppercase">Pending</span>
              </div>
              <span className="text-sm font-bold text-primary">In Progress</span>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Documents */}
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-widest text-on-surface-variant uppercase">
                  <span className="material-symbols-outlined text-sm">description</span> Documents
                </h3>
                <ul className="space-y-3">
                  <li className="group flex items-center justify-between rounded-lg bg-surface-container-low p-3 transition-colors hover:bg-surface-container-high cursor-pointer">
                    <span className="font-medium text-on-surface">Prescription Plan</span>
                    <span className="material-symbols-outlined cursor-pointer text-xl text-primary group-hover:scale-110 transition-transform">visibility</span>
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-sm font-bold tracking-widest text-on-surface-variant uppercase">
                    <span className="material-symbols-outlined text-sm">assignment_turned_in</span> Actions
                  </h3>
                  <span className="rounded-md bg-primary-fixed px-2 py-0.5 text-[10px] font-bold text-primary">1/2</span>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 p-1">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_box</span>
                    <span className="font-medium text-on-surface">Medication adherence</span>
                  </li>
                  <li className="flex items-center gap-3 p-1">
                    <span className="material-symbols-outlined text-outline" style={{ fontVariationSettings: "'FILL' 0" }}>check_box_outline_blank</span>
                    <span className="font-medium text-on-surface">Follow-up visit</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <button className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-container px-8 py-3 text-sm font-bold text-on-primary shadow-md transition-all hover:opacity-90">
                    Update Progress <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Decorative Summary Card (Editorial Authority) */}
        <article className="rounded-xl border border-secondary-container/30 bg-secondary-container/20 p-6 md:ml-20">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>medical_information</span>
            </div>
            <div>
              <h4 className="font-bold text-secondary">Clinical Summary</h4>
              <p className="text-sm text-on-surface-variant">Your journey is 45% complete. Next review scheduled for November 15th.</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
