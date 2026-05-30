import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Clock,
  Zap,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Upload,
  Bot,
  ArrowUpRight,
  Activity,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface Stat {
  label: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ElementType;
  color: string;
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  created_at: string;
}

interface RecentDocument {
  id: string;
  filename: string;
  status: string;
  created_at: string;
  file_type: string;
}

const stats: Stat[] = [
  {
    label: 'Documents Today',
    value: '0',
    change: 'Start uploading',
    changeType: 'neutral',
    icon: FileText,
    color: 'blue',
  },
  {
    label: 'Time Saved',
    value: '0h',
    change: 'Accumulating',
    changeType: 'neutral',
    icon: Clock,
    color: 'cyan',
  },
  {
    label: 'Active Automations',
    value: '0',
    change: 'Ready to run',
    changeType: 'neutral',
    icon: Zap,
    color: 'yellow',
  },
  {
    label: 'Processing Rate',
    value: '99.5%',
    change: 'AI accuracy',
    changeType: 'positive',
    icon: TrendingUp,
    color: 'green',
  },
];

const colorClasses = {
  blue: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    icon: 'text-blue-400',
    gradient: 'from-blue-500/20 to-blue-600/20',
  },
  cyan: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    icon: 'text-cyan-400',
    gradient: 'from-cyan-500/20 to-cyan-600/20',
  },
  yellow: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    icon: 'text-yellow-400',
    gradient: 'from-yellow-500/20 to-yellow-600/20',
  },
  green: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    icon: 'text-green-400',
    gradient: 'from-green-500/20 to-green-600/20',
  },
};

export default function Dashboard() {
  const { company, profile } = useAuth();
  const [stats, setStats] = useState({
    documentsToday: 0,
    timeSaved: 0,
    activeAutomations: 0,
    accuracy: 99.5,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [recentDocuments, setRecentDocuments] = useState<RecentDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (company) {
      fetchDashboardData();
    }
  }, [company]);

  async function fetchDashboardData() {
    if (!company) return;

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [docsResult, automationsResult, activitiesResult, recentDocsResult] = await Promise.all([
        supabase
          .from('documents')
          .select('id', { count: 'exact' })
          .eq('company_id', company.id)
          .gte('created_at', today.toISOString()),
        supabase
          .from('automations')
          .select('time_saved_seconds, status')
          .eq('company_id', company.id),
        supabase
          .from('activities')
          .select('id, type, description, created_at')
          .eq('company_id', company.id)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('documents')
          .select('id, filename, status, created_at, file_type')
          .eq('company_id', company.id)
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      const documentsToday = docsResult.count || 0;
      const totalTimeSaved = automationsResult.data?.reduce((acc, a) => acc + (a.time_saved_seconds || 0), 0) || 0;
      const activeAutomations = automationsResult.data?.filter(a => a.status === 'running').length || 0;

      setStats({
        documentsToday,
        timeSaved: Math.floor(totalTimeSaved / 3600),
        activeAutomations,
        accuracy: 99.5,
      });
      setRecentActivities(activitiesResult.data || []);
      setRecentDocuments(recentDocsResult.data || []);
    } catch (error) {
      // Only log in development environment
      if (import.meta.env.DEV) {
        console.error('Error fetching dashboard data:', error);
      }
    } finally {
      setLoading(false);
    }
  }

  const statCards = [
    {
      label: 'Documents Today',
      value: stats.documentsToday,
      change: '+12%',
      icon: FileText,
      color: 'blue' as const,
    },
    {
      label: 'Time Saved',
      value: `${stats.timeSaved}h`,
      change: 'This week',
      icon: Clock,
      color: 'cyan' as const,
    },
    {
      label: 'Active Automations',
      value: stats.activeAutomations,
      change: 'Running now',
      icon: Zap,
      color: 'yellow' as const,
    },
    {
      label: 'AI Accuracy',
      value: `${stats.accuracy}%`,
      change: 'Processing rate',
      icon: TrendingUp,
      color: 'green' as const,
    },
  ];

  const quickActions = [
    { label: 'Upload Documents', icon: Upload, path: '/upload', color: 'blue' },
    { label: 'Start AI Chat', icon: Bot, path: '/assistant', color: 'cyan' },
    { label: 'View History', icon: Activity, path: '/history', color: 'yellow' },
  ];

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}
        </h1>
        <p className="text-gray-400">
          Here's what's happening with your data automation today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-6 rounded-2xl bg-gradient-to-br ${colorClasses[stat.color].gradient} border ${colorClasses[stat.color].border}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${colorClasses[stat.color].bg}`}>
                <stat.icon className={`w-5 h-5 ${colorClasses[stat.color].icon}`} />
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-500" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions & Activity */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <button
                key={action.label}
                className="w-full flex items-center gap-3 p-4 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-blue-500/50 transition-all duration-200 group"
              >
                <div className={`p-2 rounded-lg bg-${action.color}-500/20`}>
                  <action.icon className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 p-6 rounded-2xl bg-gray-900/50 border border-gray-800"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
          {recentActivities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Activity className="w-8 h-8 text-gray-600 mb-2" />
              <p className="text-gray-500">No recent activity</p>
              <p className="text-sm text-gray-600 mt-1">Activities will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-800/30 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">{activity.description}</p>
                    <p className="text-xs text-gray-500">{formatTime(activity.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Documents */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Recent Documents</h2>
          <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            View all
          </button>
        </div>

        {recentDocuments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
              <Upload className="w-7 h-7 text-gray-600" />
            </div>
            <p className="text-gray-400 mb-1">No documents uploaded yet</p>
            <p className="text-sm text-gray-500">Upload your first document to get started</p>
            <button className="mt-4 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm hover:bg-blue-500/30 transition-colors">
              Upload Document
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {recentDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 rounded-xl bg-gray-800/30 border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    doc.file_type === 'pdf' ? 'bg-red-500/20' :
                    doc.file_type === 'image' ? 'bg-green-500/20' :
                    doc.file_type === 'excel' ? 'bg-green-600/20' :
                    'bg-gray-700'
                  }`}>
                    <FileText className={`w-5 h-5 ${
                      doc.file_type === 'pdf' ? 'text-red-400' :
                      doc.file_type === 'image' ? 'text-green-400' :
                      doc.file_type === 'excel' ? 'text-green-500' :
                      'text-gray-400'
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white truncate max-w-xs">
                      {doc.filename}
                    </p>
                    <p className="text-xs text-gray-500">{formatTime(doc.created_at)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    doc.status === 'completed' ? 'bg-green-500/10 text-green-400 border border-green-500/30' :
                    doc.status === 'processing' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30' :
                    doc.status === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
                    'bg-gray-700 text-gray-400'
                  }`}>
                    {doc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}