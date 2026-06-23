import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  activeRole: UserRole | null;
  activeStudentId: string; // current active student perspective
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  setRole: (role: UserRole) => void;
  setActiveStudentId: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('elite_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeRole, setActiveRole] = useState<UserRole | null>(() => {
    return (localStorage.getItem('elite_auth_role') as UserRole) || null;
  });

  // Allows switching which student is viewed or evaluated
  const [activeStudentId, setActiveStudentIdState] = useState<string>(() => {
    return localStorage.getItem('elite_active_student_id') || 'student-quynhchi';
  });

  const setActiveStudentId = (id: string) => {
    setActiveStudentIdState(id);
    localStorage.setItem('elite_active_student_id', id);
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    const cleanUser = username.trim().toLowerCase();
    
    // Validate custom static or custom student password
    if (password === 'password123') {
      try {
        const q = query(collection(db, 'users'), where('username', '==', cleanUser));
        const snap = await getDocs(q);
        
        if (!snap.empty) {
          const foundUser = snap.docs[0].data() as User;
          setUser(foundUser);
          setActiveRole(foundUser.role);
          if (foundUser.role === 'STUDENT') {
            setActiveStudentId(foundUser.id);
          }
          localStorage.setItem('elite_auth_user', JSON.stringify(foundUser));
          localStorage.setItem('elite_auth_role', foundUser.role);
          return true;
        }
      } catch (err) {
        console.error('Login validation error from Firestore:', err);
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setActiveRole(null);
    localStorage.removeItem('elite_auth_user');
    localStorage.removeItem('elite_auth_role');
  };

  const setRole = (role: UserRole) => {
    setActiveRole(role);
    localStorage.setItem('elite_auth_role', role);
    
    // Auto toggle view student logic
    if (role === 'STUDENT' && (!user || user.role === 'TEACHER')) {
      // Viewing as Quynh Chi for student portal testing
      setActiveStudentId('student-quynhchi');
    } else if (role === 'STUDENT' && user && user.role === 'STUDENT') {
      setActiveStudentId(user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeRole,
        activeStudentId,
        login,
        logout,
        setRole,
        setActiveStudentId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
