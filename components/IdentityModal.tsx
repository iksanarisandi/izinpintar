import React from 'react';
import { UserProfile } from '../types';
import { X, User, CreditCard, Users, Briefcase, Clock, Activity, Award } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  setUserProfile: (p: UserProfile) => void;
}

export const IdentityModal: React.FC<Props> = ({ isOpen, onClose, userProfile, setUserProfile }) => {
  if (!isOpen) return null;

  const handleChange = (field: keyof UserProfile, value: string) => {
    setUserProfile({ ...userProfile, [field]: value });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl sm:rounded-3xl rounded-t-3xl shadow-2xl border border-white/20 transform transition-all flex flex-col max-h-[90vh] sm:max-h-[85vh]">
        
        {/* Sticky Header */}
        <div className="shrink-0 flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Data Pegawai</h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Lengkapi data untuk surat otomatis.</p>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Personal Info */}
            <div className="sm:col-span-2 space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                  <User size={14} /> Nama Lengkap
              </label>
              <input
                type="text"
                value={userProfile.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Contoh: Agus Rinaldi"
                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                <CreditCard size={14} /> No. Induk Karyawan
              </label>
              <input
                type="text"
                value={userProfile.idNumber}
                onChange={(e) => handleChange('idNumber', e.target.value)}
                placeholder="19982025..."
                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                <Users size={14} /> Unit / Bagian
              </label>
              <input
                type="text"
                value={userProfile.unit}
                onChange={(e) => handleChange('unit', e.target.value)}
                placeholder="Ponpes / MA / TU"
                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                <Activity size={14} /> Status Karyawan
              </label>
              <input
                type="text"
                value={userProfile.status}
                onChange={(e) => handleChange('status', e.target.value)}
                placeholder="GHY / Tetap"
                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                <Briefcase size={14} /> Beban Kerja (JP)
              </label>
              <input
                type="text"
                value={userProfile.workload}
                onChange={(e) => handleChange('workload', e.target.value)}
                placeholder="29 JP"
                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                <Award size={14} /> Jabatan Fungsional
              </label>
              <input
                type="text"
                value={userProfile.functionalPosition}
                onChange={(e) => handleChange('functionalPosition', e.target.value)}
                placeholder="Staff TU / Guru Mapel"
                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                <Award size={14} /> Jabatan Struktural
              </label>
              <input
                type="text"
                value={userProfile.structuralPosition}
                onChange={(e) => handleChange('structuralPosition', e.target.value)}
                placeholder="Guru / Kepala Bagian"
                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                <Clock size={14} /> Jam Masuk
              </label>
              <input
                type="text"
                value={userProfile.startTime}
                onChange={(e) => handleChange('startTime', e.target.value)}
                placeholder="07.30 WIB"
                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                <Clock size={14} /> Jam Pulang
              </label>
              <input
                type="text"
                value={userProfile.endTime}
                onChange={(e) => handleChange('endTime', e.target.value)}
                placeholder="16.00 WIB"
                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white outline-none transition-all"
              />
            </div>

          </div>
        </div>

        {/* Sticky Footer */}
        <div className="shrink-0 p-6 border-t border-gray-100 dark:border-gray-800">
          <button 
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
          >
            Simpan Data
          </button>
        </div>

      </div>
    </div>
  );
};