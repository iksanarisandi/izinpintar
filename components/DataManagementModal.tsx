import React, { useRef } from 'react';
import { X, Download, Upload, Trash2, AlertTriangle } from 'lucide-react';

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onReset: () => void;
}

export const DataManagementModal: React.FC<DataManagementModalProps> = ({
  isOpen,
  onClose,
  onExport,
  onImport,
  onReset
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in-95 duration-300 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Pengaturan Data
        </h2>

        <div className="space-y-3">
          {/* Export Data */}
          <button
            onClick={onExport}
            className="w-full p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all group text-left flex items-center gap-3"
          >
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/40">
              <Download size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Export Data</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Unduh backup data ke file JSON
              </p>
            </div>
          </button>

          {/* Import Data */}
          <button
            onClick={handleImportClick}
            className="w-full p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-500 transition-all group text-left flex items-center gap-3"
          >
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20 group-hover:bg-green-200 dark:group-hover:bg-green-900/40">
              <Upload size={20} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Import Data</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Restore data dari file backup
              </p>
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Reset Data */}
          <button
            onClick={onReset}
            className="w-full p-4 rounded-xl border-2 border-red-200 dark:border-red-800 hover:border-red-400 dark:hover:border-red-600 bg-red-50 dark:bg-red-900/10 transition-all group text-left flex items-center gap-3"
          >
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20 group-hover:bg-red-200 dark:group-hover:bg-red-900/40">
              <Trash2 size={20} className="text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-red-700 dark:text-red-400">Reset Semua Data</h3>
              <p className="text-xs text-red-600 dark:text-red-500">
                Hapus semua data dan mulai dari awal
              </p>
            </div>
          </button>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 flex items-start gap-2">
          <AlertTriangle size={18} className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-700 dark:text-yellow-400">
            <strong>Tips:</strong> Export data secara berkala untuk backup. Data lokal bisa hilang jika browser cache dibersihkan.
          </p>
        </div>
      </div>
    </div>
  );
};
