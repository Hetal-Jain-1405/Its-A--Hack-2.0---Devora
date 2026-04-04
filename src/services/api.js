// CareFlow AI — API Service Layer
//
// Development: use same-origin `/v1` so Vite proxies to the backend (avoids CORS when the app
// is opened as http://localhost:5173 while the API is http://127.0.0.1:8000).
// Production: set VITE_API_ORIGIN (no trailing slash), e.g. https://api.example.com

const API_ORIGIN = (
  import.meta.env.VITE_API_ORIGIN ??
  (import.meta.env.DEV ? '' : 'http://127.0.0.1:8000')
).replace(/\/$/, '');
const B = `${API_ORIGIN}/v1`;
const gt = () => localStorage.getItem('cf_t');
const st = (t) => localStorage.setItem('cf_t', t);
const ct = () => localStorage.removeItem('cf_t');

async function r(e, o = {}) {
  const h = { ...(o.headers || {}) };
  if (!(o.body instanceof FormData)) h['Content-Type'] = 'application/json';
  const t = gt(); if (t) h['Authorization'] = `Bearer ${t}`;
  const res = await fetch(`${B}${e}`, { ...o, headers: h });
  if (res.status === 401) { ct(); window.location.href = '/login'; return; }
  if (!res.ok) { const er = await res.json().catch(() => ({})); throw new Error(er.detail || `HTTP ${res.status}`); }
  return res.json();
}

// ── Auth ─────────────────────────────────────────────────────────────────
export const auth = {
  // POST /v1/auth/login
  login: (email, password) =>
    r('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  // POST /v1/auth/register
  register: (email, password, full_name, role = 'user') =>
    r('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, full_name, role }) }),
  setToken: st, getToken: gt, clearToken: ct,
};

// ── Profile & Security ───────────────────────────────────────────────────
export const user = {
  // GET /v1/users/me/profile
  getProfile: () => r('/users/me/profile'),
  // PATCH /v1/users/me/profile  — body: { blood_type, allergies[], chronic_conditions[], emergency_contact_name, emergency_contact_phone }
  updateProfile: (d) => r('/users/me/profile', { method: 'PATCH', body: JSON.stringify(d) }),
  // GET /v1/users/me/sessions  — returns [{ id, device, location, ip_address, last_active, is_current }]
  getSessions: () => r('/users/me/sessions'),
  // GET /v1/users/me/security  — returns { two_factor_enabled, emergency_access_enabled }
  getSecurity: () => r('/users/me/security'),
  // PATCH /v1/users/me/security  — body: { two_factor_enabled?, emergency_access_enabled? }
  updateSecurity: (d) => r('/users/me/security', { method: 'PATCH', body: JSON.stringify(d) }),
  // POST /v1/users/me/change-password  — body: { current_password, new_password }
  changePassword: (current_password, new_password) =>
    r('/users/me/change-password', { method: 'POST', body: JSON.stringify({ current_password, new_password }) }),
  // POST /v1/users/me/revoke-sessions
  revokeSessions: () => r('/users/me/revoke-sessions', { method: 'POST' }),
};

// ── Emergency Access (separate endpoint) ─────────────────────────────────
export const settings = {
  // PATCH /v1/users/settings/emergency-access  — body: { emergency_access_enabled }
  updateEmergencyAccess: (enabled) =>
    r('/users/settings/emergency-access', { method: 'PATCH', body: JSON.stringify({ emergency_access_enabled: enabled }) }),
};

// ── Alerts ───────────────────────────────────────────────────────────────
export const alerts = {
  // GET /v1/alerts?severity=critical|warning|info&status=active|dismissed|snoozed
  getAll: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return r(`/alerts${q ? `?${q}` : ''}`);
  },
  // PATCH /v1/alerts/:id  — body: { status: "dismissed" | "snoozed" | "active" }
  update: (id, status) =>
    r(`/alerts/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};

// ── Actions (prescribe, schedule, refill) ────────────────────────────────
export const actions = {
  // POST /v1/actions/prescribe  — body: { patient_id, medication, dosage, frequency, duration, notes? }
  prescribe: (d) => r('/actions/prescribe', { method: 'POST', body: JSON.stringify(d) }),
  // POST /v1/actions/schedule   — body: { patient_id, visit_type, preferred_date, reason?, notes? }
  schedule: (d) => r('/actions/schedule', { method: 'POST', body: JSON.stringify(d) }),
  // POST /v1/actions/refill     — body: { patient_id, medication, pharmacy?, notes? }
  refill: (d) => r('/actions/refill', { method: 'POST', body: JSON.stringify(d) }),
};

// ── Caregivers ───────────────────────────────────────────────────────────
export const caregivers = {
  // GET /v1/caregivers?patient_id=uuid
  getAll: (patient_id) => r(`/caregivers?patient_id=${patient_id}`),
  // POST /v1/caregivers/invite?patient_id=uuid  — body: { email, name, relationship?, access_level? }
  invite: (patient_id, d) =>
    r(`/caregivers/invite?patient_id=${patient_id}`, { method: 'POST', body: JSON.stringify(d) }),
  // DELETE /v1/caregivers/:id
  revoke: (id) => r(`/caregivers/${id}`, { method: 'DELETE' }),
};

// ── Patient Conditions ───────────────────────────────────────────────────
export const patients = {
  // GET /v1/patients/:id/conditions  — returns [{ id, patient_id, name, severity, source_document }]
  getConditions: (id) => r(`/patients/${id}/conditions`),
  // GET /v1/patients/:id/insights    — returns [{ id, patient_id, executive_summary, confidence_score, created_at }]
  getInsights: (id) => r(`/patients/${id}/insights`),
  // POST /v1/patients/:id/analyze
  analyze: (id) => r(`/patients/${id}/analyze`, { method: 'POST' }),
  // POST /v1/patients/:id/export
  exportReport: (id) => r(`/patients/${id}/export`, { method: 'POST' }),
  // GET /v1/patients/:id/timeline    — returns [{ id, category, status, start_date, end_date, documents[], actions[] }]
  getTimeline: (id) => r(`/patients/${id}/timeline`),
  // PATCH /v1/patients/:pid/timeline/:mid  — body: { status?, end_date? }
  updateMilestone: (pid, mid, d) =>
    r(`/patients/${pid}/timeline/${mid}`, { method: 'PATCH', body: JSON.stringify(d) }),
  // POST /v1/patients/:id/generate-guide
  generateGuide: (id) => r(`/patients/${id}/generate-guide`, { method: 'POST' }),
};

// ── Tasks ────────────────────────────────────────────────────────────────
export const tasks = {
  // GET /v1/tasks?date=today|upcoming|missed
  getAll: (filter) => r(`/tasks${filter ? `?date=${filter}` : ''}`),
  // PATCH /v1/tasks/:id  — body: { title?, description?, due_datetime?, priority?, status? }
  update: (id, d) => r(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(d) }),
};

// ── Records / Upload ─────────────────────────────────────────────────────
export const records = {
  // POST /v1/records/upload  — multipart: { patient_id, file }
  upload: (patient_id, file) => {
    const fd = new FormData();
    fd.append('patient_id', patient_id);
    fd.append('file', file);
    return r('/records/upload', { method: 'POST', body: fd });
  },
  // GET /v1/records/batches/:id
  getBatchStatus: (id) => r(`/records/batches/${id}`),
  // POST /v1/records/batches/:id/commit
  commitBatch: (id) => r(`/records/batches/${id}/commit`, { method: 'POST' }),
};

// ── Search ───────────────────────────────────────────────────────────────
export const search = {
  // GET /v1/records/search?q=query  — returns { query, results[{ id, title, type, description, metadata }], total }
  query: (q) => r(`/records/search?q=${encodeURIComponent(q)}`),
};

// ── Analytics ────────────────────────────────────────────────────────────
export const analytics = {
  // GET /v1/analytics/summary
  getSummary: () => r('/analytics/summary'),
};

// ── Health Check (no auth) ───────────────────────────────────────────────
export const health = {
  // GET /health
  check: () => fetch(`${API_ORIGIN}/health`).then((res) => res.json()),
};
