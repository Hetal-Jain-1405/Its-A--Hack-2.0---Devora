import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { caregivers, settings } from '../services/api';

export default function Family() {
  const { user } = useAuth();
  const patientId = user?.id;

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emergencyBypass, setEmergencyBypass] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRelation, setInviteRelation] = useState('');
  const [inviteAccess, setInviteAccess] = useState('limited');
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    if (!patientId) return;
    loadCaregivers();
  }, [patientId]);

  const loadCaregivers = async () => {
    setLoading(true);
    try {
      const data = await caregivers.getAll(patientId);
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load caregivers: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEmergency = async () => {
    const newState = !emergencyBypass;
    try {
      await settings.updateEmergencyAccess(newState);
      setEmergencyBypass(newState);
      toast.success(
        newState
          ? 'Emergency bypass ACTIVATED. First responders can access critical vitals.'
          : 'Emergency bypass deactivated.',
        { icon: newState ? '🚨' : '🔒' }
      );
    } catch (err) {
      toast.error('Failed to update emergency access: ' + (err.message || 'Unknown error'));
    }
  };

  const handleRevoke = async (caregiverId) => {
    try {
      await caregivers.revoke(caregiverId);
      setMembers((prev) => prev.filter((m) => m.id !== caregiverId));
      toast.success('Member access revoked.', { icon: '🚫' });
    } catch (err) {
      toast.error('Failed to revoke access: ' + (err.message || 'Unknown error'));
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return toast.error('Please enter a valid email.');
    if (!inviteName.trim()) return toast.error('Please enter a name.');
    setInviting(true);
    try {
      const result = await caregivers.invite(patientId, {
        email: inviteEmail,
        name: inviteName,
        relationship: inviteRelation || undefined,
        access_level: inviteAccess,
      });
      setMembers(prev => [...prev, result]);
      toast.success(`Invitation sent to ${inviteEmail}`, { icon: '✉️' });
      setInviteEmail('');
      setInviteName('');
      setInviteRelation('');
      setInviteAccess('limited');
      setShowInvite(false);
    } catch (err) {
      toast.error('Invitation failed: ' + (err.message || 'Unknown error'));
    } finally {
      setInviting(false);
    }
  };

  const accessLevelLabels = {
    full: 'Full Medical Records',
    limited: 'Limited Access',
    emergency_only: 'Emergency Only',
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - d) / 60000);
    if (diff < 60) return `${diff} min ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hrs ago`;
    return `${Math.floor(diff / 1440)} day${Math.floor(diff / 1440) > 1 ? 's' : ''} ago`;
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
      {/* Header */}
      <section className="mb-10">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <span className="mb-1 block text-sm font-semibold tracking-widest text-secondary uppercase">Secure</span>
            <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">Family &amp; Caregivers</h1>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-tertiary-fixed px-4 py-2">
            <span className="material-symbols-outlined text-sm text-on-tertiary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
            <span className="text-xs font-bold text-on-tertiary-fixed">Encrypted Access Active</span>
          </div>
        </div>
        <p className="max-w-xl text-lg leading-relaxed text-on-surface-variant">
          Manage access for your inner circle and healthcare professionals.
        </p>
      </section>

      {/* Members List */}
      <section className="mb-10 space-y-4">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-widest text-on-surface-variant uppercase">
          <span className="material-symbols-outlined text-sm">group</span> Family Members ({members.length})
        </h2>

        {members.map((member) => (
          <article
            key={member.id}
            className="group flex items-center gap-6 rounded-xl bg-surface-container-lowest p-6 shadow-[0_4px_16px_rgba(25,28,29,0.04)] transition-all hover:shadow-md"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 ring-2 ring-primary/20">
              <span className="material-symbols-outlined text-2xl text-primary">person</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-on-surface">{member.name}</h3>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary uppercase">
                  {member.relationship || 'Caregiver'}
                </span>
              </div>
              <p className="mt-1 text-sm text-on-surface-variant">
                {member.email} · {accessLevelLabels[member.access_level] || member.access_level} · Added {formatTime(member.invited_at)}
              </p>
            </div>
            <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={() => handleRevoke(member.id)}
                className="rounded-full bg-error/10 px-4 py-2 text-xs font-bold text-error transition-all hover:bg-error/20"
              >
                Revoke
              </button>
            </div>
          </article>
        ))}

        {members.length === 0 && (
          <div className="rounded-2xl bg-surface-container-lowest p-12 text-center">
            <span className="material-symbols-outlined mb-4 text-5xl text-on-surface-variant/40">person_off</span>
            <p className="text-lg font-semibold text-on-surface-variant">No family members added.</p>
            <p className="text-sm text-on-surface-variant/70 mt-2">Invite caregivers and family members to share access to your health records.</p>
          </div>
        )}
      </section>

      {/* Emergency Access */}
      <section className="mb-10 rounded-xl border border-error/20 bg-error/5 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-error/10">
              <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>emergency</span>
            </div>
            <div>
              <h3 className="font-bold text-on-surface">Emergency Access</h3>
              <p className="text-sm text-on-surface-variant">Secure emergency bypass for first responders. Designated members receive a temporary code to access critical vitals instantly.</p>
            </div>
          </div>
          <button
            onClick={handleToggleEmergency}
            className={`relative h-8 w-14 rounded-full transition-colors duration-300 ${emergencyBypass ? 'bg-error' : 'bg-outline-variant/30'}`}
          >
            <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-md transition-all duration-300 ${emergencyBypass ? 'left-7' : 'left-1'}`}></span>
          </button>
        </div>
      </section>

      {/* Add Member */}
      <section className="rounded-xl bg-surface-container-lowest p-6 shadow-[0_4px_16px_rgba(25,28,29,0.04)]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-on-surface">Add Member</h3>
            <p className="text-sm text-on-surface-variant">New members will receive an invitation link to verify their identity and accept the role.</p>
          </div>
          <button
            onClick={() => setShowInvite(!showInvite)}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-container px-6 py-3 text-sm font-bold text-on-primary shadow-md transition-all hover:opacity-90"
          >
            <span className="material-symbols-outlined text-sm">person_add</span>
            Invite
          </button>
        </div>
        {showInvite && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold tracking-widest text-on-surface-variant uppercase">Name</label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="John Smith"
                  className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold tracking-widest text-on-surface-variant uppercase">Email</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="caregiver@example.com"
                  className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold tracking-widest text-on-surface-variant uppercase">Relationship</label>
                <input
                  type="text"
                  value={inviteRelation}
                  onChange={(e) => setInviteRelation(e.target.value)}
                  placeholder="Spouse, Parent, Sibling..."
                  className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold tracking-widest text-on-surface-variant uppercase">Access Level</label>
                <select
                  value={inviteAccess}
                  onChange={(e) => setInviteAccess(e.target.value)}
                  className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20"
                >
                  <option value="limited">Limited Access</option>
                  <option value="full">Full Medical Records</option>
                  <option value="emergency_only">Emergency Only</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleInvite}
              disabled={inviting}
              className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-on-primary transition-all hover:opacity-90 disabled:opacity-50"
            >
              {inviting ? 'Sending...' : 'Send Invite'}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
