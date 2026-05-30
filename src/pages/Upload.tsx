import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload as UploadIcon,
  FileText,
  Image,
  FileSpreadsheet,
  File,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

const acceptedTypes = {
  'application/pdf': { label: 'PDF', icon: FileText, color: 'red' },
  'image/png': { label: 'PNG', icon: Image, color: 'green' },
  'image/jpeg': { label: 'JPEG', icon: Image, color: 'green' },
  'image/jpg': { label: 'JPG', icon: Image, color: 'green' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { label: 'Excel', icon: FileSpreadsheet, color: 'green' },
  'application/vnd.ms-excel': { label: 'Excel', icon: FileSpreadsheet, color: 'green' },
  'text/csv': { label: 'CSV', icon: FileSpreadsheet, color: 'cyan' },
};

const automationTypes = [
  { id: 'ocr_extract', label: 'Extract Text (OCR)', description: 'Extract text from images and scanned documents' },
  { id: 'invoice_process', label: 'Process Invoices', description: 'Extract invoice data and organize it' },
  { id: 'document_classify', label: 'Classify Documents', description: 'Automatically categorize documents' },
  { id: 'data_convert', label: 'Convert Data', description: 'Convert between formats (PDF to Excel, etc)' },
  { id: 'form_fill', label: 'Auto-fill Forms', description: 'Extract data and fill form fields' },
];

export default function Upload() {
  const { company, user } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadingFile[]>([]);
  const [selectedAutomation, setSelectedAutomation] = useState('ocr_extract');
  const [processing, setProcessing] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const getFileType = (file: File): 'pdf' | 'image' | 'excel' | 'csv' | 'other' => {
    if (file.type === 'application/pdf') return 'pdf';
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.includes('excel') || file.type.includes('spreadsheet')) return 'excel';
    if (file.type === 'text/csv') return 'csv';
    return 'other';
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  };

  const sanitizeFilename = (filename: string): string => {
    // Remove any path components and sanitize the filename
    return filename
      .split(/[\\/]/).pop() || 'file'
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .substring(0, 255);
  };

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => file.type in acceptedTypes || file.name.endsWith('.csv'));

    const uploadingFiles: UploadingFile[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'uploading',
    }));

    setFiles(prev => [...prev, ...uploadingFiles]);

    uploadingFiles.forEach((uf) => {
      simulateUpload(uf.id);
    });
  };

  const simulateUpload = async (fileId: string) => {
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setFiles(prev =>
        prev.map(f =>
          f.id === fileId ? { ...f, progress: i } : f
        )
      );
    }

    setFiles(prev =>
      prev.map(f =>
        f.id === fileId ? { ...f, status: 'processing', progress: 100 } : f
      )
    );
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const processFiles = async () => {
    if (!company || !user || files.length === 0) return;

    const filesToProcess = files.filter(f => f.status === 'processing');
    if (filesToProcess.length === 0) return;

    setProcessing(true);

    try {
      for (const uf of filesToProcess) {
        const fileType = getFileType(uf.file);
        const sanitizedFilename = sanitizeFilename(uf.file.name);

        const { error: docError } = await supabase
          .from('documents')
          .insert({
            company_id: company.id,
            uploaded_by: user.id,
            filename: sanitizedFilename,
            file_type: fileType,
            file_size: uf.file.size,
            status: 'pending',
          });

        if (docError) throw docError;

        await supabase
          .from('automations')
          .insert({
            company_id: company.id,
            created_by: user.id,
            type: selectedAutomation as any,
            name: `Process ${sanitizedFilename}`,
            status: 'pending',
          });

        await supabase
          .from('activities')
          .insert({
            company_id: company.id,
            user_id: user.id,
            type: 'upload',
            description: `Uploaded ${sanitizedFilename} for ${automationTypes.find(a => a.id === selectedAutomation)?.label}`,
          });

        setFiles(prev =>
          prev.map(f =>
            f.id === uf.id ? { ...f, status: 'completed' } : f
          )
        );
      }
    } catch (error) {
      // Only log in development environment
      if (import.meta.env.DEV) {
        console.error('Error processing files:', error);
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Upload Documents</h1>
        <p className="text-gray-400">
          Upload files to process with AI. Drag and drop or click to select.
        </p>
      </motion.div>

      {/* Automation Type Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Select Automation Type
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {automationTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedAutomation(type.id)}
              className={`p-4 rounded-xl text-left transition-all ${
                selectedAutomation === type.id
                  ? 'bg-blue-500/20 border-blue-500/50 border'
                  : 'bg-gray-800/50 border border-gray-700 hover:border-gray-600'
              }`}
            >
              <p className="font-medium text-white">{type.label}</p>
              <p className="text-xs text-gray-400 mt-1">{type.description}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Drop Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`relative p-12 rounded-2xl border-2 border-dashed transition-all duration-300 ${
          isDragging
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-gray-700 bg-gray-900/30 hover:border-gray-600'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls,.csv"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="text-center">
          <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
            isDragging ? 'bg-blue-500/20' : 'bg-gray-800'
          }`}>
            <UploadIcon className={`w-7 h-7 ${isDragging ? 'text-blue-400' : 'text-gray-400'}`} />
          </div>

          <p className="text-lg font-medium text-white mb-2">
            {isDragging ? 'Drop files here' : 'Drag and drop files here'}
          </p>
          <p className="text-sm text-gray-400 mb-4">
            or click to browse from your computer
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            {Object.entries(acceptedTypes).map(([type, config]) => (
              <span
                key={type}
                className="px-3 py-1 rounded-full bg-gray-800 text-xs text-gray-400"
              >
                {config.label}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">
                Files ({files.length})
              </h3>
              {files.some(f => f.status === 'processing') && (
                <button
                  onClick={processFiles}
                  disabled={processing}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Process with AI
                      <UploadIcon className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="space-y-3">
              {files.map((file) => {
                const config = acceptedTypes[file.file.type as keyof typeof acceptedTypes] || {
                  icon: File,
                  color: 'gray',
                };
                const Icon = config.icon;

                return (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/50 border border-gray-700"
                  >
                    <div className={`p-3 rounded-lg bg-${config.color}-500/20`}>
                      <Icon className={`w-5 h-5 text-${config.color}-400`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {file.file.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-500">
                          {(file.file.size / 1024).toFixed(1)} KB
                        </p>
                        {file.status === 'uploading' && (
                          <div className="flex-1 max-w-xs">
                            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300"
                                style={{ width: `${file.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                        {file.status === 'processing' && (
                          <span className="flex items-center gap-1.5 text-xs text-yellow-400">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Processing
                          </span>
                        )}
                        {file.status === 'completed' && (
                          <span className="flex items-center gap-1.5 text-xs text-green-400">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Ready
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 p-6 rounded-xl bg-blue-500/10 border border-blue-500/20"
      >
        <h3 className="font-medium text-blue-300 mb-2">Tips for best results</h3>
        <ul className="space-y-2 text-sm text-gray-400">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <span>Use high-resolution images (300 DPI or higher) for OCR extraction</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <span>PDFs with selectable text yield faster and more accurate results</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <span>For invoices, choose the "Process Invoices" automation type</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
}