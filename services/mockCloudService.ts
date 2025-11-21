
import { BackupData, UserAccount } from '../types';

// Key for the "Cloud Database" in localStorage
const CLOUD_DB_KEY = 'izinkuy_cloud_db_simulated';

// Helper to get all accounts
const getDB = (): Record<string, UserAccount> => {
  const dbStr = localStorage.getItem(CLOUD_DB_KEY);
  return dbStr ? JSON.parse(dbStr) : {};
};

// Helper to save DB
const saveDB = (db: Record<string, UserAccount>) => {
  localStorage.setItem(CLOUD_DB_KEY, JSON.stringify(db));
};

export const mockCloudService = {
  register: async (username: string, password: string): Promise<boolean> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const db = getDB();
    if (db[username]) {
      throw new Error('Username sudah terdaftar');
    }

    // Create new account with empty data
    db[username] = {
      username,
      passwordHash: btoa(password), // Simple encoding (NOT REAL SECURITY)
      data: {
        version: 1,
        timestamp: Date.now(),
        userProfile: { 
            name: '', idNumber: '', unit: '', status: '', 
            functionalPosition: '', structuralPosition: '', 
            workload: '', startTime: '', endTime: '' 
        },
        schedules: [],
        templates: {} as any, // Will be merged with defaults in App
        history: []
      }
    };

    saveDB(db);
    return true;
  },

  login: async (username: string, password: string): Promise<BackupData> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const db = getDB();
    const account = db[username];

    if (!account || account.passwordHash !== btoa(password)) {
      throw new Error('Username atau password salah');
    }

    return account.data;
  },

  syncData: async (username: string, data: BackupData): Promise<boolean> => {
    // This saves the current app state to the "Cloud"
    const db = getDB();
    if (db[username]) {
      db[username].data = { ...data, timestamp: Date.now() };
      saveDB(db);
      return true;
    }
    return false;
  }
};
