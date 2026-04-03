import { useState } from 'react';
import toast from 'react-hot-toast';

const initialMembers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Primary Caregiver',
    relation: 'Spouse',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxqmGlC-KNRsNfHUMzuIIEBgmxzcOPj09mfMlLlg2tyfnHcCcT8BFWkjbIHuXiVHRACaEq-5-fTgJ-yNidtYK1k5yCFV5pKWKAJpP6ZCpGIIgMeqsLINj4zrIxfUdBCKB2bIFy4EX7hA',
    accessLevel: 'Full Medical Records',
    lastActive: '2 hrs ago',
    status: 'active',
  },
  {
    id: 2,
    name: 'Michael Smith',
    role: 'Family Member',
    relation: 'Son',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbHyRLNIFo-5SjIMGDK9lE6SKeLXQVRFJmJe0Rk0HOxVXHDmjqwN3g_xCaXUcRB5P8UbIudrHR3t-UwPO8sF5c6bfV2SZ3-b-uHaBTWA6djYhgZNkH8-lbEg',
    accessLevel: 'Emergency Only',
    lastActive: '1 day ago',
    status: 'active',
  },
];

export default function Family() {
  const [members, setMembers] = useState(initialMembers);
  const [emergencyBypass, setEmergencyBypass] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  const handleToggleEmergency = () => {
    setEmergencyBypass(!emergencyBypass);
    toast.success(
      !emergencyBypass
        ? 'Emergency bypass ACTIVATED. First responders can access critical vitals.'
        : 'Emergency bypass deactivated.',
      { icon: !emergencyBypass ? '🚨' : '🔒' }
    );
  };

  const handleRevoke = (memberId) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    toast.success('Member access revoked.', { icon: '🚫' });
  };

  const handleInvite = () => {
    if (!inviteEmail.trim()) return toast.error('Please enter a valid email.');
    toast.success(`Invitation sent to ${inviteEmail}`, { icon: '✉️' });
    setInviteEmail('');
    setShowInvite(false);
  };

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
          <span className="material-symbols-outlined text-sm">group</span> Family Members
        </h2>

        {members.map((member) => (
          <article
            key={member.id}
            className="group flex items-center gap-6 rounded-xl bg-surface-container-lowest p-6 shadow-[0_4px_16px_rgba(25,28,29,0.04)] transition-all hover:shadow-md"
          >
            <img
              src={member.avatar}
              alt={member.name}
              className="h-14 w-14 rounded-full object-cover ring-2 ring-primary/20"
            />
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-on-surface">{member.name}</h3>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary uppercase">{member.role}</span>
              </div>
              <p className="mt-1 text-sm text-on-surface-variant">
                {member.relation} · {member.accessLevel} · Last active {member.lastActive}
              </p>
            </div>
            <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={() => toast.success(`Viewing ${member.name}'s permissions.`)}
                className="rounded-full bg-primary/10 px-4 py-2 text-xs font-bold text-primary transition-all hover:bg-primary/20"
              >
                Manage
              </button>
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
          <div className="mt-6 flex gap-3">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Enter email address..."
              className="flex-1 rounded-full border-none bg-surface-container-low px-5 py-3 text-sm focus:ring-2 focus:ring-primary/20"
            />
            <button
              onClick={handleInvite}
              className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-on-primary transition-all hover:opacity-90"
            >
              Send Invite
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
