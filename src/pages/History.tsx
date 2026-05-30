import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  History as HistoryIcon,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Filter,
  Search,
  Download,
  Eye,
  Trash2,
  ChevronDown,
  Calendar,
  Zap,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface Automation {
  id: string;
  type: string;
  name: string;
  status: string;
  documents_processed: number;
  time_saved_seconds: number;
  created_at: string;
  completed_at: string | null;
}

interface Document {
  id: string;
  filename: string;
  file_type: string;
  status: string;
  created_at: string;
}

type ViewType = 'automations' | 'documents';
type FilterStatus = 'all' | 'pending' | 'running' | 'completed' | 'failed';

const automationTypeLabels: Record<string, string> = {
  ocr_extract: 'OCR Extraction',
  form_fill: 'Form Auto-fill',
  invoice_process: 'Invoice Processing',
  email_organize: 'Email Organization',
  document_classify: 'Document Classification',
  data_convert: 'Data Conversion',
  report_generate: 'Report Generation',
};

export default function History() {
  const { company } = useAuth();
  const [view, setView] = useState<ViewType>('automations');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (company) {
      fetchData();
    }
  }, [company, view, statusFilter]);

  async function fetchData() {
    if (!company) return;

    setLoading(true);

    try {
      if (view === 'automations') {
        let query = supabase
          .from('automations')
          .select('*')
          .eq('company_id', company.id)
          .order('created_at', { ascending: false });

        if (statusFilter !== 'all') {
          query = query.eq('status', statusFilter);
        }

        const { data } = await query;
        setAutomations(data || []);
      } else {
        let query = supabase
          .from('documents')
          .select('*')
          .eq('company_id', company.id)
          .order('created_at', { ascending: false });

        if (statusFilter !== 'all') {
          query = query.eq('status', statusFilter);
        }

        const { data } = await query;
        setDocuments(data || []);
      }
    } catch (error) {
      // Only log in development environment
      if (import.meta.env.DEV) {
        console.error('Error fetching data:', error);
      }
    } finally {
      setLoading(false);
    }
  }

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'running':
      case 'processing':
        return <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />;
      case 'failed':
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      completed: 'bg-green-500/10 text-green-400 border-green-500/30',
      running: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
      processing: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      pending: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
      failed: 'bg-red-500/10 text-red-400 border-red-500/30',
      error: 'bg-red-500/10 text-red-400 border-red-500/30',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colors[status] || colors.pending}`}>
        {status}
      </span>
    );
  };

  const filteredData = view === 'automations'
    ? automations.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : documents.filter(d => d.filename.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">History</h1>
        <p className="text-gray-400">
          View your automation history and processed documents.
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 mb-6"
      >
        <button
          onClick={() => { setView('automations'); setStatusFilter('all'); }}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            view === 'automations'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
              : 'bg-gray-800/50 text-gray-400 hover:text-white border border-gray-700'
          }`}
        >
          <Zap className="w-4 h-4 inline mr-2" />
          Automations
        </button>
        <button
          onClick={() => { setView('documents'); setStatusFilter('all'); }}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            view === 'documents'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
              : 'bg-gray-800/50 text-gray-400 hover:text-white border border-gray-700'
          }`}
        >
          <FileText className="w-4 h-4 inline mr-2" />
          Documents
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-4 mb-6"
      >
        {/* Search */}
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder={`Search ${view}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
            className="pl-11 pr-10 py-2.5 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:border-blue-500 appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
      </motion.div>

      {/* Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-gray-900/50 border border-gray-800 overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
              <HistoryIcon className="w-7 h-7 text-gray-600" />
            </div>
            <p className="text-gray-400 mb-1">No {view} found</p>
            <p className="text-sm text-gray-500">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : `Start processing to see ${view} here`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">
                    {view === 'automations' ? 'Automation' : 'Document'}
                  </th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">
                    Status
                  </th>
                  {view === 'automations' && (
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">
                      Processed
                    </th>
                  )}
                  {view === 'automations' && (
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">
                      Time Saved
                    </th>
                  )}
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">
                    Date
                  </th>
                  <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {(view === 'automations' ? automations : documents).map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          view === 'automations'
                            ? 'bg-yellow-500/10'
                            : (item as Document).file_type === 'pdf'
                            ? 'bg-red-500/10'
                            : (item as Document).file_type === 'image'
                            ? 'bg-green-500/10'
                            : 'bg-blue-500/10'
                        }`}>
                          {view === 'automations' ? (
                            <Zap className="w-4 h-4 text-yellow-400" />
                          ) : (
                            <FileText className="w-4 h-4 text-blue-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {view === 'automations'
                              ? (item as Automation).name
                              : (item as Document).filename}
                          </p>
                          <p className="text-xs text-gray-500">
                            {view === 'automations'
                              ? automationTypeLabels[(item as Automation).type] || (item as Automation).type
                              : (item as Document).file_type.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(item.status)}
                    </td>
                    {view === 'automations' && (
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-300">
                          {(item as Automation).documents_processed || 0} docs
                        </span>
                      </td>
                    )}
                    {view === 'automations' && (
                      <td className="px-6 py-4">
                        <span className="text-sm text-green-400">
                          {formatDuration((item as Automation).time_saved_seconds || 0)}
                        </span>
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-400">
                        {formatDate(item.created_at)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Stats Summary */}
      {view === 'automations' && automations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800">
            <p className="text-sm text-gray-400 mb-1">Total Automations</p>
            <p className="text-2xl font-bold text-white">{automations.length}</p>
          </div>
          <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800">
            <p className="text-sm text-gray-400 mb-1">Total Time Saved</p>
            <p className="text-2xl font-bold text-green-400">
              {formatDuration(automations.reduce((acc, a) => acc + (a.time_saved_seconds || 0), 0))}
            </p>
          </div>
          <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800">
            <p className="text-sm text-gray-400 mb-1">Success Rate</p>
            <p className="text-2xl font-bold text-white">
              {automations.length > 0
                ? `${Math.round((automations.filter(a => a.status === 'completed').length / automations.length) * 100)}%`
                : '0%'}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}