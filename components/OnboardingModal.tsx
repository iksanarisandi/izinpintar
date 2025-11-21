import React from 'react';
import { CloudLightning, HardDrive, X } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onSelectLocal: () => void;
  onSelectCloud: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onSelectLocal, onSelectCloud }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-lg w-full p-8 animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
            Selamat Datang di Izin Generator!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Pilih cara Anda ingin menyimpan data
          </p>
        </div>

        <div className="space-y-4">
          {/* Local Storage Option */}
          <button
            onClick={onSelectLocal}
            className="w-full p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all group text-left"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                <HardDrive className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Simpan Lokal (Offline)</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Data tersimpan di perangkat ini saja. Tidak perlu internet, namun tidak bisa sinkronisasi antar device.
                </p>
                <div className="mt-2 flex gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400">Tanpa Login</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">Privacy Tinggi</span>
                </div>
              </div>
            </div>
          </button>

          {/* Cloud Storage Option */}
          <button
            onClick={onSelectCloud}
            className="w-full p-6 rounded-2xl border-2 border-blue-300 dark:border-blue-600 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 hover:shadow-lg transition-all group text-left"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/40 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/60 transition-colors">
                <CloudLightning className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Simpan di Cloud ⭐</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Data tersimpan di cloud Firebase. Bisa diakses dari berbagai perangkat, sinkronisasi otomatis.
                </p>
                <div className="mt-2 flex gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400">Butuh Login</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400">Multi Device</span>
                </div>
              </div>
            </div>
          </button>
        </div>

        <p className="text-xs text-center text-gray-500 dark:text-gray-500 mt-6">
          Anda bisa mengubah pilihan ini nanti di pengaturan
        </p>
      </div>
    </div>
  );
};
