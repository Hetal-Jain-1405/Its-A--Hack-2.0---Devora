import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { user as userApi } from '../services/api';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [security, setSecurity] = useState(null);
  const [loading, setLoading] = useState(true);

  // Change Password modal state
  const [showPwModal, setShowPwModal] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [changingPw, setChangingPw] = useState(false);

  // Edit profile modal state
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAllProfileData();
  }, []);

  const loadAllProfileData = async () => {
    setLoading(true);
    try {
      const [profileData, sessionsData, securityData] = await Promise.allSettled([
        userApi.getProfile(),
        userApi.getSessions(),
        userApi.getSecurity(),
      ]);
      if (profileData.status === 'fulfilled') {
        setProfile(profileData.value);
        setEditData({
          blood_type: profileData.value.blood_type || '',
          allergies: (profileData.value.allergies || []).join(', '),
          chronic_conditions: (profileData.value.chronic_conditions || []).join(', '),
          emergency_contact_name: profileData.value.emergency_contact_name || '',
          emergency_contact_phone: profileData.value.emergency_contact_phone || '',
        });
      }
      if (sessionsData.status === 'fulfilled') setSessions(Array.isArray(sessionsData.value) ? sessionsData.value : []);
      if (securityData.status === 'fulfilled') setSecurity(securityData.value);
    } catch (err) {
      toast.error('Failed to load profile: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleToggle2FA = async () => {
    if (!security) return;
    const newVal = !security.two_factor_enabled;
    try {
      const result = await userApi.updateSecurity({ two_factor_enabled: newVal });
      setSecurity(result);
      toast.success(newVal ? 'Two-Factor Authentication enabled.' : 'Two-Factor Authentication disabled.', {
        icon: newVal ? '🔒' : '🔓',
      });
    } catch (err) {
      toast.error('Failed to update 2FA: ' + (err.message || 'Unknown error'));
    }
  };

  const handleChangePassword = async () => {
    if (!currentPw || !newPw) return toast.error('Please fill in both fields.');
    if (newPw.length < 8) return toast.error('New password must be at least 8 characters.');
    setChangingPw(true);
    try {
      await userApi.changePassword(currentPw, newPw);
      toast.success('Password changed successfully!');
      setShowPwModal(false);
      setCurrentPw('');
      setNewPw('');
    } catch (err) {
      toast.error('Password change failed: ' + (err.message || 'Incorrect current password'));
    } finally {
      setChangingPw(false);
    }
  };

  const handleRevokeSessions = async () => {
    try {
      const result = await userApi.revokeSessions();
      toast.success(result.message || 'All sessions revoked!', { icon: '🔐' });
      // Reload sessions
      const newSessions = await userApi.getSessions();
      setSessions(Array.isArray(newSessions) ? newSessions : []);
    } catch (err) {
      toast.error('Failed to revoke sessions: ' + (err.message || 'Unknown error'));
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const payload = {
        blood_type: editData.blood_type || undefined,
        allergies: editData.allergies ? editData.allergies.split(',').map(s => s.trim()).filter(Boolean) : [],
        chronic_conditions: editData.chronic_conditions ? editData.chronic_conditions.split(',').map(s => s.trim()).filter(Boolean) : [],
        emergency_contact_name: editData.emergency_contact_name || undefined,
        emergency_contact_phone: editData.emergency_contact_phone || undefined,
      };
      const result = await userApi.updateProfile(payload);
      setProfile(result);
      setShowEditProfile(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile: ' + (err.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const getDeviceIcon = (device) => {
    if (!device) return 'devices_other';
    const d = device.toLowerCase();
    if (d.includes('iphone') || d.includes('mobile') || d.includes('android')) return 'phone_iphone';
    if (d.includes('mac') || d.includes('laptop') || d.includes('windows')) return 'laptop_mac';
    return 'devices_other';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-10 pb-32 pt-12">
      {/* Header Card */}
      <section className="mb-10 flex items-center gap-8 rounded-2xl bg-gradient-to-r from-primary to-primary-container p-8 text-white shadow-lg">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 ring-4 ring-white/30">
          <span className="material-symbols-outlined text-4xl">person</span>
        </div>
        <div>
          <span className="text-xs font-bold tracking-widest uppercase opacity-80">Member Profile</span>
          <h1 className="text-3xl font-extrabold">{profile?.full_name || user?.full_name || 'User'}</h1>
          <p className="mt-1 text-sm opacity-80">{profile?.email || user?.email} · {(profile?.role || user?.role || 'user').charAt(0).toUpperCase() + (profile?.role || user?.role || 'user').slice(1)}</p>
        </div>
        <button
          onClick={() => setShowEditProfile(!showEditProfile)}
          className="ml-auto rounded-full bg-white/20 px-5 py-2.5 text-sm font-bold backdrop-blur-sm transition-all hover:bg-white/30"
        >
          {showEditProfile ? 'Cancel' : 'Edit Profile'}
        </button>
      </section>

      {/* Edit Profile Form */}
      {showEditProfile && (
        <section className="mb-10 rounded-xl bg-surface-container-lowest p-6 shadow-[0_4px_16px_rgba(25,28,29,0.04)]">
          <h2 className="mb-6 text-lg font-bold">Edit Medical Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold tracking-widest text-on-surface-variant uppercase">Blood Type</label>
              <input
                type="text"
                value={editData.blood_type}
                onChange={e => setEditData(d => ({ ...d, blood_type: e.target.value }))}
                placeholder="O+, A-, B+..."
                className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold tracking-widest text-on-surface-variant uppercase">Allergies (comma-separated)</label>
              <input
                type="text"
                value={editData.allergies}
                onChange={e => setEditData(d => ({ ...d, allergies: e.target.value }))}
                placeholder="Penicillin, Peanuts..."
                className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold tracking-widest text-on-surface-variant uppercase">Chronic Conditions (comma-separated)</label>
              <input
                type="text"
                value={editData.chronic_conditions}
                onChange={e => setEditData(d => ({ ...d, chronic_conditions: e.target.value }))}
                placeholder="Hypertension, Diabetes..."
                className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold tracking-widest text-on-surface-variant uppercase">Emergency Contact Name</label>
              <input
                type="text"
                value={editData.emergency_contact_name}
                onChange={e => setEditData(d => ({ ...d, emergency_contact_name: e.target.value }))}
                placeholder="Jane Doe"
                className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold tracking-widest text-on-surface-variant uppercase">Emergency Contact Phone</label>
              <input
                type="text"
                value={editData.emergency_contact_phone}
                onChange={e => setEditData(d => ({ ...d, emergency_contact_phone: e.target.value }))}
                placeholder="+1-555-0123"
                className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="mt-6 rounded-full bg-primary px-8 py-3 text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </section>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Medical Info */}
        <section className="rounded-xl bg-surface-container-lowest p-6 shadow-[0_4px_16px_rgba(25,28,29,0.04)]">
          <h2 className="mb-6 flex items-center gap-2 text-sm font-bold tracking-widest text-on-surface-variant uppercase">
            <span className="material-symbols-outlined text-sm">medical_information</span> Medical Info
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-4">
              <span className="text-sm text-on-surface-variant">Blood Type</span>
              <span className="font-bold text-on-surface">{profile?.blood_type || 'Not set'}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-4">
              <span className="text-sm text-on-surface-variant">Allergies</span>
              <span className="font-bold text-error">
                {profile?.allergies && profile.allergies.length > 0 ? profile.allergies.join(', ') : 'None'}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-4">
              <span className="text-sm text-on-surface-variant">Chronic Conditions</span>
              <span className="font-bold text-on-surface">
                {profile?.chronic_conditions && profile.chronic_conditions.length > 0 ? profile.chronic_conditions.join(', ') : 'None'}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-4">
              <span className="text-sm text-on-surface-variant">Emergency Contact</span>
              <span className="font-bold text-on-surface">
                {profile?.emergency_contact_name || 'Not set'}{profile?.emergency_contact_phone ? ` (${profile.emergency_contact_phone})` : ''}
              </span>
            </div>
          </div>
        </section>

        {/* Security Status */}
        <section className="rounded-xl bg-surface-container-lowest p-6 shadow-[0_4px_16px_rgba(25,28,29,0.04)]">
          <h2 className="mb-6 flex items-center gap-2 text-sm font-bold tracking-widest text-on-surface-variant uppercase">
            <span className="material-symbols-outlined text-sm">shield</span> Security Status
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>enhanced_encryption</span>
                <div>
                  <span className="text-sm font-semibold text-on-surface">Encryption</span>
                  <p className="text-xs text-on-surface-variant">AES-256 Bit Encrypted</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-4">
              <span className="text-sm text-on-surface-variant">Active Devices</span>
              <span className="font-bold text-primary">{sessions.length} Device{sessions.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-4">
              <div>
                <span className="text-sm font-semibold text-on-surface">Two-Factor Auth</span>
                <p className="text-xs text-on-surface-variant">{security?.two_factor_enabled ? 'Enabled' : 'Disabled'}</p>
              </div>
              <button
                onClick={handleToggle2FA}
                className={`relative h-7 w-12 rounded-full transition-colors duration-300 ${security?.two_factor_enabled ? 'bg-primary' : 'bg-outline-variant/30'}`}
              >
                <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-all duration-300 ${security?.two_factor_enabled ? 'left-5.5' : 'left-0.5'}`}></span>
              </button>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-4">
              <span className="text-sm text-on-surface-variant">Emergency Access</span>
              <span className={`font-bold ${security?.emergency_access_enabled ? 'text-error' : 'text-on-surface-variant'}`}>
                {security?.emergency_access_enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Access Logs / Sessions */}
      <section className="mt-8 rounded-xl bg-surface-container-lowest p-6 shadow-[0_4px_16px_rgba(25,28,29,0.04)]">
        <h2 className="mb-6 flex items-center gap-2 text-sm font-bold tracking-widest text-on-surface-variant uppercase">
          <span className="material-symbols-outlined text-sm">history</span> Active Sessions
        </h2>
        <div className="space-y-3">
          {sessions.length === 0 ? (
            <p className="text-sm text-on-surface-variant text-center py-6">No active sessions found.</p>
          ) : (
            sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between rounded-lg bg-surface-container-low p-4 transition-colors hover:bg-surface-container-high">
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${session.is_current ? 'bg-primary/10' : 'bg-surface-container-high'}`}>
                    <span className={`material-symbols-outlined text-lg ${session.is_current ? 'text-primary' : 'text-on-surface-variant'}`}>
                      {getDeviceIcon(session.device)}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-bold text-on-surface">
                      {session.device}
                      {session.is_current && <span className="ml-2 text-xs font-bold text-primary">(Current)</span>}
                    </span>
                    <p className="text-xs text-on-surface-variant">{session.location} · {session.ip_address}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-on-surface-variant">
                    {new Date(session.last_active).toLocaleString()}
                  </span>
                  <p className="text-[10px] font-bold tracking-wider uppercase text-tertiary">ACTIVE</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Account Actions */}
      <section className="mt-8 rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-[0_4px_16px_rgba(25,28,29,0.04)]">
        <h2 className="mb-4 text-sm font-bold tracking-widest text-on-surface-variant uppercase">Account Security</h2>
        <p className="mb-6 text-sm text-on-surface-variant">Managing your security credentials and connected platforms.</p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowPwModal(!showPwModal)}
            className="rounded-full bg-primary/10 px-5 py-2.5 text-xs font-bold text-primary transition-all hover:bg-primary/20"
          >
            Change Password
          </button>
          <button
            onClick={handleRevokeSessions}
            className="rounded-full bg-error/10 px-5 py-2.5 text-xs font-bold text-error transition-all hover:bg-error/20"
          >
            Log Out All Devices
          </button>
        </div>

        {/* Change Password Form */}
        {showPwModal && (
          <div className="mt-6 rounded-xl bg-surface-container-low p-6">
            <h3 className="mb-4 text-sm font-bold">Change Password</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold tracking-widest text-on-surface-variant uppercase">Current Password</label>
                <input
                  type="password"
                  value={currentPw}
                  onChange={e => setCurrentPw(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border-none bg-surface-container-lowest px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold tracking-widest text-on-surface-variant uppercase">New Password</label>
                <input
                  type="password"
                  value={newPw}
                  onChange={e => setNewPw(e.target.value)}
                  placeholder="••••••••"
                  minLength={8}
                  className="w-full rounded-xl border-none bg-surface-container-lowest px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <button
                onClick={handleChangePassword}
                disabled={changingPw}
                className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
              >
                {changingPw ? 'Changing...' : 'Update Password'}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
