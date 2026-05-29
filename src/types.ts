export type UserRole = 'TEACHER' | 'STUDENT';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  full_name: string;
}

export interface Class {
  id: string;
  class_name: string;
  teacher_id: string;
}

export interface Student {
  id: string; // matches users.id or linking to it
  user_id: string;
  class_id: string;
  current_stars: number;
  total_sessions: number;
  remaining_sessions: number;
}

export type AttendanceStatus = 'PRESENT' | 'LATE' | 'ABSENT';

export interface Attendance {
  id: string;
  student_id: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
}

export interface ClassDiary {
  id: string;
  class_id: string;
  date: string; // YYYY-MM-DD
  topic: string;
  homework: string;
}

export interface Reward {
  id: string;
  title: string;
  star_cost: number;
  image_url: string;
  stock: number;
}

export type RedemptionStatus = 'PENDING' | 'CLAIMED';

export interface Redemption {
  id: string;
  student_id: string;
  reward_id: string;
  status: RedemptionStatus;
  created_at: string; // YYYY-MM-DD HH:MM:ss
}

// Global Application Toast notification type
export interface AppToast {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  sound?: boolean;
}
