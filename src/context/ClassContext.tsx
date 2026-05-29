import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student, Attendance, ClassDiary, Reward, Redemption, AppToast, AttendanceStatus, Class, User } from '../types';
import { 
  INITIAL_STUDENTS, 
  INITIAL_REWARDS, 
  INITIAL_ATTENDANCE, 
  INITIAL_DIARIES,
  INITIAL_USERS,
  INITIAL_CLASSES
} from '../data/mockData';
import { synths } from '../utils/audio';

interface ClassContextType {
  classes: Class[];
  activeClassId: string;
  setActiveClassId: (id: string) => void;
  addClass: (className: string) => Class;
  addStudent: (fullName: string, classId: string, remainingSessions: number) => Student;
  users: User[];
  students: Student[];
  attendance: Attendance[];
  diaries: ClassDiary[];
  rewards: Reward[];
  redemptions: Redemption[];
  toasts: AppToast[];
  addToast: (message: string, type: 'success' | 'warning' | 'info' | 'error', playSound?: boolean) => void;
  removeToast: (id: string) => void;
  cycleAttendance: (studentId: string, date: string) => void;
  setAttendanceDirect: (studentId: string, date: string, status: AttendanceStatus | null) => void;
  adjustStars: (studentId: string, amount: number) => void;
  addDiary: (topic: string, homework: string, date: string) => void;
  redeemReward: (studentId: string, rewardId: string) => { success: boolean; message: string };
  triggerForceConfettiBurst: () => void;
  confettiTriggerCount: number;
}

const ClassContext = createContext<ClassContextType | undefined>(undefined);

export const ClassProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Loaded from LocalStorage or pre-seeded mockData
  const [classes, setClasses] = useState<Class[]>(() => {
    const saved = localStorage.getItem('elite_db_classes');
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });

  const [activeClassId, setActiveClassIdState] = useState<string>(() => {
    return localStorage.getItem('elite_active_class_id') || 'class-ielts-adv';
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('elite_db_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('elite_db_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [attendance, setAttendance] = useState<Attendance[]>(() => {
    const saved = localStorage.getItem('elite_db_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [diaries, setDiaries] = useState<ClassDiary[]>(() => {
    const saved = localStorage.getItem('elite_db_diaries');
    return saved ? JSON.parse(saved) : INITIAL_DIARIES;
  });

  const [rewards, setRewards] = useState<Reward[]>(() => {
    const saved = localStorage.getItem('elite_db_rewards');
    return saved ? JSON.parse(saved) : INITIAL_REWARDS;
  });

  const [redemptions, setRedemptions] = useState<Redemption[]>(() => {
    const saved = localStorage.getItem('elite_db_redemptions');
    return saved ? JSON.parse(saved) : [];
  });

  // Global custom styled notification toasts state
  const [toasts, setToasts] = useState<AppToast[]>([]);
  const [confettiTriggerCount, setConfettiTriggerCount] = useState(0);

  const setActiveClassId = (id: string) => {
    setActiveClassIdState(id);
    localStorage.setItem('elite_active_class_id', id);
  };

  // Auto save database states to LocalStorage upon changes
  useEffect(() => {
    localStorage.setItem('elite_db_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('elite_db_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('elite_db_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('elite_db_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('elite_db_diaries', JSON.stringify(diaries));
  }, [diaries]);

  useEffect(() => {
    localStorage.setItem('elite_db_rewards', JSON.stringify(rewards));
  }, [rewards]);

  useEffect(() => {
    localStorage.setItem('elite_db_redemptions', JSON.stringify(redemptions));
  }, [redemptions]);

  // Sync listener to guarantee instant tabs or portal-switcher reactivity in real time
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'elite_db_classes' && e.newValue) {
        setClasses(JSON.parse(e.newValue));
      }
      if (e.key === 'elite_db_users' && e.newValue) {
        setUsers(JSON.parse(e.newValue));
      }
      if (e.key === 'elite_db_students' && e.newValue) {
        setStudents(JSON.parse(e.newValue));
      }
      if (e.key === 'elite_db_attendance' && e.newValue) {
        setAttendance(JSON.parse(e.newValue));
      }
      if (e.key === 'elite_db_diaries' && e.newValue) {
        setDiaries(JSON.parse(e.newValue));
      }
      if (e.key === 'elite_db_rewards' && e.newValue) {
        setRewards(JSON.parse(e.newValue));
      }
      if (e.key === 'elite_db_redemptions' && e.newValue) {
        setRedemptions(JSON.parse(e.newValue));
      }
      if (e.key === 'elite_active_class_id' && e.newValue) {
        setActiveClassIdState(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addToast = (message: string, type: 'success' | 'warning' | 'info' | 'error', playSound = true) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (playSound) {
      if (type === 'success') synths.playCheer();
      else if (type === 'error' || type === 'warning') synths.playError();
      else synths.playPop();
    }

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const triggerForceConfettiBurst = () => {
    setConfettiTriggerCount((c) => c + 1);
  };

  const getStudentName = (studentId: string) => {
    const userFound = users.find(u => u.id === studentId);
    if (userFound) return userFound.full_name;
    return studentId.replace('student-', '').replace(/^\w/, (c) => c.toUpperCase());
  };

  // Direct set attendance status with relational tuition session mapping
  const setAttendanceDirect = (studentId: string, date: string, status: AttendanceStatus | null) => {
    const existingIndex = attendance.findIndex(
      (a) => a.student_id === studentId && a.date === date
    );

    let updatedAttendance = [...attendance];
    let sessionDelta = 0;

    const oldStatus = existingIndex === -1 ? null : attendance[existingIndex].status;
    const wasConsuming = oldStatus === 'PRESENT' || oldStatus === 'LATE';
    const isConsuming = status === 'PRESENT' || status === 'LATE';

    if (wasConsuming && !isConsuming) {
      sessionDelta = 1; // refund session
    } else if (!wasConsuming && isConsuming) {
      sessionDelta = -1; // consume session
    }

    if (status === null) {
      if (existingIndex !== -1) {
        updatedAttendance.splice(existingIndex, 1);
      }
    } else {
      if (existingIndex === -1) {
        updatedAttendance.push({
          id: `att-${Date.now()}-${studentId}`,
          student_id: studentId,
          date,
          status,
        });
      } else {
        updatedAttendance[existingIndex] = {
          ...updatedAttendance[existingIndex],
          status,
        };
      }
    }

    setAttendance(updatedAttendance);

    if (sessionDelta !== 0) {
      setStudents((prevStudents) =>
        prevStudents.map((s) => {
          if (s.id === studentId) {
            const newRemaining = Math.max(0, s.remaining_sessions + sessionDelta);
            if (newRemaining < 4 && newRemaining !== s.remaining_sessions) {
              addToast(`Tuition Alert: ${s.id === 'student-quynhchi' ? 'Your' : getStudentName(s.id)}'s tuition has only ${newRemaining} sessions left!`, 'warning', false);
            }
            return {
              ...s,
              remaining_sessions: newRemaining,
            };
          }
          return s;
        })
      );
    }

    // Play feedback sound
    if (status === 'PRESENT') synths.playDing();
    else if (status === 'LATE') synths.playPop();
    else if (status === 'ABSENT') synths.playError();
    else synths.playPop();

    // Visual feedback toasts
    const sName = getStudentName(studentId);
    if (status) {
      addToast(
        `${sName} marked ${status} (${sessionDelta < 0 ? '-1 session deducted' : sessionDelta > 0 ? '+1 session refunded' : 'session unchanged'})`,
        status === 'PRESENT' ? 'success' : status === 'LATE' ? 'warning' : 'error',
        false
      );
    } else {
      addToast(`Cleared attendance log for ${sName}`, 'info', false);
    }
  };

  // 1-Click Cycle Attendance Toggle
  const cycleAttendance = (studentId: string, date: string) => {
    const existingIndex = attendance.findIndex(
      (a) => a.student_id === studentId && a.date === date
    );

    let nextStatus: AttendanceStatus | null = null;
    if (existingIndex === -1) {
      nextStatus = 'PRESENT';
    } else {
      const currentStatus = attendance[existingIndex].status;
      if (currentStatus === 'PRESENT') nextStatus = 'LATE';
      else if (currentStatus === 'LATE') nextStatus = 'ABSENT';
      else nextStatus = null;
    }

    setAttendanceDirect(studentId, date, nextStatus);
  };

  // Gamified star increments/decrements with live sound and particles mapping
  const adjustStars = (studentId: string, amount: number) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const newStars = Math.max(0, s.current_stars + amount);
          if (amount > 0) {
            synths.playDing();
            triggerForceConfettiBurst();
          } else {
            synths.playPop();
          }
          return {
            ...s,
            current_stars: newStars,
          };
        }
        return s;
      })
    );
  };

  // Ms. Nhung's Class Diary Entry publishing
  const addDiary = (topic: string, homework: string, date: string) => {
    const newEntry: ClassDiary = {
      id: `diary-${Date.now()}`,
      class_id: activeClassId,
      date,
      topic,
      homework,
    };

    setDiaries((prev) => [newEntry, ...prev]);
    addToast(`New Class Diary Published: "${topic}"!`, 'success');
  };

  // Add Class dynamically
  const addClass = (className: string) => {
    const classId = `class-${Date.now()}`;
    const newClass: Class = {
      id: classId,
      class_name: className,
      teacher_id: 'teacher-nhung',
    };
    setClasses((prev) => [...prev, newClass]);
    addToast(`Successfully created class: "${className}"!`, 'success');
    return newClass;
  };

  // Enroll Student dynamically
  const addStudent = (fullName: string, classId: string, remainingSessions: number = 24) => {
    const cleanId = 'student-' + fullName.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
    const studentId = `${cleanId}-${Date.now()}`;
    const username = cleanId.replace('student-', '') + Math.floor(Math.random() * 90 + 10);

    const newUser: User = {
      id: studentId,
      username,
      role: 'STUDENT',
      full_name: fullName,
    };

    const newStudent: Student = {
      id: studentId,
      user_id: studentId,
      class_id: classId,
      current_stars: 0,
      total_sessions: remainingSessions,
      remaining_sessions: remainingSessions,
    };

    setUsers((prev) => [...prev, newUser]);
    setStudents((prev) => [...prev, newStudent]);
    addToast(`Successfully enrolled "${fullName}" to Starfish. Username is "${username}", password: "password123"!`, 'success');
    return newStudent;
  };

  // Interactive micro-reward store redemption transaction engine
  const redeemReward = (studentId: string, rewardId: string): { success: boolean; message: string } => {
    const student = students.find((s) => s.id === studentId);
    const reward = rewards.find((r) => r.id === rewardId);

    if (!student || !reward) {
      return { success: false, message: 'Invalid transaction parameters.' };
    }

    if (student.current_stars < reward.star_cost) {
      synths.playError();
      addToast(`Earn More Stars! Required: ${reward.star_cost} ⭐️ (You have ${student.current_stars} ⭐️)`, 'error', false);
      return { success: false, message: 'Earn More Stars!' };
    }

    if (reward.stock <= 0) {
      synths.playError();
      addToast('Sorry, this reward is currently out of stock!', 'warning');
      return { success: false, message: 'Reward out of stock!' };
    }

    // Deduct Stars and Stock, create redemption log
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          return { ...s, current_stars: s.current_stars - reward.star_cost };
        }
        return s;
      })
    );

    setRewards((prev) =>
      prev.map((r) => {
        if (r.id === rewardId) {
          return { ...r, stock: r.stock - 1 };
        }
        return r;
      })
    );

    const newRedemption: Redemption = {
      id: `redemp-${Date.now()}`,
      student_id: studentId,
      reward_id: rewardId,
      status: 'PENDING',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    setRedemptions((prev) => [newRedemption, ...prev]);
    triggerForceConfettiBurst();
    synths.playCheer();
    addToast(`Successfully Redeemed ${reward.title}!`, 'success', false);

    return { success: true, message: 'Gift Claimed Successfully!' };
  };

  return (
    <ClassContext.Provider
      value={{
        classes,
        activeClassId,
        setActiveClassId,
        addClass,
        addStudent,
        users,
        students,
        attendance,
        diaries,
        rewards,
        redemptions,
        toasts,
        addToast,
        removeToast,
        cycleAttendance,
        setAttendanceDirect,
        adjustStars,
        addDiary,
        redeemReward,
        triggerForceConfettiBurst,
        confettiTriggerCount,
      }}
    >
      {children}
    </ClassContext.Provider>
  );
};

export const useClass = () => {
  const context = useContext(ClassContext);
  if (!context) {
    throw new Error('useClass must be used within a ClassProvider');
  }
  return context;
};
