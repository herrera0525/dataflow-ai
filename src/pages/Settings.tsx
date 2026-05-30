import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  User,
  Building2,
  CreditCard,
  Shield,
  Bell,
  Globe,
  Save,
  Camera,
  Mail,
  Lock,
  Users,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type SettingsTab = 'profile' | 'company' | 'billing' | 'security' | 'notifications';

export default function Settings() {
  const { profile, company, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    email: '',
    company_name: company?.name || '',
    notifications_email: true,
    notifications_push: true,
    language: 'en',
    timezone: 'UTC',
  });

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSaved(false);

    try {
      const { error } = await updateProfile({
        full_name: formData.full_name,
      });

      if (error) throw error;

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'company' as const, label: 'Company', icon: Building2 },
    { id: 'billing' as const, label: 'Billing', icon: CreditCard },
    { id: 'security' as const, label: 'Security', icon: Shield },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">
          Manage your account settings and preferences.
        </p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:w-64 flex-shrink-0"
        >
          <div className="rounded-xl bg-gray-900/50 border border-gray-800 overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-500/10 text-blue-400 border-l-2 border-blue-500'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1"
        >
          <div className="rounded-2xl bg-gray-900/50 border border-gray-800 p-6 lg:p-8">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-1">Profile Settings</h2>
                  <p className="text-sm text-gray-400">Update your personal information</p>
                </div>

                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <button className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-2">
                      <Camera className="w-4 h-4" />
                      Change Avatar
                    </button>
                    <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>

                {/* Form */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="email"
                        disabled
                        value={profile?.id || ''}
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-gray-400 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      disabled
                      value={profile?.role || 'worker'}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-gray-400 uppercase cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Language
                    </label>
                    <select
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-blue-500 appearance-none cursor-pointer"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'company' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-1">Company Settings</h2>
                  <p className="text-sm text-gray-400">Manage your company information</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Current Plan
                    </label>
                    <div className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-between">
                      <span className="text-white capitalize">{company?.plan || 'Free'}</span>
                      <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                        Upgrade
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Team Members
                    </label>
                    <div className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-between">
                      <span className="text-white">1 / {company?.max_employees || 5}</span>
                      <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        Invite
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Automations Used
                    </label>
                    <div className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-between">
                      <span className="text-white">0 / {company?.max_automations || 100}</span>
                      <span className="text-xs text-gray-400">This month</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-1">Billing & Subscription</h2>
                  <p className="text-sm text-gray-400">Manage your subscription and payment methods</p>
                </div>

                {/* Current Plan */}
                <div className="p-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Current Plan</p>
                      <p className="text-2xl font-bold text-white capitalize">{company?.plan || 'Free'}</p>
                      <p className="text-sm text-gray-400 mt-2">
                        {company?.plan === 'free'
                          ? '100 documents/month'
                          : company?.plan === 'pro'
                          ? '5,000 documents/month'
                          : 'Unlimited documents'}
                      </p>
                    </div>
                    <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all">
                      Upgrade Plan
                    </button>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-3">Payment Method</h3>
                  <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 rounded bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center text-white text-xs font-bold">
                        VISA
                      </div>
                      <div>
                        <p className="text-sm text-white">**** **** **** 4242</p>
                        <p className="text-xs text-gray-500">Expires 12/25</p>
                      </div>
                    </div>
                    <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                      Update
                    </button>
                  </div>
                </div>

                {/* Usage */}
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-3">Usage This Month</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-400">Documents Processed</span>
                        <span className="text-white">0 / {company?.plan === 'pro' ? '5,000' : company?.plan === 'enterprise' ? '∞' : '100'}</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 w-0" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-400">AI Processing</span>
                        <span className="text-white">0 minutes</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 w-0" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-1">Security Settings</h2>
                  <p className="text-sm text-gray-400">Update your password and security preferences</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="password"
                        placeholder="Enter current password"
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="password"
                        placeholder="Enter new password"
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <button className="px-6 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors">
                  Update Password
                </button>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-1">Notification Preferences</h2>
                  <p className="text-sm text-gray-400">Choose how you want to be notified</p>
                </div>

                <div className="space-y-4">
                  {[
                    { id: 'email', label: 'Email Notifications', description: 'Receive email updates about your automations' },
                    { id: 'push', label: 'Push Notifications', description: 'Get push notifications in your browser' },
                    { id: 'marketing', label: 'Marketing Emails', description: 'Receive news and product updates' },
                    { id: 'weekly', label: 'Weekly Summary', description: 'Get a weekly report of your activity' },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                      <div>
                        <p className="text-sm font-medium text-white">{item.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Save Button */}
            {(activeTab === 'profile' || activeTab === 'company') && (
              <>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <p className="text-sm text-red-400">{error}</p>
                  </motion.div>
                )}

                {saved && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-2"
                  >
                    <Check className="w-5 h-5 text-green-400" />
                    <p className="text-sm text-green-400">Changes saved successfully!</p>
                  </motion.div>
                )}

                <div className="mt-8 pt-6 border-t border-gray-800 flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}