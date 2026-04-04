import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { records, patients } from '../services/api';

export default function UploadRecords() {
  const { user } = useAuth();
  const patientId = user?.id;
  const fileInputRef = useRef(null);

  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [batchId, setBatchId] = useState(null);
  const [batchStatus, setBatchStatus] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [committing, setCommitting] = useState(false);
  const [conditions, setConditions] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    if (!patientId) { toast.error('Please log in first.'); return; }

    setUploading(true);
    setUploadProgress(10);

    try {
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        setUploadProgress(Math.round(((i + 0.5) / e.target.files.length) * 80));
        const result = await records.upload(patientId, file);
        setBatchId(result.batch_id);
        setBatchStatus(result.status);
        setUploadedDocs(prev => [...prev, ...(result.documents || [])]);
      }
      setUploadProgress(100);
      toast.success(`${e.target.files.length} file(s) uploaded successfully!`);

      // Poll batch status
      if (batchId) pollBatchStatus(batchId);
    } catch (err) {
      toast.error('Upload failed: ' + (err.message || 'Unknown error'));
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const pollBatchStatus = async (id) => {
    try {
      const status = await records.getBatchStatus(id);
      setBatchStatus(status.status);
    } catch { /* silent */ }
  };

  const handleCommit = async () => {
    if (!batchId) { toast.error('No batch to commit.'); return; }
    setCommitting(true);
    try {
      await records.commitBatch(batchId);
      toast.success('Records committed! AI is now processing...');
      setBatchStatus('processing');

      // After commit, load conditions
      setTimeout(async () => {
        try {
          const conds = await patients.getConditions(patientId);
          setConditions(conds);
          toast.success('AI extraction complete!');
        } catch { /* silent */ }
      }, 2000);
    } catch (err) {
      toast.error('Commit failed: ' + (err.message || 'Unknown error'));
    } finally {
      setCommitting(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
    if (!patientId) { toast.error('Please log in first.'); return; }

    setUploading(true);
    setUploadProgress(10);
    try {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        const file = e.dataTransfer.files[i];
        setUploadProgress(Math.round(((i + 0.5) / e.dataTransfer.files.length) * 80));
        const result = await records.upload(patientId, file);
        setBatchId(result.batch_id);
        setBatchStatus(result.status);
        setUploadedDocs(prev => [...prev, ...(result.documents || [])]);
      }
      setUploadProgress(100);
      toast.success(`${e.dataTransfer.files.length} file(s) uploaded!`);
    } catch (err) {
      toast.error('Upload failed: ' + (err.message || 'Unknown error'));
    } finally {
      setUploading(false);
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
        <div 
          onClick={handleFileSelect}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="group relative flex flex-1 cursor-pointer flex-col items-center justify-center bg-surface-container-lowest p-12 transition-all hover:bg-white" 
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='24' ry='24' stroke='%23C2C6D4FF' stroke-width='2' stroke-dasharray='12%2c 12' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e\")",
            borderRadius: "24px"
          }}
        >
          <div className="flex max-w-md flex-col items-center text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-fixed transition-transform duration-300 group-hover:scale-110">
              <span className={`material-symbols-outlined text-4xl text-primary ${uploading ? 'animate-pulse' : ''}`} style={{ fontVariationSettings: "'wght' 600" }}>
                {uploading ? 'progress_activity' : 'cloud_upload'}
              </span>
            </div>
            <h3 className="mb-2 text-xl font-bold text-on-surface">
              {uploading ? 'Uploading...' : 'Drag & Drop Patient Files'}
            </h3>
            <p className="mb-8 text-on-surface-variant">Supported formats: DICOM, PDF, JPEG, and HL7. Files are automatically encrypted before processing.</p>
            <button disabled={uploading} className="flex items-center space-x-2 rounded-full bg-primary px-8 py-3 font-bold text-white shadow-lg shadow-primary/20 transition-opacity hover:opacity-90 disabled:opacity-50">
              <span className="material-symbols-outlined">add_circle</span>
              <span>{uploading ? 'Uploading...' : 'Select Files'}</span>
            </button>
          </div>
          {/* Ambient HIPAA Badge */}
          <div className="absolute bottom-6 flex items-center space-x-2 text-[10px] font-bold tracking-widest text-outline-variant uppercase">
            <span className="material-symbols-outlined text-xs">lock</span>
            <span>AES-256 Bit Encryption Active</span>
          </div>
        </div>

        {/* Processing Queue */}
        {uploadedDocs.length > 0 && (
          <div className="rounded-xl bg-surface-container-low p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="material-symbols-outlined text-primary">analytics</span>
                <span className="text-sm font-bold">{uploadedDocs.length} Record{uploadedDocs.length !== 1 ? 's' : ''} Uploaded</span>
              </div>
              <span className="text-xs font-bold text-primary">{batchStatus || 'ready'}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-highest">
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-primary-container transition-all duration-500" style={{ width: `${uploadProgress}%` }}></div>
            </div>
            <div className="mt-4 space-y-3">
              {uploadedDocs.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm">
                      {doc.mime_type?.includes('pdf') ? 'picture_as_pdf' : 'image'}
                    </span>
                    <span>{doc.file_name}</span>
                  </div>
                  <span className={`flex items-center font-bold ${doc.extraction_status === 'completed' ? 'text-tertiary' : 'text-primary'}`}>
                    {doc.extraction_status === 'completed' ? (
                      <><span className="material-symbols-outlined mr-1 text-[14px]">check_circle</span>Extracted</>
                    ) : doc.extraction_status === 'processing' ? (
                      <><span className="material-symbols-outlined animate-pulse mr-1 text-[14px]">sync</span>Processing...</>
                    ) : (
                      <><span className="material-symbols-outlined mr-1 text-[14px]">schedule</span>Queued</>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Right Panel: AI Extraction Results */}
      <aside className="border-slate-50 flex w-[400px] flex-col overflow-hidden rounded-3xl border bg-white shadow-2xl shadow-slate-200/50">
        <div className="bg-gradient-to-br from-primary to-primary-container p-6 text-white">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <h3 className="text-lg font-bold">AI Extraction Results</h3>
            </div>
            <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold tracking-widest uppercase backdrop-blur-md">
              {uploadedDocs.length > 0 ? 'Live' : 'Awaiting'}
            </span>
          </div>
          <div className="border border-white/10 rounded-xl bg-white/10 p-4">
            <p className="text-xs leading-relaxed text-on-primary-container">
              {uploadedDocs.length > 0
                ? `${uploadedDocs.length} document(s) uploaded. ${conditions.length > 0 ? `${conditions.length} conditions detected.` : 'Commit to start AI extraction.'}`
                : 'Upload patient documents to begin AI-powered medical data extraction.'}
            </p>
          </div>
        </div>
        
        <div className="flex-1 space-y-8 overflow-y-auto p-6">
          {/* Detected Conditions */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-xs font-extrabold tracking-widest text-outline uppercase">Detected Conditions</h4>
              {conditions.length > 0 && (
                <span className="cursor-pointer text-[10px] text-primary underline">Verify All</span>
              )}
            </div>
            <div className="space-y-3">
              {conditions.length === 0 ? (
                <div className="rounded-2xl bg-surface-container-low p-4 text-center">
                  <p className="text-xs text-on-surface-variant">
                    {uploadedDocs.length > 0 ? 'Commit the batch to detect conditions' : 'Upload files to begin'}
                  </p>
                </div>
              ) : conditions.map((cond) => (
                <div key={cond.id} className="rounded-2xl bg-surface-container-low p-4 transition-all hover:bg-surface-container">
                  <div className="mb-1 flex items-start justify-between">
                    <span className="text-sm font-bold text-on-surface">{cond.name}</span>
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${cond.severity === 'critical' ? 'bg-error-container text-on-error-container' : 'bg-secondary-container text-on-secondary-container'}`}>
                      {cond.severity === 'critical' ? 'Critical' : 'Chronic'}
                    </span>
                  </div>
                  {cond.source_document && (
                    <p className="text-xs text-on-surface-variant">Source: {cond.source_document}</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Upload Info */}
          {uploadedDocs.length > 0 && (
            <section>
              <h4 className="mb-4 text-xs font-extrabold tracking-widest text-outline uppercase">Uploaded Documents</h4>
              <div className="space-y-2">
                {uploadedDocs.map(doc => (
                  <div key={doc.id} className="flex items-center rounded-xl border border-outline-variant/30 bg-surface p-3">
                    <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-fixed">
                      <span className="material-symbols-outlined text-secondary">
                        {doc.mime_type?.includes('pdf') ? 'picture_as_pdf' : 'image'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold">{doc.file_name}</p>
                      <p className="text-[11px] text-on-surface-variant">{doc.extraction_status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="border-t border-slate-100 bg-surface-container-lowest p-6">
          <button
            onClick={handleCommit}
            disabled={committing || uploadedDocs.length === 0}
            className="group flex w-full items-center justify-center space-x-2 rounded-full bg-primary py-4 font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {committing ? (
              <><span className="material-symbols-outlined animate-spin text-lg">progress_activity</span><span>Committing...</span></>
            ) : (
              <><span>Commit to Patient History</span><span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">arrow_forward</span></>
            )}
          </button>
          <p className="mt-3 text-center text-[10px] text-outline">Confirming will sync data with HL7/FHIR nodes.</p>
        </div>
      </aside>

      {/* Sticky Status Footer */}
      <footer className="absolute bottom-0 left-64 right-0 flex h-10 items-center justify-between bg-slate-900 px-8 text-[10px] font-medium text-slate-400">
        <div className="flex items-center space-x-4">
          <span className="flex items-center text-tertiary">
            <span className="mr-2 h-2 w-2 rounded-full bg-tertiary"></span>
            System Online
          </span>
          <span>Batch: {batchId ? batchId.substring(0, 8) + '...' : 'None'}</span>
          <span>Files: {uploadedDocs.length}</span>
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
