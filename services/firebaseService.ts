import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot,
  collection,
  query,
  getDocs,
  Timestamp 
} from 'firebase/firestore';
import { BackupData } from '../types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

class FirebaseService {
  auth = auth;
  db = db;

  async register(email: string, password: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async saveUserData(userId: string, data: BackupData): Promise<void> {
    try {
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, {
        ...data,
        lastUpdated: Timestamp.now()
      }, { merge: true });
      
      // Save analytics
      await this.saveAnalytics(userId, 'data_sync');
    } catch (error) {
      console.error('Save data error:', error);
      throw error;
    }
  }

  async getUserData(userId: string): Promise<BackupData | null> {
    try {
      const userDocRef = doc(db, 'users', userId);
      const docSnap = await getDoc(userDocRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          version: data.version || 1,
          timestamp: data.timestamp || Date.now(),
          userProfile: data.userProfile || {},
          schedules: data.schedules || [],
          templates: data.templates || {},
          history: data.history || []
        };
      }
      return null;
    } catch (error) {
      console.error('Get data error:', error);
      throw error;
    }
  }

  subscribeToUserData(userId: string, callback: (data: BackupData | null) => void): () => void {
    const userDocRef = doc(db, 'users', userId);
    
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        callback({
          version: data.version || 1,
          timestamp: data.timestamp || Date.now(),
          userProfile: data.userProfile || {},
          schedules: data.schedules || [],
          templates: data.templates || {},
          history: data.history || []
        });
      } else {
        callback(null);
      }
    }, (error) => {
      console.error('Subscription error:', error);
      callback(null);
    });

    return unsubscribe;
  }

  async saveAnalytics(userId: string, action: string): Promise<void> {
    try {
      const analyticsRef = doc(collection(db, 'analytics'));
      await setDoc(analyticsRef, {
        userId,
        action,
        timestamp: Timestamp.now(),
        userAgent: navigator.userAgent
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }

  async getAllUsers(): Promise<any[]> {
    try {
      const usersQuery = query(collection(db, 'users'));
      const querySnapshot = await getDocs(usersQuery);
      const users: any[] = [];
      
      querySnapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return users;
    } catch (error) {
      console.error('Get all users error:', error);
      return [];
    }
  }

  async getAllAnalytics(): Promise<any[]> {
    try {
      const analyticsQuery = query(collection(db, 'analytics'));
      const querySnapshot = await getDocs(analyticsQuery);
      const analytics: any[] = [];
      
      querySnapshot.forEach((doc) => {
        analytics.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return analytics;
    } catch (error) {
      console.error('Get analytics error:', error);
      return [];
    }
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Email sudah terdaftar';
      case 'auth/invalid-email':
        return 'Email tidak valid';
      case 'auth/weak-password':
        return 'Password terlalu lemah (min 6 karakter)';
      case 'auth/user-not-found':
        return 'Email tidak terdaftar';
      case 'auth/wrong-password':
        return 'Password salah';
      case 'auth/too-many-requests':
        return 'Terlalu banyak percobaan, coba lagi nanti';
      default:
        return 'Terjadi kesalahan, coba lagi';
    }
  }
}

export const firebaseService = new FirebaseService();
