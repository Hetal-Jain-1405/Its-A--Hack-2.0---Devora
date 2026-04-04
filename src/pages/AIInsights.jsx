import { useState, useEffect } from 'react';
import toast from "react-hot-toast";
import { useAuth } from '../context/AuthContext';
import { patients, actions as actionsApi } from '../services/api';

export default function AIInsights() {
  const { user } = useAuth();
  const patientId = user?.id;

  const [insights, setInsights] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!patientId) return;
    loadData();
  }, [patientId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [insightsData, conditionsData] = await Promise.allSettled([
        patients.getInsights(patientId),
        patients.getConditions(patientId),
      ]);
      if (insightsData.status === 'fulfilled') setInsights(insightsData.value);
      if (conditionsData.status === 'fulfilled') setConditions(conditionsData.value);
    } catch (err) {
      toast.error('Failed to load insights: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleReanalyze = async () => {
    if (!patientId) return;
    setAnalyzing(true);
    try {
      const result = await patients.analyze(patientId);
      toast.success(result.message || 'Analysis completed!');
      // Reload data after analysis
      await loadData();
    } catch (err) {
      toast.error('Analysis failed: ' + (err.message || 'Unknown error'));
    } finally {
      setAnalyzing(false);
    }
  };

  const handleExport = async () => {
    if (!patientId) return;
    setExporting(true);
    try {
      const result = await patients.exportReport(patientId);
      toast.success('Report exported! Download ready.');
    } catch (err) {
      toast.error('Export failed: ' + (err.message || 'Unknown error'));
    } finally {
      setExporting(false);
    }
  };

  const handlePrescribe = async () => {
    if (!patientId) return;
    try {
      await actionsApi.prescribe({
        patient_id: patientId,
        medication: 'Iron Supplement',
        dosage: '65mg',
        frequency: 'Once daily',
        duration: '30 days',
        notes: 'Elemental iron, review after 7 days',
      });
      toast.success('Prescription sent to pharmacy.');
    } catch (err) {
      toast.error('Prescription failed: ' + (err.message || 'Unknown error'));
    }
  };

  const handleSchedule = async () => {
    if (!patientId) return;
    try {
      await actionsApi.schedule({
        patient_id: patientId,
        visit_type: 'Follow-up',
        preferred_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        reason: 'Follow-up lab work - CBC and Iron Panel',
      });
      toast.success('Visit scheduled successfully.');
    } catch (err) {
      toast.error('Scheduling failed: ' + (err.message || 'Unknown error'));
    }
  };

  const handleGenerateGuide = async () => {
    if (!patientId) return;
    try {
      const result = await patients.generateGuide(patientId);
      toast.success(result.message || 'Patient guide generated!');
    } catch (err) {
      toast.error('Guide generation failed: ' + (err.message || 'Unknown error'));
    }
  };

  // Pick the latest insight
  const latestInsight = insights.length > 0 ? insights[insights.length - 1] : null;
  const criticalConditions = conditions.filter(c => c.severity === 'critical');
  const chronicConditions = conditions.filter(c => c.severity === 'chronic');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] p-10">
      {/* Page Header */}
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-on-surface">AI Insights & Analytics</h1>
          <p className="text-lg text-on-surface-variant">
            Comprehensive health synthesis for <span className="font-bold text-primary">{user?.full_name || 'Patient'}</span>
          </p>
        </div>
        <div className="flex space-x-3">
          <button onClick={handleExport} disabled={exporting} className="flex items-center space-x-2 rounded-full bg-primary-fixed px-6 py-2.5 text-sm font-semibold text-on-primary-fixed-variant transition-all hover:opacity-90 disabled:opacity-50">
            <span className="material-symbols-outlined text-lg">{exporting ? 'progress_activity' : 'ios_share'}</span>
            <span>{exporting ? 'Exporting...' : 'Export Report'}</span>
          </button>
          <button onClick={handleReanalyze} disabled={analyzing} className="flex items-center space-x-2 rounded-full bg-gradient-to-r from-primary to-primary-container px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/10 transition-all hover:scale-[1.02] disabled:opacity-50">
            <span className={`material-symbols-outlined text-lg ${analyzing ? 'animate-spin' : ''}`}>{analyzing ? 'progress_activity' : 'refresh'}</span>
            <span>{analyzing ? 'Analyzing...' : 'Re-analyze'}</span>
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
              {latestInsight
                ? latestInsight.executive_summary
                : 'No AI insights generated yet. Click "Re-analyze" to generate your first insight.'}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-surface-container-low p-4">
                <span className="text-xs font-bold tracking-wider text-on-surface-variant uppercase">Conditions Found</span>
                <p className="mt-1 text-sm font-semibold">{conditions.length} detected</p>
              </div>
              <div className="rounded-2xl bg-surface-container-low p-4">
                <span className="text-xs font-bold tracking-wider text-on-surface-variant uppercase">Confidence Score</span>
                <p className="mt-1 text-sm font-semibold text-secondary">
                  {latestInsight ? `${(latestInsight.confidence_score * 100).toFixed(1)}%` : 'N/A'}
                </p>
              </div>
            </div>
          </section>

          {/* Conditions / Risk Profile */}
          <section className="space-y-6">
            <h2 className="px-2 text-xl font-bold">Risk Profile</h2>
            <div className="grid grid-cols-2 gap-6">
              {/* Critical Count Card */}
              <div className="flex h-48 flex-col justify-between rounded-[2rem] bg-error-container p-6">
                <span className="material-symbols-outlined text-3xl text-on-error-container">warning</span>
                <div>
                  <p className="text-3xl font-extrabold text-on-error-container">{criticalConditions.length}</p>
                  <p className="text-sm font-medium opacity-80 text-on-error-container">Critical Conditions</p>
                </div>
              </div>
              {/* Chronic Count Card */}
              <div className="flex h-48 flex-col justify-between rounded-[2rem] bg-secondary-container p-6">
                <span className="material-symbols-outlined text-3xl text-on-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>trending_down</span>
                <div>
                  <p className="text-3xl font-extrabold text-on-secondary-container">{chronicConditions.length}</p>
                  <p className="text-sm font-medium opacity-80 text-on-secondary-container">Chronic Conditions</p>
                </div>
              </div>
              {/* Insights Count (Wide) */}
              <div className="col-span-2 flex items-center justify-between rounded-[2rem] border border-outline-variant/10 bg-surface-container-lowest p-8">
                <div>
                  <h3 className="mb-4 text-sm font-bold tracking-widest text-on-surface-variant uppercase">AI Analysis History</h3>
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-32 overflow-hidden rounded-full bg-surface-container-high">
                      <div className="h-full bg-tertiary" style={{ width: `${Math.min(insights.length * 20, 100)}%` }}></div>
                    </div>
                    <span className="text-lg font-bold">{insights.length > 0 ? 'Active' : 'Pending'}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-primary">{insights.length}</span>
                  <span className="ml-1 text-sm text-on-surface-variant">insights</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Conditions List & Actions */}
        <div className="col-span-12 space-y-10 lg:col-span-7">
          {/* Conditions Grid */}
          <section>
            <div className="mb-6 flex items-center justify-between px-2">
              <h2 className="text-xl font-bold">Detected Conditions</h2>
              <span className="rounded-full bg-error-container px-3 py-1 text-xs font-bold text-on-error-container">{criticalConditions.length} Critical</span>
            </div>
            <div className="space-y-4">
              {conditions.length === 0 && (
                <div className="rounded-[1.5rem] bg-surface-container-lowest p-10 text-center shadow-sm">
                  <span className="material-symbols-outlined mb-3 text-4xl text-on-surface-variant/40">health_and_safety</span>
                  <p className="text-on-surface-variant">No conditions detected yet. Upload medical records to enable AI analysis.</p>
                </div>
              )}
              {conditions.map((cond) => (
                <div key={cond.id} className={`group flex items-center rounded-[1.5rem] border border-transparent bg-surface-container-lowest p-6 shadow-sm transition-all hover:bg-white ${cond.severity === 'critical' ? 'hover:border-error/20' : 'hover:border-primary/20'}`}>
                  <div className={`mr-6 h-12 w-2 rounded-full ${cond.severity === 'critical' ? 'bg-error' : 'bg-primary-container'}`}></div>
                  <div className="flex-1">
                    <h4 className={`mb-1 text-xs font-bold tracking-widest uppercase ${cond.severity === 'critical' ? 'text-error' : 'text-primary'}`}>
                      {cond.severity === 'critical' ? 'Critical' : 'Chronic'}
                    </h4>
                    <p className="text-lg font-bold">{cond.name}</p>
                    {cond.source_document && <p className="text-sm text-on-surface-variant">Source: {cond.source_document}</p>}
                  </div>
                  <div className="pl-8">
                    <span className="material-symbols-outlined cursor-pointer text-outline transition-colors group-hover:text-primary">chevron_right</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Suggested Actions (Bento Style) */}
          <section>
            <h2 className="mb-6 px-2 text-xl font-bold">AI-Driven Suggested Actions</h2>
            <div className="grid grid-cols-2 gap-6">
              {/* Action 1: Prescribe */}
              <div onClick={handlePrescribe} className="group flex cursor-pointer flex-col items-start rounded-[2rem] bg-surface-container-high/50 p-6 transition-colors hover:bg-primary-fixed">
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
              {/* Action 2: Schedule */}
              <div onClick={handleSchedule} className="group flex cursor-pointer flex-col items-start rounded-[2rem] bg-surface-container-high/50 p-6 transition-colors hover:bg-secondary-container">
                <div className="mb-6 rounded-2xl bg-white p-3 shadow-sm">
                  <span className="material-symbols-outlined text-secondary">event_repeat</span>
                </div>
                <h3 className="mb-2 text-lg font-bold">Follow-up Lab Work</h3>
                <p className="mb-6 text-sm text-on-surface-variant">Schedule repeat CBC and Iron Panel in 7 days.</p>
                <button className="mt-auto flex items-center space-x-1 text-sm font-bold text-secondary group-hover:underline">
                  <span>Schedule Visit</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
              {/* Action 3: Generate Guide (Wide) */}
              <div className="relative col-span-2 flex items-center justify-between overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary to-primary-container p-8 text-white">
                <div className="z-10 max-w-md">
                  <h3 className="mb-2 text-2xl font-bold">Nutrition Plan Generation</h3>
                  <p className="mb-6 text-on-primary-container">Create a bio-available iron-rich nutrition guide tailored to patient dietary restrictions.</p>
                  <button onClick={handleGenerateGuide} className="rounded-full bg-white px-8 py-3 text-sm font-bold text-primary shadow-xl hover:bg-gray-100 transition-colors">Generate Patient Guide</button>
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
