import React, { useState, useEffect } from 'react';
import { UserProfile, ScheduleItem, ViewDevice, PermissionData, DAY_NAMES, PermissionType } from '../types';
import { User, Briefcase, Calendar, FileText, Copy, Save, Plus } from 'lucide-react';

interface PermissionGeneratorProps {
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
  schedules: ScheduleItem[];
  templates: Record<string, string>;
  viewDevice: ViewDevice;
  onSaveToHistory: (item: { type: string; permissionDate: string; reason: string; generatedText: string }) => void;
  onAddType: (name: string, customTemplate?: string) => void;
}

export const PermissionGenerator: React.FC<PermissionGeneratorProps> = ({
  userProfile,
  setUserProfile,
  schedules,
  templates,
  viewDevice,
  onSaveToHistory,
  onAddType
}) => {
  const [activeSection, setActiveSection] = useState<'profile' | 'permission'>('profile');
  const [permissionData, setPermissionData] = useState<PermissionData>({
    type: Object.keys(templates)[0] || PermissionType.KBM,
    date: new Date(),
    reason: '',
    halaqahTime: '',
    halaqahPlace: '',
    badalSolution: ''
  });
  const [generatedText, setGeneratedText] = useState('');
  const [showAddTypeModal, setShowAddTypeModal] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');

  useEffect(() => {
    if (userProfile.name && activeSection === 'profile') {
      setActiveSection('permission');
    }
  }, []);

  useEffect(() => {
    generatePermissionText();
  }, [permissionData, userProfile, schedules, templates]);

  const generatePermissionText = () => {
    const template = templates[permissionData.type] || '';
    const date = permissionData.date;
    const dayIndex = date.getDay();
    const dayName = DAY_NAMES[dayIndex];

    // Get schedules for selected date
    const daySchedules = schedules.filter(s => s.dayIndex === dayIndex);
    const scheduleText = daySchedules.length > 0
      ? daySchedules
          .map(s => `${s.subject} (${s.className}) ${s.startTime}-${s.endTime}${s.note ? ' - ' + s.note : ''}`)
          .join('\n')
      : 'Tidak ada jadwal';

    // Get time greeting
    const hour = new Date().getHours();
    const timeGreeting = hour < 12 ? 'pagi' : hour < 15 ? 'siang' : hour < 18 ? 'sore' : 'malam';

    // Replace template variables
    let text = template
      .replace(/\{\{nama\}\}/g, userProfile.name || '[Nama belum diisi]')
      .replace(/\{\{unit\}\}/g, userProfile.unit || '[Unit belum diisi]')
      .replace(/\{\{date\}\}/g, date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }))
      .replace(/\{\{dayName\}\}/g, dayName)
      .replace(/\{\{reason\}\}/g, permissionData.reason || '[Alasan belum diisi]')
      .replace(/\{\{schedule\}\}/g, scheduleText)
      .replace(/\{\{jabatanStruktural\}\}/g, userProfile.structuralPosition || '[Jabatan belum diisi]')
      .replace(/\{\{jabatanFungsional\}\}/g, userProfile.functionalPosition || '[Jabatan belum diisi]')
      .replace(/\{\{timeGreeting\}\}/g, timeGreeting)
      .replace(/\{\{waktuHalaqah\}\}/g, permissionData.halaqahTime || '[Waktu Halaqah belum diisi]')
      .replace(/\{\{tempatHalaqah\}\}/g, permissionData.halaqahPlace || '[Tempat Halaqah belum diisi]')
      .replace(/\{\{solusiBadal\}\}/g, permissionData.badalSolution || '[Solusi Badal belum diisi]');

    setGeneratedText(text);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    alert('Teks berhasil disalin!');
  };

  const handleSaveToHistory = () => {
    if (!generatedText || !permissionData.reason) {
      alert('Harap isi alasan izin terlebih dahulu');
      return;
    }

    onSaveToHistory({
      type: permissionData.type,
      permissionDate: permissionData.date.toISOString(),
      reason: permissionData.reason,
      generatedText
    });

    alert('Berhasil disimpan ke riwayat!');
  };

  const handleAddCustomType = () => {
    if (!newTypeName.trim()) {
      alert('Nama tipe tidak boleh kosong');
      return;
    }

    if (templates[newTypeName]) {
      alert('Tipe ini sudah ada');
      return;
    }

    onAddType(newTypeName);
    setPermissionData({ ...permissionData, type: newTypeName });
    setNewTypeName('');
    setShowAddTypeModal(false);
    alert('Tipe izin baru berhasil ditambahkan! Edit template di tab Template.');
  };

  const isProfileComplete = userProfile.name && userProfile.unit;

  return (
    <div className="h-full flex flex-col">
      {/* Section Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 px-6 pt-4">
        <button
          onClick={() => setActiveSection('profile')}
          className={`flex items-center gap-2 px-4 py-3 font-bold border-b-2 transition-colors ${
            activeSection === 'profile'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <User size={18} />
          <span>Profil</span>
          {!isProfileComplete && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
        </button>
        <button
          onClick={() => setActiveSection('permission')}
          className={`flex items-center gap-2 px-4 py-3 font-bold border-b-2 transition-colors ${
            activeSection === 'permission'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <FileText size={18} />
          <span>Buat Izin</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        {activeSection === 'profile' ? (
          // Profile Section
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Lengkapi Profil Anda</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Data ini akan digunakan untuk mengisi template surat izin secara otomatis.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  value={userProfile.name}
                  onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Ahmad Dahlan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  No. Induk
                </label>
                <input
                  type="text"
                  value={userProfile.idNumber}
                  onChange={(e) => setUserProfile({ ...userProfile, idNumber: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="123456"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Unit/Bagian *
                </label>
                <input
                  type="text"
                  value={userProfile.unit}
                  onChange={(e) => setUserProfile({ ...userProfile, unit: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="MA Unggulan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status Karyawan
                </label>
                <input
                  type="text"
                  value={userProfile.status}
                  onChange={(e) => setUserProfile({ ...userProfile, status: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="GHY / Tetap"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Jabatan Fungsional
                </label>
                <input
                  type="text"
                  value={userProfile.functionalPosition}
                  onChange={(e) => setUserProfile({ ...userProfile, functionalPosition: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Guru Matematika"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Jabatan Struktural
                </label>
                <input
                  type="text"
                  value={userProfile.structuralPosition}
                  onChange={(e) => setUserProfile({ ...userProfile, structuralPosition: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Kepala Unit"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Jam Masuk
                </label>
                <input
                  type="time"
                  value={userProfile.startTime}
                  onChange={(e) => setUserProfile({ ...userProfile, startTime: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Jam Pulang
                </label>
                <input
                  type="time"
                  value={userProfile.endTime}
                  onChange={(e) => setUserProfile({ ...userProfile, endTime: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <button
              onClick={() => setActiveSection('permission')}
              disabled={!isProfileComplete}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold shadow-lg transition-all"
            >
              {isProfileComplete ? 'Lanjut ke Buat Izin →' : 'Lengkapi Nama dan Unit terlebih dahulu'}
            </button>
          </div>
        ) : (
          // Permission Section
          <div className="max-w-4xl mx-auto space-y-6">
            {!isProfileComplete && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-400">
                  ⚠️ Profil belum lengkap. Silakan lengkapi di tab Profil untuk hasil yang lebih akurat.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Form Input */}
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Detail Izin</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tipe Izin
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={permissionData.type}
                          onChange={(e) => setPermissionData({ ...permissionData, type: e.target.value })}
                          className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          {Object.keys(templates).map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => setShowAddTypeModal(true)}
                          className="p-3 rounded-xl bg-green-100 dark:bg-green-900/20 text-green-600 hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors"
                          title="Tambah tipe baru"
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tanggal Izin
                      </label>
                      <input
                        type="date"
                        value={permissionData.date.toISOString().split('T')[0]}
                        onChange={(e) => setPermissionData({ ...permissionData, date: new Date(e.target.value) })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Alasan Izin *
                      </label>
                      <textarea
                        value={permissionData.reason}
                        onChange={(e) => setPermissionData({ ...permissionData, reason: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        rows={3}
                        placeholder="Masukkan alasan izin..."
                      />
                    </div>

                    {permissionData.type === PermissionType.HALAQAH && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Waktu Halaqah
                          </label>
                          <input
                            type="time"
                            value={permissionData.halaqahTime}
                            onChange={(e) => setPermissionData({ ...permissionData, halaqahTime: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Tempat Halaqah
                          </label>
                          <input
                            type="text"
                            value={permissionData.halaqahPlace}
                            onChange={(e) => setPermissionData({ ...permissionData, halaqahPlace: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="Masjid / Musholla"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Solusi Badal
                          </label>
                          <textarea
                            value={permissionData.badalSolution}
                            onChange={(e) => setPermissionData({ ...permissionData, badalSolution: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            rows={2}
                            placeholder="Rencana badal halaqah..."
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Preview & Actions */}
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Preview</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors text-sm font-medium"
                      >
                        <Copy size={16} />
                        <span>Salin</span>
                      </button>
                      <button
                        onClick={handleSaveToHistory}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-600 hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors text-sm font-medium"
                      >
                        <Save size={16} />
                        <span>Simpan</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 max-h-96 overflow-y-auto">
                    <pre className="text-sm text-gray-800 dark:text-gray-300 whitespace-pre-wrap font-sans">
                      {generatedText || 'Isi form untuk melihat preview...'}
                    </pre>
                  </div>
                </div>

                {schedules.filter(s => s.dayIndex === permissionData.date.getDay()).length > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
                    <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2">
                      📅 Jadwal pada {DAY_NAMES[permissionData.date.getDay()]}
                    </h4>
                    <div className="space-y-1 text-sm text-blue-800 dark:text-blue-400">
                      {schedules
                        .filter(s => s.dayIndex === permissionData.date.getDay())
                        .map(s => (
                          <div key={s.id}>
                            • {s.subject} ({s.className}) {s.startTime}-{s.endTime}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Type Modal */}
      {showAddTypeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Tambah Tipe Izin Baru</h3>
            <input
              type="text"
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white mb-4"
              placeholder="Nama tipe izin (contoh: Sakit, Dinas)"
              onKeyPress={(e) => e.key === 'Enter' && handleAddCustomType()}
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddCustomType}
                className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-colors"
              >
                Tambah
              </button>
              <button
                onClick={() => {
                  setShowAddTypeModal(false);
                  setNewTypeName('');
                }}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl font-bold transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
