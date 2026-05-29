import { User, Class, Student, Attendance, ClassDiary, Reward } from '../types';

export const INITIAL_USERS: User[] = [
  { id: 'teacher-nhung', username: 'msnhung', role: 'TEACHER', full_name: 'Ms. Nhung' },
  { id: 'student-quynhchi', username: 'student1', role: 'STUDENT', full_name: 'Quynh Chi' },
  { id: 'student-anhkhoa', username: 'student2', role: 'STUDENT', full_name: 'Anh Khoa' },
  { id: 'student-baongoc', username: 'student3', role: 'STUDENT', full_name: 'Bao Ngoc' },
  { id: 'student-chilan', username: 'student4', role: 'STUDENT', full_name: 'Chi Lan' },
  { id: 'student-duyminh', username: 'student5', role: 'STUDENT', full_name: 'Duy Minh' },
  { id: 'student-haiyen', username: 'student6', role: 'STUDENT', full_name: 'Hai Yen' },
  { id: 'student-longhoang', username: 'student7', role: 'STUDENT', full_name: 'Long Hoang' },
  { id: 'student-maiphuong', username: 'student8', role: 'STUDENT', full_name: 'Mai Phuong' },
  { id: 'student-namanh', username: 'student9', role: 'STUDENT', full_name: 'Nam Anh' },
  { id: 'student-phuclam', username: 'student10', role: 'STUDENT', full_name: 'Phuc Lam' },
];

export const INITIAL_CLASSES: Class[] = [
  { id: 'class-ielts-adv', class_name: 'IELTS Advanced (Room 402)', teacher_id: 'teacher-nhung' },
  { id: 'class-starfish-kids', class_name: 'Starfish Primary Kids (Room 101)', teacher_id: 'teacher-nhung' },
  { id: 'class-toeic-pro', class_name: 'TOEIC Premium Speaking (Room 305)', teacher_id: 'teacher-nhung' }
];

export const INITIAL_STUDENTS: Student[] = [
  { id: 'student-quynhchi', user_id: 'student-quynhchi', class_id: 'class-ielts-adv', current_stars: 38, total_sessions: 24, remaining_sessions: 15 },
  { id: 'student-anhkhoa', user_id: 'student-anhkhoa', class_id: 'class-ielts-adv', current_stars: 24, total_sessions: 24, remaining_sessions: 12 },
  { id: 'student-baongoc', user_id: 'student-baongoc', class_id: 'class-ielts-adv', current_stars: 31, total_sessions: 24, remaining_sessions: 18 },
  { id: 'student-chilan', user_id: 'student-chilan', class_id: 'class-ielts-adv', current_stars: 18, total_sessions: 24, remaining_sessions: 8 },

  { id: 'student-duyminh', user_id: 'student-duyminh', class_id: 'class-starfish-kids', current_stars: 42, total_sessions: 24, remaining_sessions: 20 },
  { id: 'student-haiyen', user_id: 'student-haiyen', class_id: 'class-starfish-kids', current_stars: 27, total_sessions: 24, remaining_sessions: 14 },
  { id: 'student-longhoang', user_id: 'student-longhoang', class_id: 'class-starfish-kids', current_stars: 15, total_sessions: 24, remaining_sessions: 3 },
  { id: 'student-maiphuong', user_id: 'student-maiphuong', class_id: 'class-starfish-kids', current_stars: 33, total_sessions: 24, remaining_sessions: 16 },

  { id: 'student-namanh', user_id: 'student-namanh', class_id: 'class-toeic-pro', current_stars: 21, total_sessions: 24, remaining_sessions: 11 },
  { id: 'student-phuclam', user_id: 'student-phuclam', class_id: 'class-toeic-pro', current_stars: 19, total_sessions: 24, remaining_sessions: 10 }
];

export const INITIAL_ATTENDANCE: Attendance[] = [
  { id: 'att-1', student_id: 'student-quynhchi', date: '2026-05-25', status: 'PRESENT' },
  { id: 'att-2', student_id: 'student-anhkhoa', date: '2026-05-25', status: 'PRESENT' },
  { id: 'att-3', student_id: 'student-baongoc', date: '2026-05-25', status: 'LATE' },
  { id: 'att-4', student_id: 'student-chilan', date: '2026-05-25', status: 'PRESENT' },
  { id: 'att-5', student_id: 'student-duyminh', date: '2026-05-25', status: 'PRESENT' },
  { id: 'att-6', student_id: 'student-haiyen', date: '2026-05-25', status: 'PRESENT' },
  { id: 'att-7', student_id: 'student-longhoang', date: '2026-05-25', status: 'ABSENT' },
  
  { id: 'att-8', student_id: 'student-quynhchi', date: '2026-05-28', status: 'PRESENT' },
  { id: 'att-9', student_id: 'student-anhkhoa', date: '2026-05-28', status: 'PRESENT' },
  { id: 'att-10', student_id: 'student-baongoc', date: '2026-05-28', status: 'PRESENT' },
  { id: 'att-11', student_id: 'student-chilan', date: '2026-05-28', status: 'PRESENT' },
  { id: 'att-12', student_id: 'student-duyminh', date: '2026-05-28', status: 'PRESENT' },
];

export const INITIAL_DIARIES: ClassDiary[] = [
  {
    id: 'diary-1',
    class_id: 'class-ielts-adv',
    date: '2026-05-28',
    topic: 'Advanced Business Nuance',
    homework: 'Review Vocabulary: "Institutional Finance"\nDraft 250-word essay on Corporate Ethics\nListen to podcast: "The Global Economy"'
  },
  {
    id: 'diary-2',
    class_id: 'class-ielts-adv',
    date: '2026-05-25',
    topic: 'Creative Writing Workshop',
    homework: 'Write a short story using 5 new sensory descriptors\nComplete exercise 3 on page 42'
  },
  {
    id: 'diary-3',
    class_id: 'class-starfish-kids',
    date: '2026-05-28',
    topic: 'Alphabet Phonics & Animal Kingdom',
    homework: 'Sing the Phonics Sh-Song with online link\nFill in animal descriptors on page 12 of Starfish Diary\nDraw a happy red starfish'
  },
  {
    id: 'diary-4',
    class_id: 'class-toeic-pro',
    date: '2026-05-28',
    topic: 'E-commerce transactional queries',
    homework: 'Write a professional email refund request response\nFinish vocabulary test sheet Part 5\nIdentify 5 action verbs for trade logistics'
  }
];

export const INITIAL_REWARDS: Reward[] = [
  {
    id: 'reward-1',
    title: 'Signature Tech Pack',
    star_cost: 500,
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=300',
    stock: 2
  },
  {
    id: 'reward-2',
    title: 'The Visionary Pen',
    star_cost: 120,
    image_url: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=300',
    stock: 15
  },
  {
    id: 'reward-3',
    title: 'Elite Canvas Tote',
    star_cost: 80,
    image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=300',
    stock: 30
  },
  {
    id: 'reward-4',
    title: 'Founders Journal',
    star_cost: 150,
    image_url: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=300',
    stock: 8
  }
];
