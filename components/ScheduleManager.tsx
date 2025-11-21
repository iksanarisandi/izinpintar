import React, { useState } from 'react';
import { ScheduleItem, DAY_NAMES } from '../types';
import { Plus, Trash2, Clock, BookOpen, GraduationCap } from 'lucide-react';

interface ScheduleManagerProps {
  schedules: ScheduleItem[];
  setSchedules: (schedules: ScheduleItem[]) => void;
}

export const ScheduleManager: React.FC<ScheduleManagerProps> = ({ schedules, setSchedules }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<ScheduleItem, 'id'>>({
    dayIndex: 1,
    subject: '',
    className: '',
    level: '',
    startTime: '',
    endTime: '',
    note: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.className || !formData.startTime || !formData.endTime) {
      alert('Harap isi semua field yang wajib');
      return;
    }

    if (editingId) {
      setSchedules(schedules.map(s => s.id === editingId ? { ...formData, id: editingId } : s));
      setEditingId(null);
    } else {
      const newSchedule: ScheduleItem = {
        ...formData,
        id: crypto.randomUUID()
      };
      setSchedules([...schedules, newSchedule]);
    }

    resetForm();
  };

  const handleEdit = (schedule: ScheduleItem) => {
    setFormData({
      dayIndex: schedule.dayIndex,
      subject: schedule.subject,
      className: schedule.className,
      level: schedule.level,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      note: schedule.note || ''
    });
    setEditingId(schedule.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Hapus jadwal ini?')) {
      setSchedules(schedules.filter(s => s.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      dayIndex: 1,
      subject: '',
      className: '',
      level: '',
      startTime: '',
      endTime: '',
      note: ''
    });
    setShowForm(false);
    setEditingId(null);
  };

  const groupedSchedules = schedules.reduce((acc, schedule) => {
    if (!acc[schedule.dayIndex]) {
      acc[schedule.dayIndex] = [];
    }
    acc[schedule.dayIndex].push(schedule);
    return acc;
  }, {} as Record<number, ScheduleItem[]>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Jadwal Mengajar</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors"
        >
          <Plus size={18} />
          <span>Tambah Jadwal</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hari
              </label>
              <select
                value={formData.dayIndex}
                onChange={(e) => setFormData({ ...formData, dayIndex: Number(e.target.value) })}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {DAY_NAMES.map((day, index) => (
                  <option key={index} value={index}>{day}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mata Pelajaran *
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Matematika"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kelas *
              </label>
              <input
                type="text"
                value={formData.className}
                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="XI A"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Jenjang
              </label>
              <input
                type="text"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="MA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Jam Mulai *
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Jam Selesai *
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Catatan Tugas (Opsional)
            </label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              rows={2}
              placeholder="Tugas halaman 25-30"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors"
            >
              {editingId ? 'Update' : 'Simpan'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl font-bold transition-colors"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {DAY_NAMES.map((dayName, dayIndex) => {
          const daySchedules = groupedSchedules[dayIndex] || [];
          if (daySchedules.length === 0) return null;

          return (
            <div key={dayIndex} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3">{dayName}</h3>
              <div className="space-y-2">
                {daySchedules
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map((schedule) => (
                    <div
                      key={schedule.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors group"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <BookOpen size={16} className="text-blue-600" />
                          <span className="font-bold text-gray-900 dark:text-white">{schedule.subject}</span>
                          {schedule.level && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400">
                              {schedule.level}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <GraduationCap size={14} />
                            <span>{schedule.className}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{schedule.startTime} - {schedule.endTime}</span>
                          </div>
                        </div>
                        {schedule.note && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">📝 {schedule.note}</p>
                        )}
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(schedule)}
                          className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(schedule.id)}
                          className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          );
        })}
        
        {schedules.length === 0 && !showForm && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <BookOpen size={48} className="mx-auto mb-3 opacity-50" />
            <p>Belum ada jadwal. Klik tombol "Tambah Jadwal" untuk mulai.</p>
          </div>
        )}
      </div>
    </div>
  );
};
