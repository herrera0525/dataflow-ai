import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  Zap,
  LayoutDashboard,
  Upload,
  Bot,
  History,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  User,
  CreditCard,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Upload, label: 'Upload', path: '/upload' },
  { icon: Bot, label: 'AI Assistant', path: '/assistant' },
  { icon: History, label: 'History', path: '/history' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { profile, company, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-slate-950">
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="h-full bg-gray-900/95 backdrop-blur-xl border-r border-white/5 flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-white" />
              </div>
              {!collapsed && (
                <span className="text-lg font-bold tracking-tight">
                  DataFlow<span className="text-blue-400">AI</span>
                </span>
              )}
            </Link>

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex w-6 h-6 rounded-lg bg-gray-800 items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white border border-blue-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-400' : ''}`} />
                  {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-3 border-t border-white/5">
            <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {profile?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {company?.name || 'Company'}
                  </p>
                </div>
              )}
            </div>

            {!collapsed && (
              <div className="mt-3 space-y-1">
                <Link
                  to="/settings/billing"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Billing</span>
                </Link>
                <button
                  onClick={signOut}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={`transition-all duration-300 ${collapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-gray-950/95 backdrop-blur-xl border-b border-white/5">
          <div className="h-full px-4 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-64 rounded-lg bg-gray-800/50 border border-gray-700 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
              </button>

              <div className="lg:hidden">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}