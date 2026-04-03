import { useRef } from 'react';
import toast from 'react-hot-toast';

export default function UploadRecords() {
  const fileInputRef = useRef(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      toast.success(`${e.target.files.length} file(s) added to upload queue!`);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] gap-8 overflow-hidden p-8">
      {/* Left Side: Drag & Drop Zone */}
      <section className="flex flex-1 flex-col gap-6 overflow-hidden">
        <div className="flex flex-col">
          <h2 className="mb-1 text-3xl font-extrabold tracking-tight text-primary">Upload Records</h2>
          <p className="text-on-surface-variant">Add new diagnostic reports, lab results, or clinical notes for AI synthesis.</p>
        </div>

        {/* Main Drop Area */}
        <input 
          type="file" 
          multiple 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileChange} 
        />
        <div onClick={handleFileSelect} className="group relative flex flex-1 cursor-pointer flex-col items-center justify-center bg-surface-container-lowest p-12 transition-all hover:bg-white" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='24' ry='24' stroke='%23C2C6D4FF' stroke-width='2' stroke-dasharray='12%2c 12' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e\")",
            borderRadius: "24px"
        }}>
          <div className="flex max-w-md flex-col items-center text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-fixed transition-transform duration-300 group-hover:scale-110">
              <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'wght' 600" }}>cloud_upload</span>
            </div>
            <h3 className="mb-2 text-xl font-bold text-on-surface">Drag & Drop Patient Files</h3>
            <p className="mb-8 text-on-surface-variant">Supported formats: DICOM, PDF, JPEG, and HL7. Files are automatically encrypted before processing.</p>
            <button className="flex items-center space-x-2 rounded-full bg-primary px-8 py-3 font-bold text-white shadow-lg shadow-primary/20 transition-opacity hover:opacity-90">
              <span className="material-symbols-outlined">add_circle</span>
              <span>Select Files</span>
            </button>
          </div>
          {/* Ambient HIPAA Badge */}
          <div className="absolute bottom-6 flex items-center space-x-2 text-[10px] font-bold tracking-widest text-outline-variant uppercase">
            <span className="material-symbols-outlined text-xs">lock</span>
            <span>AES-256 Bit Encryption Active</span>
          </div>
        </div>

        {/* Processing Queue */}
        <div className="rounded-xl bg-surface-container-low p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="material-symbols-outlined text-primary">analytics</span>
              <span className="text-sm font-bold">Processing 3 Records...</span>
            </div>
            <span className="text-xs font-bold text-primary">64% Overall</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-highest">
            <div className="h-full w-[64%] rounded-full bg-gradient-to-r from-primary to-primary-container"></div>
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                <span>Lab_Results_Oct2023.pdf</span>
              </div>
              <span className="flex items-center font-bold text-tertiary">
                <span className="material-symbols-outlined mr-1 text-[14px]">check_circle</span>
                Extracted
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-on-surface">
                <span className="material-symbols-outlined animate-pulse text-sm">image</span>
                <span>MRI_Scan_Lumbar_L4.dcm</span>
              </div>
              <span className="font-bold text-primary">Scanning...</span>
            </div>
          </div>
        </div>
      </section>

      {/* Right Panel: AI Extraction Results */}
      <aside className="border-slate-50 flex w-[400px] flex-col overflow-hidden rounded-3xl border bg-white shadow-2xl shadow-slate-200/50">
        <div className="bg-gradient-to-br from-primary to-primary-container p-6 text-white">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <h3 className="text-lg font-bold">AI Extraction Results</h3>
            </div>
            <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold tracking-widest uppercase backdrop-blur-md">Real-time</span>
          </div>
          <div className="border border-white/10 rounded-xl bg-white/10 p-4">
            <p className="text-xs leading-relaxed text-on-primary-container">AI is currently synthesizing data from uploaded documents to populate patient history.</p>
          </div>
        </div>
        
        <div className="flex-1 space-y-8 overflow-y-auto p-6">
          {/* Disease Information */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-xs font-extrabold tracking-widest text-outline uppercase">Detected Conditions</h4>
              <span className="cursor-pointer text-[10px] text-primary underline">Verify All</span>
            </div>
            <div className="space-y-3">
              <div className="rounded-2xl bg-surface-container-low p-4 transition-all hover:bg-surface-container">
                <div className="mb-1 flex items-start justify-between">
                  <span className="text-sm font-bold text-on-surface">Type 2 Diabetes Mellitus</span>
                  <span className="rounded-md bg-error-container px-2 py-0.5 text-[10px] font-bold text-on-error-container">Critical</span>
                </div>
                <p className="text-xs text-on-surface-variant">Mentioned in: Lab_Results_Oct2023 (HbA1c: 8.2%)</p>
              </div>
              <div className="rounded-2xl bg-surface-container-low p-4 transition-all hover:bg-surface-container">
                <div className="mb-1 flex items-start justify-between">
                  <span className="text-sm font-bold text-on-surface">Hyperlipidemia</span>
                  <span className="rounded-md bg-secondary-container px-2 py-0.5 text-[10px] font-bold text-on-secondary-container">Chronic</span>
                </div>
                <p className="text-xs text-on-surface-variant">Detected via history cross-reference</p>
              </div>
            </div>
          </section>

          {/* Medicines */}
          <section>
            <h4 className="mb-4 text-xs font-extrabold tracking-widest text-outline uppercase">Extracted Medications</h4>
            <div className="space-y-2">
              <div className="flex items-center rounded-xl border border-outline-variant/30 bg-surface p-3">
                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-fixed">
                  <span className="material-symbols-outlined text-secondary">medication</span>
                </div>
                <div>
                  <p className="text-sm font-bold">Metformin 500mg</p>
                  <p className="text-[11px] text-on-surface-variant">BID • Oral</p>
                </div>
              </div>
              <div className="flex items-center rounded-xl border border-outline-variant/30 bg-surface p-3">
                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-lg bg-tertiary-fixed">
                  <span className="material-symbols-outlined text-tertiary">pill</span>
                </div>
                <div>
                  <p className="text-sm font-bold">Atorvastatin 20mg</p>
                  <p className="text-[11px] text-on-surface-variant">Daily • Nightly</p>
                </div>
              </div>
            </div>
          </section>

          {/* Tests/Metrics */}
          <section>
            <h4 className="mb-4 text-xs font-extrabold tracking-widest text-outline uppercase">Clinical Observations</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-surface-container-low p-3">
                <p className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">Glucose</p>
                <p className="text-xl font-bold text-primary">142 <span className="text-xs font-medium">mg/dL</span></p>
              </div>
              <div className="rounded-2xl bg-surface-container-low p-3">
                <p className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">BMI</p>
                <p className="text-xl font-bold text-secondary">28.4 <span className="text-xs font-medium">kg/m²</span></p>
              </div>
            </div>
          </section>
        </div>

        <div className="border-t border-slate-100 bg-surface-container-lowest p-6">
          <button onClick={() => toast.success('Records synced to patient history (FHIR nodes verified).')} className="group flex w-full items-center justify-center space-x-2 rounded-full bg-primary py-4 font-bold text-white transition-opacity hover:opacity-90">
            <span>Commit to Patient History</span>
            <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">arrow_forward</span>
          </button>
          <p className="mt-3 text-center text-[10px] text-outline">Confirming will sync data with HL7/FHIR nodes.</p>
        </div>
      </aside>

      {/* Sticky Status Footer (HIPAA) - placed absolute within main area */}
      <footer className="absolute bottom-0 left-64 right-0 flex h-10 items-center justify-between bg-slate-900 px-8 text-[10px] font-medium text-slate-400">
        <div className="flex items-center space-x-4">
          <span className="flex items-center text-tertiary">
            <span className="mr-2 h-2 w-2 rounded-full bg-tertiary"></span>
            System Online
          </span>
          <span>Session ID: CPC-882-991</span>
          <span>Uptime: 99.99%</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <span className="material-symbols-outlined mr-1 text-[12px]">security</span>
            End-to-End Encrypted
          </span>
          <span>GDPR & HIPAA Compliant</span>
        </div>
      </footer>
    </div>
  );
}
