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
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs,
  getDoc
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

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
  const [classes, setClasses] = useState<Class[]>(INITIAL_CLASSES);
  const [activeClassId, setActiveClassIdState] = useState<string>(() => {
    return localStorage.getItem('elite_active_class_id') || 'class-ielts-adv';
  });

  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [attendance, setAttendance] = useState<Attendance[]>(INITIAL_ATTENDANCE);
  const [diaries, setDiaries] = useState<ClassDiary[]>(INITIAL_DIARIES);
  const [rewards, setRewards] = useState<Reward[]>(INITIAL_REWARDS);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);

  // Global custom styled notification toasts state
  const [toasts, setToasts] = useState<AppToast[]>([]);
  const [confettiTriggerCount, setConfettiTriggerCount] = useState(0);

  const setActiveClassId = (id: string) => {
    setActiveClassIdState(id);
    localStorage.setItem('elite_active_class_id', id);
  };

  // 1. One-time Bootstrap checking of Firestore. Seed with INITIAL mockData if totally empty
  useEffect(() => {
    const bootstrapFirestoreIfNeeded = async () => {
      try {
        const classesSnap = await getDocs(collection(db, 'classes'));
        if (classesSnap.empty) {
          console.log("Seeding empty Firestore database with default Starfish data...");
          
          for (const item of INITIAL_USERS) {
            await setDoc(doc(db, 'users', item.id), item);
          }
          for (const item of INITIAL_CLASSES) {
            await setDoc(doc(db, 'classes', item.id), item);
          }
          for (const item of INITIAL_STUDENTS) {
            await setDoc(doc(db, 'students', item.id), item);
          }
          for (const item of INITIAL_ATTENDANCE) {
            await setDoc(doc(db, 'attendance', item.id), item);
          }
          for (const item of INITIAL_DIARIES) {
            await setDoc(doc(db, 'diaries', item.id), item);
          }
          for (const item of INITIAL_REWARDS) {
            await setDoc(doc(db, 'rewards', item.id), item);
          }
          console.log("Firestore standard seeding complete.");
        }
      } catch (err) {
        console.error("Firestore bootstrap failed:", err);
      }
    };

    bootstrapFirestoreIfNeeded();
  }, []);

  // 2. Real-time Firebase Firestore state synchronizer via onSnapshot
  useEffect(() => {
    const unsubClasses = onSnapshot(collection(db, 'classes'), (snap) => {
      const list: Class[] = [];
      snap.forEach((d) => list.push(d.data() as Class));
      if (list.length > 0) setClasses(list);
    }, (err) => handleFirestoreError(err, OperationType.GET, 'classes'));

    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      const list: User[] = [];
      snap.forEach((d) => list.push(d.data() as User));
      if (list.length > 0) setUsers(list);
    }, (err) => handleFirestoreError(err, OperationType.GET, 'users'));

    const unsubStudents = onSnapshot(collection(db, 'students'), (snap) => {
      const list: Student[] = [];
      snap.forEach((d) => list.push(d.data() as Student));
      if (list.length > 0) setStudents(list);
    }, (err) => handleFirestoreError(err, OperationType.GET, 'students'));

    const unsubAttendance = onSnapshot(collection(db, 'attendance'), (snap) => {
      const list: Attendance[] = [];
      snap.forEach((d) => list.push(d.data() as Attendance));
      setAttendance(list);
    }, (err) => handleFirestoreError(err, OperationType.GET, 'attendance'));

    const unsubDiaries = onSnapshot(collection(db, 'diaries'), (snap) => {
      const list: ClassDiary[] = [];
      snap.forEach((d) => list.push(d.data() as ClassDiary));
      list.sort((a, b) => b.date.localeCompare(a.date));
      setDiaries(list);
    }, (err) => handleFirestoreError(err, OperationType.GET, 'diaries'));

    const unsubRewards = onSnapshot(collection(db, 'rewards'), (snap) => {
      const list: Reward[] = [];
      snap.forEach((d) => list.push(d.data() as Reward));
      if (list.length > 0) setRewards(list);
    }, (err) => handleFirestoreError(err, OperationType.GET, 'rewards'));

    const unsubRedemptions = onSnapshot(collection(db, 'redemptions'), (snap) => {
      const list: Redemption[] = [];
      snap.forEach((d) => list.push(d.data() as Redemption));
      list.sort((a, b) => b.created_at.localeCompare(a.created_at));
      setRedemptions(list);
    }, (err) => handleFirestoreError(err, OperationType.GET, 'redemptions'));

    return () => {
      unsubClasses();
      unsubUsers();
      unsubStudents();
      unsubAttendance();
      unsubDiaries();
      unsubRewards();
      unsubRedemptions();
    };
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

  // Direct set attendance status with relational tuition session mapping in Firestore
  const setAttendanceDirect = (studentId: string, date: string, status: AttendanceStatus | null) => {
    const existingIndex = attendance.findIndex(
      (a) => a.student_id === studentId && a.date === date
    );

    let sessionDelta = 0;
    const oldStatus = existingIndex === -1 ? null : attendance[existingIndex].status;
    const wasConsuming = oldStatus === 'PRESENT' || oldStatus === 'LATE';
    const isConsuming = status === 'PRESENT' || status === 'LATE';

    if (wasConsuming && !isConsuming) {
      sessionDelta = 1; // refund session
    } else if (!wasConsuming && isConsuming) {
      sessionDelta = -1; // consume session
    }

    const attendanceId = existingIndex === -1 ? `att-${Date.now()}-${studentId}` : attendance[existingIndex].id;

    if (status === null) {
      if (existingIndex !== -1) {
        deleteDoc(doc(db, 'attendance', attendanceId))
          .catch(e => handleFirestoreError(e, OperationType.DELETE, `attendance/${attendanceId}`));
      }
    } else {
      const attRecord: Attendance = {
        id: attendanceId,
        student_id: studentId,
        date,
        status,
      };
      setDoc(doc(db, 'attendance', attendanceId), attRecord)
        .catch(e => handleFirestoreError(e, OperationType.WRITE, `attendance/${attendanceId}`));
    }

    if (sessionDelta !== 0) {
      const studentObj = students.find((s) => s.id === studentId);
      if (studentObj) {
        const newRemaining = Math.max(0, studentObj.remaining_sessions + sessionDelta);
        if (newRemaining < 4 && newRemaining !== studentObj.remaining_sessions) {
          addToast(
            `Tuition Alert: ${studentObj.id === 'student-quynhchi' ? 'Your' : getStudentName(studentObj.id)}'s tuition has only ${newRemaining} sessions left!`,
            'warning',
            false
          );
        }
        setDoc(doc(db, 'students', studentId), {
          ...studentObj,
          remaining_sessions: newRemaining,
        }).catch(e => handleFirestoreError(e, OperationType.WRITE, `students/${studentId}`));
      }
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

  // Gamified star increments/decrements mapped to Firestore
  const adjustStars = (studentId: string, amount: number) => {
    const s = students.find((item) => item.id === studentId);
    if (!s) return;
    const newStars = Math.max(0, s.current_stars + amount);

    setDoc(doc(db, 'students', studentId), {
      ...s,
      current_stars: newStars,
    })
      .then(() => {
        if (amount > 0) {
          synths.playDing();
          triggerForceConfettiBurst();
        } else {
          synths.playPop();
        }
      })
      .catch((e) => handleFirestoreError(e, OperationType.WRITE, `students/${studentId}`));
  };

  // Ms. Nhung's Class Diary Entry publishing mapped to Firestore
  const addDiary = (topic: string, homework: string, date: string) => {
    const diaryId = `diary-${Date.now()}`;
    const newEntry: ClassDiary = {
      id: diaryId,
      class_id: activeClassId,
      date,
      topic,
      homework,
    };

    setDoc(doc(db, 'diaries', diaryId), newEntry)
      .then(() => {
        addToast(`New Class Diary Published: "${topic}"!`, 'success');
      })
      .catch((e) => handleFirestoreError(e, OperationType.WRITE, `diaries/${diaryId}`));
  };

  // Add Class dynamically mapped to Firestore
  const addClass = (className: string) => {
    const classId = `class-${Date.now()}`;
    const newClass: Class = {
      id: classId,
      class_name: className,
      teacher_id: 'teacher-nhung',
    };
    
    setDoc(doc(db, 'classes', classId), newClass)
      .then(() => {
        addToast(`Successfully created class: "${className}"!`, 'success');
      })
      .catch((e) => handleFirestoreError(e, OperationType.WRITE, `classes/${classId}`));
      
    return newClass;
  };

  // Enroll Student dynamically mapped to Firestore users + students
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

    setDoc(doc(db, 'users', studentId), newUser)
      .catch((err) => handleFirestoreError(err, OperationType.WRITE, `users/${studentId}`));
      
    setDoc(doc(db, 'students', studentId), newStudent)
      .catch((err) => handleFirestoreError(err, OperationType.WRITE, `students/${studentId}`));

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

    // Update in Firestore
    const redempId = `redemp-${Date.now()}`;
    const newRedemption: Redemption = {
      id: redempId,
      student_id: studentId,
      reward_id: rewardId,
      status: 'PENDING',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    setDoc(doc(db, 'students', studentId), { ...student, current_stars: student.current_stars - reward.star_cost })
      .catch((e) => handleFirestoreError(e, OperationType.WRITE, `students/${studentId}`));

    setDoc(doc(db, 'rewards', rewardId), { ...reward, stock: reward.stock - 1 })
      .catch((e) => handleFirestoreError(e, OperationType.WRITE, `rewards/${rewardId}`));

    setDoc(doc(db, 'redemptions', redempId), newRedemption)
      .catch((e) => handleFirestoreError(e, OperationType.WRITE, `redemptions/${redempId}`));

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
