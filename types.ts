
export enum PermissionType {
  KBM = 'KBM',
  HALAQAH = 'Halaqah',
  KAJIAN = 'Kajian',
  RAPAT = 'Rapat'
}

export interface UserProfile {
  name: string;
  idNumber: string; // No Induk Karyawan
  unit: string; // Unit/Bagian (was group)
  status: string; // Status Karyawan (GHY, Tetap, dll)
  functionalPosition: string; // Jabatan Fungsional
  structuralPosition: string; // Jabatan Struktural
  workload: string; // Beban Jam Kerja
  startTime: string; // Jam Masuk
  endTime: string; // Jam Pulang
}

export interface ScheduleItem {
  id: string;
  dayIndex: number; // 0 = Sunday, 1 = Monday, etc.
  subject: string;
  className: string; // e.g. XI A
  level: string; // e.g. MA
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  note?: string; // Optional task
}

export interface PermissionData {
  type: string; // Changed from PermissionType to string to support custom types
  date: Date;
  reason: string;
  scheduleOverride?: string; // If manually edited
  // Halaqah specific
  halaqahTime?: string;
  halaqahPlace?: string;
  badalSolution?: string;
}

export interface HistoryItem {
  id: string;
  createdAt: number;
  type: string; // Changed to string
  permissionDate: string; // ISO String
  reason: string;
  generatedText: string;
}

export interface BackupData {
  version: number;
  timestamp: number;
  userProfile: UserProfile;
  schedules: ScheduleItem[];
  templates: Record<string, string>; // Changed key to string
  history: HistoryItem[];
}

export interface UserAccount {
  username: string;
  passwordHash: string; // Simple hash for demo
  data: BackupData;
}

export interface UserSession {
  username: string;
  isLoggedIn: boolean;
}

export type ViewDevice = 'mobile' | 'tablet' | 'laptop';

export const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export const DEFAULT_TEMPLATES: Record<string, string> = {
  [PermissionType.KBM]: `SURAT IZIN TIDAK MENGIKUTI KBM

Yth. Bapak Kepala {{unit}}
di tempat

Assalamu'alaikum warahmatullahi wabarokatuh

Dengan surat ini saya memberitahukan bahwa :

Nama : {{nama}}
Guru : {{jabatanStruktural}}

Meminta izin karena tidak bisa mengikuti kegiatan belajar mengajar pada :

Hari/Tanggal : {{dayName}}, {{date}}
Alasan Izin : {{reason}}


Mapel terjadwal :
{{schedule}}

untuk tugas insyaAllah akan kami konfirmasikan ke guru piket hari ini.

Demikian surat ini kami buat dan kami sampaikan dengan sebenar – benarnya.
Atas perhatianya Kami ucapkan jazaakumullah khairan katsiran.

Hormat Kami.


{{nama}}

_________________________`,

  [PermissionType.HALAQAH]: `PESAN IZIN TIDAK MASUK HALAQAH

Assalamu'alaikum Warahmatullahi Wabarakatuh.

Nama : {{nama}}
Hari/Tanggal : {{dayName}}, {{date}}
Waktu Halaqah  : {{waktuHalaqah}}
Tempat Halaqah : {{tempatHalaqah}}

Pesan & Keterangan Izin:
Bismillah ...
{{reason}}

Solusi Badal: {{solusiBadal}}

Jazaakumullahu khoiron atas pengertiannya.
Mohon maaf dan semoga Allah menjaga halaqah kita semua.

Wassalamu'alaikum warahmatullahi wabarokatuh.

_______________`,

  [PermissionType.KAJIAN]: `Bismillah.
Izin melaporkan ketidakhadiran dalam kajian rutin.

Nama: {{nama}}
Unit: {{unit}}
Tanggal: {{date}}
Alasan: {{reason}}

Semoga kajian berjalan lancar. Jazakumullahu khairan.`,

  [PermissionType.RAPAT]: `Selamat {{timeGreeting}},

Izin tidak dapat menghadiri rapat {{unit}} yang diselenggarakan pada:
Tanggal: {{date}}

Dikarenakan: {{reason}}

Mohon maaf atas ketidakhadiran saya, semoga hasil rapat dapat saya pelajari melalui notulensi.

Terima kasih.
{{nama}}`
};
