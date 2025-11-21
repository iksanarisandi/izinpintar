import React, { useEffect, useState } from 'react';
import { firebaseService } from '../services/firebaseService';
import { Users, Activity, TrendingUp, Calendar } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, analyticsData] = await Promise.all([
        firebaseService.getAllUsers(),
        firebaseService.getAllAnalytics()
      ]);
      setUsers(usersData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalPermissions = () => {
    return users.reduce((total, user) => total + (user.history?.length || 0), 0);
  };

  const getActiveUsersToday = () => {
    const today = new Date().toDateString();
    return analytics.filter(a => {
      const timestamp = a.timestamp?.toDate?.() || new Date(a.timestamp);
      return timestamp.toDateString() === today;
    }).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
          <Activity className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Monitoring pengguna dan aktivitas</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Users size={32} />
            <span className="text-3xl font-bold">{users.length}</span>
          </div>
          <p className="text-blue-100 text-sm font-medium">Total Pengguna</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Calendar size={32} />
            <span className="text-3xl font-bold">{getTotalPermissions()}</span>
          </div>
          <p className="text-green-100 text-sm font-medium">Total Izin Dibuat</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp size={32} />
            <span className="text-3xl font-bold">{getActiveUsersToday()}</span>
          </div>
          <p className="text-purple-100 text-sm font-medium">Aktivitas Hari Ini</p>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Daftar Pengguna</h3>
        
        {users.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">Belum ada pengguna terdaftar</p>
        ) : (
          <div className="space-y-3">
            {users.map((user, index) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">
                      {user.userProfile?.name || 'Tanpa Nama'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user.userProfile?.unit || 'Unit tidak diisi'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {user.history?.length || 0} izin
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {user.schedules?.length || 0} jadwal
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activities */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Aktivitas Terbaru</h3>
        
        {analytics.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">Belum ada aktivitas</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {analytics
              .sort((a, b) => {
                const aTime = a.timestamp?.toDate?.() || new Date(a.timestamp);
                const bTime = b.timestamp?.toDate?.() || new Date(b.timestamp);
                return bTime.getTime() - aTime.getTime();
              })
              .slice(0, 20)
              .map((activity) => {
                const timestamp = activity.timestamp?.toDate?.() || new Date(activity.timestamp);
                return (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {activity.action}
                      </span>
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 text-xs">
                      {timestamp.toLocaleString('id-ID')}
                    </span>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};
