import React, { useState } from 'react';
import { HistoryItem } from '../types';
import { Clock, Copy, Trash2, Search, Filter } from 'lucide-react';

interface HistoryListProps {
  history: HistoryItem[];
  setHistory: (history: HistoryItem[]) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ history, setHistory }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Teks berhasil disalin!');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Hapus riwayat ini?')) {
      setHistory(history.filter(h => h.id !== id));
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Hapus semua riwayat?')) {
      setHistory([]);
    }
  };

  const uniqueTypes = Array.from(new Set(history.map(h => h.type)));

  const filteredHistory = history
    .filter(item => {
      const matchesSearch = searchQuery === '' || 
        item.generatedText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.reason.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || item.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Riwayat Izin</h2>
        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-xl font-bold transition-colors text-sm"
          >
            <Trash2 size={16} />
            <span>Hapus Semua</span>
          </button>
        )}
      </div>

      {history.length > 0 && (
        <div className="flex gap-2 mb-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari riwayat..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm appearance-none cursor-pointer"
            >
              <option value="all">Semua Tipe</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Clock size={48} className="mx-auto mb-3 opacity-50" />
            <p>{history.length === 0 ? 'Belum ada riwayat' : 'Tidak ada hasil pencarian'}</p>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all group"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-bold">
                    {item.type}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleCopy(item.generatedText)}
                    className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
                    title="Salin teks"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                    title="Hapus"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mb-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Tanggal Izin:</strong> {new Date(item.permissionDate).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Alasan:</strong> {item.reason}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3">
                <pre className="text-xs text-gray-800 dark:text-gray-300 whitespace-pre-wrap font-sans">
                  {item.generatedText}
                </pre>
              </div>
            </div>
          ))
        )}
      </div>

      {history.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-500">
          Menampilkan {filteredHistory.length} dari {history.length} riwayat
        </div>
      )}
    </div>
  );
};
