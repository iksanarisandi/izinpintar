
import React, { useState, useEffect } from 'react';
import { ScheduleItem, UserProfile, ViewDevice, PermissionType, DEFAULT_TEMPLATES, HistoryItem, BackupData } from './types';
import { ScheduleManager } from './components/ScheduleManager';
import { PermissionGenerator } from './components/PermissionGenerator';
import { TemplateEditor } from './components/TemplateEditor';
import { HistoryList } from './components/HistoryList';
import { DataManagementModal } from './components/DataManagementModal';
import { AuthModal } from './components/AuthModal';
import { OnboardingModal } from './components/OnboardingModal';
import { AdminDashboard } from './components/AdminDashboard';
import { firebaseService } from './services/firebaseService';
import { onAuthStateChanged } from 'firebase/auth';
import { PenTool, Monitor, Smartphone, Tablet, Moon, Sun, FileText, Calendar, Clock, Settings, UserCircle, LogOut, CloudLightning, Shield, Wifi, WifiOff, MoreVertical, Check, Download } from 'lucide-react';

// --- ADMIN CONFIGURATION ---
// GANTI EMAIL DI BAWAH INI DENGAN EMAIL ANDA UNTUK MENGAKTIFKAN AKSES ADMIN
const ADMIN_EMAIL = "hastagcoretansantri@gmail.com"; // <--- Ganti dengan email Anda (contoh: budi@gmail.com)

const App: React.FC = () => {
  // --- State ---
  const [darkMode, setDarkMode] = useState(false);
  const [viewDevice, setViewDevice] = useState<ViewDevice>('laptop');
  const [activeTab, setActiveTab] = useState<'generator' | 'schedule' | 'template' | 'history' | 'admin'>('generator');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  // Onboarding State
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => {
    // Check if user has completed onboarding before
    return !localStorage.getItem('izinkuy_onboarding_completed');
  });

  // Session State (Managed by Firebase)
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced');

  // Persisted Data
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : { 
      name: '', idNumber: '', unit: '', status: '', functionalPosition: '', structuralPosition: '', workload: '', startTime: '', endTime: ''
    };
  });

  const [schedules, setSchedules] = useState<ScheduleItem[]>(() => {
    const saved = localStorage.getItem('schedules');
    return saved ? JSON.parse(saved) : [];
  });

  const [customTemplates, setCustomTemplates] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('templates');
    if (saved) return { ...DEFAULT_TEMPLATES, ...JSON.parse(saved) };
    return DEFAULT_TEMPLATES;
  });

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('history');
    return saved ? JSON.parse(saved) : [];
  });

  // --- Effects ---
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  // Network Status Listener
  useEffect(() => {
    const handleStatusChange = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  // PWA Install Prompt Listener
  useEffect(() => {
    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  // --- FIREBASE AUTH & SYNC LISTENER ---
  useEffect(() => {
    if (!firebaseService.auth) return;

    const unsubscribeAuth = onAuthStateChanged(firebaseService.auth, (user) => {
        setCurrentUser(user);
        if (user) {
            setSyncStatus('syncing');
            // Mark onboarding as done if user logs in
            localStorage.setItem('izinkuy_onboarding_completed', 'true');
            setIsOnboardingOpen(false);

            // Subscribe to REAL-TIME data changes from Cloud
            const unsubscribeData = firebaseService.subscribeToUserData(user.uid, (cloudData) => {
                if (cloudData) {
                    // Cloud data exists, update local state (Sync Down)
                    console.log("Syncing data from cloud...");
                    setUserProfile(cloudData.userProfile || userProfile);
                    setSchedules(cloudData.schedules || []);
                    setCustomTemplates({ ...DEFAULT_TEMPLATES, ...(cloudData.templates || {}) });
                    setHistory(cloudData.history || []);
                    
                    // Update local storage too for offline redundancy
                    localStorage.setItem('userProfile', JSON.stringify(cloudData.userProfile));
                    localStorage.setItem('schedules', JSON.stringify(cloudData.schedules));
                    localStorage.setItem('templates', JSON.stringify(cloudData.templates));
                    localStorage.setItem('history', JSON.stringify(cloudData.history));
                }
                setSyncStatus('synced');
            });

            return () => unsubscribeData(); // Cleanup data listener on auth change
        } else {
            setSyncStatus('synced');
            // If user was in admin tab, redirect out
            if (activeTab === 'admin') setActiveTab('generator');
        }
    });

    return () => unsubscribeAuth();
  }, []);

  // --- DATA PERSISTENCE & SYNC ---
  // Function to save data to LocalStorage AND Cloud
  const saveData = async (
      newProfile: UserProfile, 
      newSchedules: ScheduleItem[], 
      newTemplates: Record<string, string>, 
      newHistory: HistoryItem[]
    ) => {
      // 1. Local Save (Always)
      localStorage.setItem('userProfile', JSON.stringify(newProfile));
      localStorage.setItem('schedules', JSON.stringify(newSchedules));
      localStorage.setItem('templates', JSON.stringify(newTemplates));
      localStorage.setItem('history', JSON.stringify(newHistory));

      // 2. Cloud Sync (if logged in)
      if (currentUser) {
          setSyncStatus('syncing');
          const backup: BackupData = {
              version: 1,
              timestamp: Date.now(),
              userProfile: newProfile,
              schedules: newSchedules,
              templates: newTemplates,
              history: newHistory
          };
          try {
            await firebaseService.saveUserData(currentUser.uid, backup);
            setSyncStatus('synced');
          } catch (error) {
            console.error("Sync failed", error);
            setSyncStatus('error');
          }
      }
  };

  // Wrapper setters to trigger save
  const handleUpdateProfile = (p: UserProfile) => {
      setUserProfile(p);
      saveData(p, schedules, customTemplates, history);
  };
  const handleUpdateSchedules = (s: ScheduleItem[]) => {
      setSchedules(s);
      saveData(userProfile, s, customTemplates, history);
  };
  const handleUpdateTemplates = (t: Record<string, string>) => {
      setCustomTemplates(t);
      saveData(userProfile, schedules, t, history);
  };
  const handleUpdateHistory = (h: HistoryItem[]) => {
      setHistory(h);
      saveData(userProfile, schedules, customTemplates, h);
  };
  
  // New: Handler to add custom permission type
  const handleAddPermissionType = (name: string, customTemplate?: string) => {
      if (customTemplates[name]) return; // Already exists
      
      const templateContent = customTemplate || `IZIN ${name.toUpperCase()}

Kepada Yth. Bapak/Ibu Pimpinan,
Saya yang bertanda tangan di bawah ini:

Nama: {{nama}}
Unit: {{unit}}

Memohon izin {{reason}} pada tanggal {{date}}.

Demikian permohonan ini saya sampaikan.
Terima kasih.`;

      const newTemplates = {
          ...customTemplates,
          [name]: templateContent
      };
      handleUpdateTemplates(newTemplates);
  };

  const handleLogout = async () => {
      if (window.confirm('Logout akan menghentikan sinkronisasi. Data lokal tetap tersimpan.')) {
          await firebaseService.logout();
          setActiveTab('generator');
          setIsMenuOpen(false);
      }
  };

  // --- PWA Install Handler ---
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    // We've used the prompt, and can't use it again, discard it
    setDeferredPrompt(null);
    setIsMenuOpen(false);
  };

  // --- Onboarding Handlers ---
  const handleOnboardingLocal = () => {
    localStorage.setItem('izinkuy_onboarding_completed', 'true');
    setIsOnboardingOpen(false);
  };

  const handleOnboardingCloud = () => {
    localStorage.setItem('izinkuy_onboarding_completed', 'true');
    setIsOnboardingOpen(false);
    // Open Auth Modal immediately
    setIsAuthOpen(true);
  };

  // --- Logic ---
  const handleAddToHistory = (newItem: Omit<HistoryItem, 'id' | 'createdAt'>) => {
    const lastItem = history[history.length - 1];
    if (lastItem && lastItem.generatedText === newItem.generatedText && lastItem.permissionDate === newItem.permissionDate) {
      return;
    }
    const item: HistoryItem = {
      ...newItem,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    handleUpdateHistory([...history, item]);
  };

  // --- Export / Import Logic ---
  const handleExportData = () => {
    const backup: BackupData = {
      version: 1,
      timestamp: Date.now(),
      userProfile,
      schedules,
      templates: customTemplates,
      history
    };
    
    const dataStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `izinkuy_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const backup: BackupData = JSON.parse(result);
        if (!backup.userProfile || !Array.isArray(backup.schedules)) {
          alert('Format file tidak valid!');
          return;
        }
        if (window.confirm(`Restore data?`)) {
            handleUpdateProfile(backup.userProfile);
            handleUpdateSchedules(backup.schedules);
            handleUpdateTemplates(backup.templates);
            handleUpdateHistory(backup.history || []);
            setIsSettingsOpen(false);
            alert('Data berhasil dipulihkan!');
        }
      } catch (err) {
        console.error(err);
        alert('Gagal membaca file backup.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (window.confirm('Hapus SEMUA data?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const getContainerWidth = () => {
    switch (viewDevice) {
      case 'mobile': return 'max-w-[400px]';
      case 'tablet': return 'max-w-[768px]';
      case 'laptop': return 'max-w-6xl';
      default: return 'max-w-6xl';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-500 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      
      {/* Onboarding Modal - Shows first time only */}
      <OnboardingModal 
        isOpen={isOnboardingOpen} 
        onSelectLocal={handleOnboardingLocal} 
        onSelectCloud={handleOnboardingCloud} 
      />

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
      />

      <DataManagementModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onExport={handleExportData}
        onImport={handleImportData}
        onReset={handleResetData}
      />

      {/* Main App Container */}
      <div className={`w-full transition-all duration-500 ease-in-out ${getContainerWidth()} my-2 sm:my-4 flex flex-col h-[85vh] bg-white dark:bg-gray-800/50 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden relative`}>
        
        {/* Header / Toolbar */}
        <div className="h-16 px-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-20">
           {/* Left: Title & Status */}
           <div className="flex items-center gap-3">
             <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 flex items-center gap-2">
               <PenTool className="text-blue-600" size={20} />
               Izin Generator
             </h1>
             
             {/* Network Status Indicator */}
             <div className={`hidden sm:flex items-center gap-1 px-2 py-1 rounded-full border ${isOnline ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-100' : 'bg-red-50 dark:bg-red-900/20 border-red-100'} dark:border-opacity-20`}>
                {isOnline ? (
                    <Wifi size={12} className="text-blue-500" />
                ) : (
                    <WifiOff size={12} className="text-red-500" />
                )}
             </div>

             {currentUser && (
                <div className={`hidden sm:flex items-center gap-1 px-2 py-1 rounded-full border transition-all ${
                    syncStatus === 'syncing' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200' : 
                    syncStatus === 'error' ? 'bg-red-50 dark:bg-red-900/20 border-red-200' :
                    'bg-green-50 dark:bg-green-900/20 border-green-100'
                } dark:border-opacity-30`}>
                    <CloudLightning size={12} className={
                        syncStatus === 'syncing' ? "text-yellow-500 animate-pulse" : 
                        syncStatus === 'error' ? "text-red-500" :
                        "text-green-500"
                    } />
                    <span className={`text-[10px] font-bold ${
                        syncStatus === 'syncing' ? "text-yellow-600" : 
                        syncStatus === 'error' ? "text-red-600" :
                        "text-green-600 dark:text-green-400"
                    }`}>
                        {syncStatus === 'syncing' ? 'Menyimpan...' : syncStatus === 'error' ? 'Gagal Simpan' : 'Tersimpan'}
                    </span>
                </div>
             )}
           </div>

           {/* Right: Dropdown Menu */}
           <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-full transition-all duration-300 ${isMenuOpen ? 'bg-gray-100 dark:bg-gray-700 rotate-90' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <MoreVertical size={20} className="text-gray-600 dark:text-gray-300" />
              </button>

              {/* Dropdown Content */}
              {isMenuOpen && (
                <>
                    {/* Overlay to close menu */}
                    <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsMenuOpen(false)}></div>
                    
                    {/* Menu Box */}
                    <div className="absolute right-0 top-12 z-50 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                        
                        {/* Device View Toggles */}
                        <div className="bg-gray-50 dark:bg-gray-900/50 p-3 flex justify-between items-center border-b border-gray-100 dark:border-gray-700">
                            <button onClick={() => setViewDevice('mobile')} className={`p-2 rounded-lg transition-all ${viewDevice === 'mobile' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`} title="Mobile View">
                                <Smartphone size={18} />
                            </button>
                            <button onClick={() => setViewDevice('tablet')} className={`p-2 rounded-lg transition-all ${viewDevice === 'tablet' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`} title="Tablet View">
                                <Tablet size={18} />
                            </button>
                            <button onClick={() => setViewDevice('laptop')} className={`p-2 rounded-lg transition-all ${viewDevice === 'laptop' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`} title="Laptop View">
                                <Monitor size={18} />
                            </button>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2 space-y-1">
                             
                             {/* INSTALL APP PWA (Only visible if supported & not installed) */}
                             {deferredPrompt && (
                                <button 
                                    onClick={handleInstallClick}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-sm font-bold text-blue-600 dark:text-blue-400 animate-pulse"
                                >
                                    <Download size={18} />
                                    <span>Install Aplikasi</span>
                                </button>
                             )}

                             {/* Dark Mode */}
                             <button 
                                onClick={() => setDarkMode(!darkMode)}
                                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-sm font-medium text-gray-700 dark:text-gray-200"
                             >
                                <div className="flex items-center gap-3">
                                    {darkMode ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} className="text-blue-500" />}
                                    <span>{darkMode ? 'Mode Terang' : 'Mode Gelap'}</span>
                                </div>
                                {darkMode && <Check size={14} className="text-blue-500" />}
                             </button>

                             {/* Data Settings */}
                             <button 
                                onClick={() => { setIsSettingsOpen(true); setIsMenuOpen(false); }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-sm font-medium text-gray-700 dark:text-gray-200"
                             >
                                <Settings size={18} className="text-gray-500" />
                                <span>Pengaturan Data</span>
                             </button>

                             {/* Admin Dashboard (Conditional) */}
                             {currentUser && currentUser.email === ADMIN_EMAIL && (
                                <button 
                                    onClick={() => { setActiveTab('admin'); setIsMenuOpen(false); }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm font-medium text-blue-600 dark:text-blue-400"
                                >
                                    <Shield size={18} />
                                    <span>Admin Panel</span>
                                </button>
                             )}
                        </div>

                        {/* Auth Section (Footer) */}
                        <div className="border-t border-gray-100 dark:border-gray-700 p-3 bg-gray-50/50 dark:bg-gray-900/30">
                            {currentUser ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 px-1">
                                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">
                                            {currentUser.email?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-gray-800 dark:text-white truncate">{currentUser.email}</p>
                                            <p className="text-[10px] text-green-600 dark:text-green-400">Online & Synced</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center gap-2 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 text-xs font-bold rounded-lg transition-colors"
                                    >
                                        <LogOut size={14} /> Logout
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => { setIsAuthOpen(true); setIsMenuOpen(false); }}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md transition-colors"
                                >
                                    <UserCircle size={16} /> Login Akun
                                </button>
                            )}
                        </div>
                    </div>
                </>
              )}
           </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
          {activeTab === 'generator' && (
            <PermissionGenerator 
              userProfile={userProfile}
              setUserProfile={handleUpdateProfile}
              schedules={schedules}
              templates={customTemplates}
              viewDevice={viewDevice}
              onSaveToHistory={handleAddToHistory}
              onAddType={handleAddPermissionType}
            />
          )}
          {activeTab === 'schedule' && (
             <div className="h-full overflow-y-auto p-6 custom-scrollbar">
               <ScheduleManager schedules={schedules} setSchedules={handleUpdateSchedules} />
             </div>
          )}
          {activeTab === 'template' && (
            <div className="h-full p-6">
              <TemplateEditor templates={customTemplates} setTemplates={handleUpdateTemplates} />
            </div>
          )}
          {activeTab === 'history' && (
            <HistoryList history={history} setHistory={handleUpdateHistory} />
          )}
           {activeTab === 'admin' && currentUser?.email === ADMIN_EMAIL && (
            <AdminDashboard />
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-2 z-30">
          <div className="grid grid-cols-4 gap-2">
             <NavButton 
                active={activeTab === 'generator'} 
                onClick={() => setActiveTab('generator')} 
                icon={<PenTool size={20} />} 
                label="Buat Izin" 
             />
             <NavButton 
                active={activeTab === 'schedule'} 
                onClick={() => setActiveTab('schedule')} 
                icon={<Calendar size={20} />} 
                label="Jadwal" 
             />
             <NavButton 
                active={activeTab === 'template'} 
                onClick={() => setActiveTab('template')} 
                icon={<FileText size={20} />} 
                label="Template" 
             />
             <NavButton 
                active={activeTab === 'history'} 
                onClick={() => setActiveTab('history')} 
                icon={<Clock size={20} />} 
                label="Riwayat" 
             />
          </div>
        </div>

      </div>
    </div>
  );
};

const NavButton: React.FC<{active: boolean, onClick: () => void, icon: React.ReactNode, label: string}> = ({active, onClick, icon, label}) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 ${active ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
  >
    <div className={`mb-1 transform transition-transform ${active ? 'scale-110' : ''}`}>{icon}</div>
    <span className="text-[10px] font-bold">{label}</span>
  </button>
);

export default App;
