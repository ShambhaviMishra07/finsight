import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import PageWrapper from '../components/PageWrapper';
import { motion } from 'framer-motion';
import {
  User, Lock, Bell, Palette, LogOut,
  Camera, Check, Eye, EyeOff, Shield,
  Trash2, Download, Moon, Sun, ChevronRight
} from 'lucide-react';
import api from '../api/axiosInstance';

const styles = `
  .settings-root {
    font-family: 'Inter', sans-serif;
    max-width: 860px;
  }

  /* Layout */
  .settings-layout {
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 20px;
    align-items: start;
  }

  /* Sidebar nav */
  .settings-nav {
    background: rgba(255,255,255,0.72);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.55);
    border-radius: 16px;
    padding: 8px;
    box-shadow: 0 4px 24px rgba(26,60,46,0.07);
    position: sticky;
    top: 24px;
  }
  .dark .settings-nav {
    background: rgba(26,48,36,0.55);
    border-color: rgba(255,255,255,0.08);
  }
  .settings-nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    color: #6B7280;
    transition: all 0.15s;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
  }
  .settings-nav-item:hover {
    background: rgba(26,60,46,0.06);
    color: #1A3C2E;
  }
  .dark .settings-nav-item:hover {
    background: rgba(255,255,255,0.07);
    color: #86EFAC;
  }
  .settings-nav-item.active {
    background: rgba(26,60,46,0.10);
    color: #1A3C2E;
    font-weight: 600;
  }
  .dark .settings-nav-item.active {
    background: rgba(255,255,255,0.10);
    color: #86EFAC;
  }
  .settings-nav-divider {
    height: 1px;
    background: rgba(0,0,0,0.06);
    margin: 6px 4px;
  }
  .dark .settings-nav-divider { background: rgba(255,255,255,0.07); }
  .settings-nav-item.danger { color: #EF4444; }
  .settings-nav-item.danger:hover { background: rgba(239,68,68,0.08); color: #EF4444; }

  /* Content panels */
  .settings-panel {
    background: rgba(255,255,255,0.72);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.55);
    border-radius: 16px;
    padding: 28px;
    box-shadow: 0 4px 24px rgba(26,60,46,0.07);
  }
  .dark .settings-panel {
    background: rgba(26,48,36,0.55);
    border-color: rgba(255,255,255,0.08);
  }
  .settings-panel-title {
    font-size: 16px;
    font-weight: 600;
    color: #1C1C1C;
    margin-bottom: 4px;
  }
  .dark .settings-panel-title { color: #F0F4F0; }
  .settings-panel-sub {
    font-size: 13px;
    color: #6B7280;
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(0,0,0,0.06);
  }
  .dark .settings-panel-sub {
    color: #9CA3AF;
    border-color: rgba(255,255,255,0.07);
  }

  /* Avatar upload */
  .avatar-section {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 28px;
  }
  .avatar-wrap {
    position: relative;
    cursor: pointer;
  }
  .avatar-img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid rgba(26,60,46,0.15);
  }
  .avatar-placeholder {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1A3C2E, #2D5A42);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    font-weight: 700;
    color: #fff;
    border: 3px solid rgba(26,60,46,0.15);
  }
  .avatar-overlay {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: rgba(0,0,0,0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
  }
  .avatar-wrap:hover .avatar-overlay { opacity: 1; }
  .avatar-info { font-size: 12px; color: #9CA3AF; margin-top: 4px; }

  /* Form fields */
  .field-group { margin-bottom: 18px; }
  .field-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #6B7280;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: 7px;
  }
  .dark .field-label { color: #9CA3AF; }
  .field-input {
    width: 100%;
    border: 1.5px solid #E5E7EB;
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 14px;
    color: #1C1C1C;
    background: #fff;
    outline: none;
    transition: border-color 0.15s;
    font-family: 'Inter', sans-serif;
  }
  .field-input:focus { border-color: #1A3C2E; }
  .dark .field-input {
    background: rgba(255,255,255,0.06);
    border-color: rgba(255,255,255,0.12);
    color: #F0F4F0;
  }
  .dark .field-input:focus { border-color: #4ADE80; }
  .field-input:disabled {
    background: #F9FAFB;
    color: #9CA3AF;
    cursor: not-allowed;
  }
  .dark .field-input:disabled {
    background: rgba(255,255,255,0.03);
    color: #6B7280;
  }
  .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .password-wrap { position: relative; }
  .password-eye {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: #9CA3AF;
    padding: 2px;
  }
  .password-eye:hover { color: #6B7280; }

  /* Buttons */
  .btn-save {
    background: #1A3C2E;
    color: #fff;
    border: none;
    padding: 10px 22px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s;
    display: flex;
    align-items: center;
    gap: 7px;
    font-family: 'Inter', sans-serif;
  }
  .btn-save:hover { background: #2D5A42; transform: translateY(-1px); }
  .btn-save:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .btn-outline {
    background: transparent;
    color: #1A3C2E;
    border: 1.5px solid #1A3C2E;
    padding: 10px 22px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    gap: 7px;
    font-family: 'Inter', sans-serif;
  }
  .btn-outline:hover { background: rgba(26,60,46,0.06); }
  .dark .btn-outline { color: #86EFAC; border-color: #86EFAC; }
  .btn-danger {
    background: transparent;
    color: #EF4444;
    border: 1.5px solid #EF4444;
    padding: 10px 22px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    gap: 7px;
    font-family: 'Inter', sans-serif;
  }
  .btn-danger:hover { background: rgba(239,68,68,0.08); }
  .btn-row { display: flex; gap: 10px; margin-top: 20px; flex-wrap: wrap; }

  /* Toggle switch */
  .toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 0;
    border-bottom: 1px solid rgba(0,0,0,0.05);
  }
  .dark .toggle-row { border-color: rgba(255,255,255,0.06); }
  .toggle-row:last-child { border-bottom: none; }
  .toggle-label { font-size: 14px; font-weight: 500; color: #1C1C1C; }
  .dark .toggle-label { color: #F0F4F0; }
  .toggle-sub { font-size: 12px; color: #9CA3AF; margin-top: 2px; }
  .toggle-switch {
    width: 44px; height: 24px;
    border-radius: 99px;
    border: none;
    cursor: pointer;
    position: relative;
    transition: background 0.2s;
    flex-shrink: 0;
  }
  .toggle-switch.on  { background: #1A3C2E; }
  .toggle-switch.off { background: #D1D5DB; }
  .toggle-knob {
    position: absolute;
    top: 3px;
    width: 18px; height: 18px;
    border-radius: 50%;
    background: #fff;
    transition: left 0.2s;
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  }
  .toggle-knob.on  { left: 23px; }
  .toggle-knob.off { left: 3px; }

  /* Success toast */
  .toast {
    position: fixed;
    bottom: 28px;
    left: 50%;
    transform: translateX(-50%);
    background: #1A3C2E;
    color: #fff;
    padding: 12px 22px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 8px 24px rgba(26,60,46,0.3);
    z-index: 999;
  }

  /* Danger zone */
  .danger-zone {
    border: 1.5px solid rgba(239,68,68,0.3);
    border-radius: 12px;
    padding: 20px;
    margin-top: 8px;
  }
  .danger-zone-title {
    font-size: 14px;
    font-weight: 600;
    color: #EF4444;
    margin-bottom: 6px;
  }
  .danger-zone-sub {
    font-size: 13px;
    color: #9CA3AF;
    margin-bottom: 16px;
  }

  /* Info row */
  .info-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 13px 0;
    border-bottom: 1px solid rgba(0,0,0,0.05);
  }
  .dark .info-row { border-color: rgba(255,255,255,0.06); }
  .info-row:last-child { border-bottom: none; }
  .info-key { font-size: 13px; color: #6B7280; }
  .dark .info-key { color: #9CA3AF; }
  .info-val { font-size: 13px; font-weight: 500; color: #1C1C1C; }
  .dark .info-val { color: #F0F4F0; }

  @media (max-width: 720px) {
    .settings-layout { grid-template-columns: 1fr; }
    .settings-nav { position: static; display: flex; flex-wrap: wrap; gap: 4px; padding: 8px; }
    .settings-nav-item { width: auto; }
    .settings-nav-divider { display: none; }
    .field-row { grid-template-columns: 1fr; }
  }
`;

// ── Toggle ────────────────────────────────────────────────────
function Toggle({ on, onClick }) {
  return (
    <button className={`toggle-switch ${on ? 'on' : 'off'}`} onClick={onClick}>
      <div className={`toggle-knob ${on ? 'on' : 'off'}`} />
    </button>
  );
}

// ── Toast ─────────────────────────────────────────────────────
function Toast({ msg }) {
  return (
    <motion.div
      className="toast"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
    >
      <Check size={15} /> {msg}
    </motion.div>
  );
}

// ── Sections ──────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'profile',      icon: User,     label: 'Profile'      },
  { id: 'security',     icon: Lock,     label: 'Security'     },
  { id: 'appearance',   icon: Palette,  label: 'Appearance'   },
  { id: 'notifications',icon: Bell,     label: 'Notifications'},
  { id: 'account',      icon: Shield,   label: 'Account'      },
];

export default function Settings() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();

  const [active,   setActive]  = useState('profile');
  const [toast,    setToast]   = useState('');
  const [saving,   setSaving]  = useState(false);
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });

  // Profile form
  const [profile, setProfile] = useState({
    name:  user?.name  || '',
    email: user?.email || '',
    phone: '',
    bio:   '',
  });

  // Password form
  const [passwords, setPasswords] = useState({
    current: '', new: '', confirm: '',
  });

  // Notification prefs
  const [notifs, setNotifs] = useState({
    budgetAlerts:    true,
    weeklyReport:    true,
    transactionPush: false,
    emailDigest:     true,
  });

  // Avatar
  const [avatar, setAvatar]     = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const fileRef = useRef();

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatar(file);
    setAvatarUrl(URL.createObjectURL(file));
  };

  const handleProfileSave = async () => {
    setSaving(true);
    try {
      // In a real app: await api.put('/auth/profile', profile);
      await new Promise(r => setTimeout(r, 800)); // simulate
      showToast('Profile updated successfully');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async () => {
    if (passwords.new !== passwords.confirm) {
      showToast('New passwords do not match');
      return;
    }
    if (passwords.new.length < 6) {
      showToast('Password must be at least 6 characters');
      return;
    }
    setSaving(true);
    try {
      // await api.put('/auth/password', { current: passwords.current, new: passwords.new });
      await new Promise(r => setTimeout(r, 800));
      setPasswords({ current: '', new: '', confirm: '' });
      showToast('Password changed successfully');
    } finally {
      setSaving(false);
    }
  };

  const initials = user?.name
    ?.split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // ── Panel renderers ────────────────────────────────────────
  const panels = {

    profile: (
      <div>
        <div className="settings-panel-title">Profile</div>
        <div className="settings-panel-sub">Update your name, email, and profile picture.</div>

        {/* Avatar */}
        <div className="avatar-section">
          <div className="avatar-wrap" onClick={() => fileRef.current.click()}>
            {avatarUrl
              ? <img src={avatarUrl} alt="avatar" className="avatar-img" />
              : <div className="avatar-placeholder">{initials}</div>
            }
            <div className="avatar-overlay">
              <Camera size={20} color="#fff" />
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#1C1C1C' }} className="dark-text">
              {user?.name}
            </div>
            <div className="avatar-info">Click avatar to upload a new photo</div>
            <div className="avatar-info">JPG, PNG or WebP · Max 2MB</div>
          </div>
        </div>

        {/* Fields */}
        <div className="field-row">
          <div className="field-group">
            <label className="field-label">Full name</label>
            <input className="field-input" value={profile.name}
              onChange={e => setProfile({ ...profile, name: e.target.value })} placeholder="Your name" />
          </div>
          <div className="field-group">
            <label className="field-label">Email</label>
            <input className="field-input" type="email" value={profile.email}
              onChange={e => setProfile({ ...profile, email: e.target.value })} placeholder="you@example.com" />
          </div>
        </div>

        <div className="field-row">
          <div className="field-group">
            <label className="field-label">Phone (optional)</label>
            <input className="field-input" value={profile.phone}
              onChange={e => setProfile({ ...profile, phone: e.target.value })} placeholder="+91 98765 43210" />
          </div>
          <div className="field-group">
            <label className="field-label">Currency</label>
            <select className="field-input" style={{ colorScheme: 'light dark', cursor: 'pointer' }}>
              <option>₹ Indian Rupee (INR)</option>
              <option>$ US Dollar (USD)</option>
              <option>€ Euro (EUR)</option>
              <option>£ British Pound (GBP)</option>
            </select>
          </div>
        </div>

        <div className="field-group">
          <label className="field-label">Bio (optional)</label>
          <textarea className="field-input" rows={3} value={profile.bio}
            onChange={e => setProfile({ ...profile, bio: e.target.value })}
            placeholder="A short note about yourself..."
            style={{ resize: 'vertical', lineHeight: 1.6 }}
          />
        </div>

        <div className="btn-row">
          <button className="btn-save" onClick={handleProfileSave} disabled={saving}>
            {saving ? 'Saving...' : <><Check size={14} /> Save changes</>}
          </button>
        </div>
      </div>
    ),

    security: (
      <div>
        <div className="settings-panel-title">Security</div>
        <div className="settings-panel-sub">Change your password and manage account access.</div>

        <div className="field-group">
          <label className="field-label">Current password</label>
          <div className="password-wrap">
            <input className="field-input" type={showPass.current ? 'text' : 'password'}
              value={passwords.current}
              onChange={e => setPasswords({ ...passwords, current: e.target.value })}
              placeholder="Enter current password"
              style={{ paddingRight: 40 }}
            />
            <button className="password-eye" onClick={() => setShowPass(p => ({ ...p, current: !p.current }))}>
              {showPass.current ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="field-row">
          <div className="field-group">
            <label className="field-label">New password</label>
            <div className="password-wrap">
              <input className="field-input" type={showPass.new ? 'text' : 'password'}
                value={passwords.new}
                onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                placeholder="Min. 6 characters"
                style={{ paddingRight: 40 }}
              />
              <button className="password-eye" onClick={() => setShowPass(p => ({ ...p, new: !p.new }))}>
                {showPass.new ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="field-group">
            <label className="field-label">Confirm new password</label>
            <div className="password-wrap">
              <input className="field-input" type={showPass.confirm ? 'text' : 'password'}
                value={passwords.confirm}
                onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                placeholder="Repeat new password"
                style={{ paddingRight: 40 }}
              />
              <button className="password-eye" onClick={() => setShowPass(p => ({ ...p, confirm: !p.confirm }))}>
                {showPass.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        <div className="btn-row">
          <button className="btn-save" onClick={handlePasswordSave} disabled={saving}>
            {saving ? 'Updating...' : <><Lock size={14} /> Update password</>}
          </button>
        </div>

        {/* Session info */}
        <div style={{ marginTop: 28 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#6B7280', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Session Info
          </div>
          <div className="info-row">
            <span className="info-key">Signed in as</span>
            <span className="info-val">{user?.email}</span>
          </div>
          <div className="info-row">
            <span className="info-key">Auth method</span>
            <span className="info-val">Email & Password (JWT)</span>
          </div>
          <div className="info-row">
            <span className="info-key">Token expires</span>
            <span className="info-val">7 days from login</span>
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          <button className="btn-danger" onClick={logout}>
            <LogOut size={14} /> Sign out of all devices
          </button>
        </div>
      </div>
    ),

    appearance: (
      <div>
        <div className="settings-panel-title">Appearance</div>
        <div className="settings-panel-sub">Personalise how Finsight looks for you.</div>

        <div className="toggle-row">
          <div>
            <div className="toggle-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {dark ? <Moon size={15} /> : <Sun size={15} />}
              Dark mode
            </div>
            <div className="toggle-sub">Switch between light and dark theme</div>
          </div>
          <Toggle on={dark} onClick={toggle} />
        </div>

        {/* Theme preview */}
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 14 }}>
            Color Accent
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { color: '#1A3C2E', label: 'Forest (default)' },
              { color: '#1E40AF', label: 'Ocean' },
              { color: '#7C3AED', label: 'Violet' },
              { color: '#B45309', label: 'Amber' },
              { color: '#9D174D', label: 'Rose' },
            ].map((t) => (
              <div key={t.color} title={t.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: t.color, cursor: 'pointer',
                  border: t.color === '#1A3C2E' ? '3px solid #C9A84C' : '3px solid transparent',
                  transition: 'transform 0.15s',
                }} />
                <span style={{ fontSize: 10, color: '#9CA3AF' }}>{t.label.split(' ')[0]}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 10 }}>
            Theme colour switching coming in a future update.
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 14 }}>
            Dashboard Density
          </div>
          {['Comfortable (default)', 'Compact', 'Spacious'].map((d) => (
            <label key={d} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, cursor: 'pointer' }}>
              <input type="radio" name="density" defaultChecked={d.includes('default')}
                style={{ accentColor: '#1A3C2E' }} />
              <span style={{ fontSize: 14, color: '#1C1C1C' }} className="dark-text">{d}</span>
            </label>
          ))}
        </div>
      </div>
    ),

    notifications: (
      <div>
        <div className="settings-panel-title">Notifications</div>
        <div className="settings-panel-sub">Control what alerts and emails you receive.</div>

        {[
          { key: 'budgetAlerts',    label: 'Budget alerts',        sub: 'Get notified when you exceed 75% of a budget' },
          { key: 'weeklyReport',    label: 'Weekly summary',       sub: 'Receive a weekly spending report every Monday' },
          { key: 'transactionPush', label: 'Transaction push',     sub: 'Notification for every new transaction added'  },
          { key: 'emailDigest',     label: 'Monthly email digest', sub: 'A full monthly breakdown sent to your email'    },
        ].map(({ key, label, sub }) => (
          <div key={key} className="toggle-row">
            <div>
              <div className="toggle-label">{label}</div>
              <div className="toggle-sub">{sub}</div>
            </div>
            <Toggle on={notifs[key]} onClick={() => setNotifs(n => ({ ...n, [key]: !n[key] }))} />
          </div>
        ))}

        <div className="btn-row">
          <button className="btn-save" onClick={() => showToast('Notification preferences saved')}>
            <Check size={14} /> Save preferences
          </button>
        </div>
      </div>
    ),

    account: (
      <div>
        <div className="settings-panel-title">Account</div>
        <div className="settings-panel-sub">Manage your account data and connected services.</div>

        {/* Account info */}
        <div style={{ marginBottom: 24 }}>
          <div className="info-row">
            <span className="info-key">Account name</span>
            <span className="info-val">{user?.name}</span>
          </div>
          <div className="info-row">
            <span className="info-key">Email address</span>
            <span className="info-val">{user?.email}</span>
          </div>
          <div className="info-row">
            <span className="info-key">Account type</span>
            <span className="info-val">Free plan</span>
          </div>
          <div className="info-row">
            <span className="info-key">Member since</span>
            <span className="info-val">{new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Data actions */}
        <div style={{ fontSize: 13, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 14 }}>
          Your Data
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
          <button className="btn-outline" onClick={() => showToast('Export started — CSV will download shortly')}>
            <Download size={14} /> Export transactions (CSV)
          </button>
        </div>

        {/* Sign out */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 14 }}>
            Session
          </div>
          <button className="btn-outline" onClick={logout}>
            <LogOut size={14} /> Sign out
          </button>
        </div>

        {/* Danger zone */}
        <div className="danger-zone">
          <div className="danger-zone-title">⚠ Danger zone</div>
          <div className="danger-zone-sub">
            These actions are permanent and cannot be undone.
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn-danger" onClick={() => showToast('All transactions cleared')}>
              <Trash2 size={14} /> Clear all transactions
            </button>
            <button className="btn-danger" onClick={() => {
              if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
                logout();
              }
            }}>
              <Trash2 size={14} /> Delete account
            </button>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <PageWrapper>
      <style>{styles}</style>
      <div className="settings-root">
        <div className="settings-layout">

          {/* Sidebar nav */}
          <nav className="settings-nav">
            {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
              <button key={id} className={`settings-nav-item ${active === id ? 'active' : ''}`}
                onClick={() => setActive(id)}>
                <Icon size={15} />
                {label}
                {active === id && <ChevronRight size={13} style={{ marginLeft: 'auto' }} />}
              </button>
            ))}
            <div className="settings-nav-divider" />
            <button className="settings-nav-item danger" onClick={logout}>
              <LogOut size={15} /> Sign out
            </button>
          </nav>

          {/* Active panel */}
          <motion.div
            key={active}
            className="settings-panel"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
          >
            {panels[active]}
          </motion.div>
        </div>
      </div>

      {/* Toast */}
      {toast && <Toast msg={toast} />}
    </PageWrapper>
  );
}