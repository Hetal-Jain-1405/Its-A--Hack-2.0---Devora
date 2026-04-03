import { useState } from 'react';
import toast from 'react-hot-toast';

const accessLogs = [
  {
    id: 1,
    device: 'iPhone 15 Pro',
    context: 'Mobile App • San Francisco, CA',
    time: 'Today, 14:42',
    status: 'SUCCESSFUL',
  },
  {
    id: 2,
    device: 'MacBook Pro',
    context: 'Chrome Browser • San Francisco, CA',
    time: 'Oct 24, 09:15',
    status: 'SUCCESSFUL',
  },
  {
    id: 3,
    device: 'Unknown Device',
    context: 'Firefox • Denver, CO',
    time: 'Oct 22, 03:11',
    status: 'BLOCKED',
  },
];

export default function Profile() {
  const [twoFactor, setTwoFactor] = useState(true);

  const handleToggle2FA = () => {
    setTwoFactor(!twoFactor);
    toast.success(!twoFactor ? 'Two-Factor Authentication enabled.' : 'Two-Factor Authentication disabled.', {
      icon: !twoFactor ? '🔒' : '🔓',
    });
  };

  return (
    <div className="mx-auto max-w-4xl p-10 pb-32 pt-12">
      {/* Header Card */}
      <section className="mb-10 flex items-center gap-8 rounded-2xl bg-gradient-to-r from-primary to-primary-container p-8 text-white shadow-lg">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_Srtjr_03bIKw2LKbZYE76s_0JOPkm1OWPXwegzhfoucnD0F7Ddum_9SpNjll8pwTKb3Y2ZE-5Nx1q1Dr19WSrdSkOs8IQAfrKXvdGZZgJ3f5x9Oh9pugDe_TXoA-Ba1gV5dW_TDmy_WoXx2lQ5Vhz2bNS3tugsl05T3Ffn953VEVP9bJkmH6Hfv7xNzHmFXOKMr5nL0GxiqCZO5EuqQVQJZarC5ZBvlev7-nsWzlzChO_63CGQNQQfGyD-LY0Qpcc-ZGG5QZaQ"
          alt="Dr. Aris Thorne"
          className="h-20 w-20 rounded-full object-cover ring-4 ring-white/30"
        />
        <div>
          <span className="text-xs font-bold tracking-widest uppercase opacity-80">Member Profile</span>
          <h1 className="text-3xl font-extrabold">Dr. Aris Thorne</h1>
          <p className="mt-1 text-sm opacity-80">Hematology · Board Certified · ID #4829-X</p>
        </div>
        <button
          onClick={() => toast.success('Edit profile modal opened.')}
          className="ml-auto rounded-full bg-white/20 px-5 py-2.5 text-sm font-bold backdrop-blur-sm transition-all hover:bg-white/30"
        >
          Edit Profile
        </button>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Medical Info */}
        <section className="rounded-xl bg-surface-container-lowest p-6 shadow-[0_4px_16px_rgba(25,28,29,0.04)]">
          <h2 className="mb-6 flex items-center gap-2 text-sm font-bold tracking-widest text-on-surface-variant uppercase">
            <span className="material-symbols-outlined text-sm">medical_information</span> Medical Info
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-4">
              <span className="text-sm text-on-surface-variant">Blood Type</span>
              <span className="font-bold text-on-surface">O+</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-4">
              <span className="text-sm text-on-surface-variant">Allergies</span>
              <span className="font-bold text-error">Penicillin</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-4">
              <span className="text-sm text-on-surface-variant">Primary Physician</span>
              <span className="font-bold text-on-surface">Dr. R. Vasquez</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-4">
              <span className="text-sm text-on-surface-variant">Insurance</span>
              <span className="font-bold text-on-surface">MedShield Gold</span>
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
              <span className="text-sm text-on-surface-variant">Last Login</span>
              <span className="font-bold text-on-surface">2 hrs ago</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-4">
              <span className="text-sm text-on-surface-variant">Active Devices</span>
              <span className="font-bold text-primary">2 Devices</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-4">
              <div>
                <span className="text-sm font-semibold text-on-surface">Two-Factor Auth</span>
                <p className="text-xs text-on-surface-variant">{twoFactor ? 'Enabled' : 'Disabled'}</p>
              </div>
              <button
                onClick={handleToggle2FA}
                className={`relative h-7 w-12 rounded-full transition-colors duration-300 ${twoFactor ? 'bg-primary' : 'bg-outline-variant/30'}`}
              >
                <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-all duration-300 ${twoFactor ? 'left-5.5' : 'left-0.5'}`}></span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Access Logs */}
      <section className="mt-8 rounded-xl bg-surface-container-lowest p-6 shadow-[0_4px_16px_rgba(25,28,29,0.04)]">
        <h2 className="mb-6 flex items-center gap-2 text-sm font-bold tracking-widest text-on-surface-variant uppercase">
          <span className="material-symbols-outlined text-sm">history</span> Access Logs
        </h2>
        <div className="space-y-3">
          {accessLogs.map((log) => (
            <div key={log.id} className="flex items-center justify-between rounded-lg bg-surface-container-low p-4 transition-colors hover:bg-surface-container-high">
              <div className="flex items-center gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${log.status === 'BLOCKED' ? 'bg-error/10' : 'bg-primary/10'}`}>
                  <span className={`material-symbols-outlined text-lg ${log.status === 'BLOCKED' ? 'text-error' : 'text-primary'}`}>
                    {log.device.includes('iPhone') ? 'phone_iphone' : log.device.includes('Mac') ? 'laptop_mac' : 'devices_other'}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-bold text-on-surface">{log.device}</span>
                  <p className="text-xs text-on-surface-variant">{log.context}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-on-surface-variant">{log.time}</span>
                <p className={`text-[10px] font-bold tracking-wider uppercase ${log.status === 'BLOCKED' ? 'text-error' : 'text-tertiary'}`}>
                  {log.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Account Actions */}
      <section className="mt-8 rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-[0_4px_16px_rgba(25,28,29,0.04)]">
        <h2 className="mb-4 text-sm font-bold tracking-widest text-on-surface-variant uppercase">Account Security</h2>
        <p className="mb-6 text-sm text-on-surface-variant">Managing your security credentials and connected platforms.</p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => toast.success('Password change email sent.')}
            className="rounded-full bg-primary/10 px-5 py-2.5 text-xs font-bold text-primary transition-all hover:bg-primary/20"
          >
            Change Password
          </button>
          <button
            onClick={() => toast.success('All other sessions terminated.', { icon: '🔐' })}
            className="rounded-full bg-error/10 px-5 py-2.5 text-xs font-bold text-error transition-all hover:bg-error/20"
          >
            Log Out All Devices
          </button>
          <button
            onClick={() => toast.success('Connected apps view opened.')}
            className="rounded-full bg-surface-container-high px-5 py-2.5 text-xs font-bold text-on-surface-variant transition-all hover:bg-surface-container-highest"
          >
            Connected Apps
          </button>
        </div>
      </section>
    </div>
  );
}
