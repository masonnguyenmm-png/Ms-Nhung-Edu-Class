import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useClass } from '../../context/ClassContext';
import { ShieldCheck, User as UserIcon, Bell, Star, Award, BookOpen, School } from 'lucide-react';

export const ResponsiveTopbar: React.FC = () => {
  const { user, activeRole, setRole, activeStudentId, setActiveStudentId } = useAuth();
  const { students, classes, activeClassId, setActiveClassId, users } = useClass();

  // Find the detail for current student being viewed
  const currentStudentDetails = students.find(s => s.id === activeStudentId);
  const activeClass = classes.find(c => c.id === activeClassId);

  // Sync active class with student's assigned class if viewing student portal
  React.useEffect(() => {
    if (activeRole === 'STUDENT' && currentStudentDetails) {
      if (currentStudentDetails.class_id !== activeClassId) {
        setActiveClassId(currentStudentDetails.class_id);
      }
    }
  }, [activeRole, currentStudentDetails, activeClassId, setActiveClassId]);

  // Keep active student in sync when switching classes as a teacher
  React.useEffect(() => {
    if (activeRole === 'TEACHER') {
      const studentsInClass = students.filter(s => s.class_id === activeClassId);
      const isCurrentStudentInSelectedClass = studentsInClass.some(s => s.id === activeStudentId);
      
      if (studentsInClass.length > 0 && !isCurrentStudentInSelectedClass) {
        setActiveStudentId(studentsInClass[0].id);
      }
    }
  }, [activeClassId, activeRole, students, activeStudentId, setActiveStudentId]);

  const getStudentName = (studentId: string) => {
    const userFound = users.find(u => u.id === studentId);
    if (userFound) return userFound.full_name;
    return studentId.replace('student-', '').replace(/^\w/, (c) => c.toUpperCase());
  };

  const getClassNameOfStudent = (studentId: string) => {
    const s = students.find(item => item.id === studentId);
    if (!s) return 'Starfish Center';
    const c = classes.find(item => item.id === s.class_id);
    return c ? c.class_name : 'Starfish Center';
  };

  return (
    <header className="fixed top-0 left-0 right-0 lg:left-72 z-50 flex flex-col md:flex-row justify-between items-center gap-4 px-6 py-4 mx-4 md:mx-8 rounded-2xl md:rounded-full mt-4 bg-white border border-[#E5E2D9] shadow-[0px_20px_40px_rgba(90,90,64,0.04),0px_10px_10px_rgba(0,0,0,0.01)] transition-all">
      {/* Title & Perspective context */}
      <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-between md:justify-start">
        <div className="flex flex-col">
          <h1 className="font-headline-lg font-bold text-primary text-xl md:text-2xl tracking-tight leading-none flex items-center gap-2">
            <span>{activeRole === 'TEACHER' ? "Ms. Nhung's Class" : "Starfish Portfolio"}</span>
          </h1>
          <p className="text-[10px] uppercase text-on-surface-variant font-bold tracking-widest mt-1">
            {activeRole === 'TEACHER' ? (activeClass ? activeClass.class_name : "Selecting Class") : getClassNameOfStudent(activeStudentId)}
          </p>
        </div>

        <div className="h-6 w-px bg-outline-variant/30 hidden md:block"></div>

        {/* Dynamic Class Selector for Ms. Nhung */}
        {activeRole === 'TEACHER' && (
          <div className="flex items-center gap-2 bg-[#F8F7F2] hover:bg-[#F1EFE7] px-3.5 py-1.5 rounded-full border border-[#E5E2D9] transition-all">
            <School size={14} className="text-[#7A786B]" />
            <span className="text-xs font-semibold text-[#5A5A40]">Classroom:</span>
            <select
              value={activeClassId}
              onChange={(e) => setActiveClassId(e.target.value)}
              className="bg-transparent border-none text-xs font-black text-primary focus:ring-0 outline-none cursor-pointer py-0 pl-1 pr-6"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.class_name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Evaluation student selection for Ms. Nhung */}
        {activeRole === 'TEACHER' && (
          <div className="items-center gap-2 bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10 hidden md:flex">
            <span className="text-xs font-semibold text-primary">Active Seat:</span>
            <select
              value={activeStudentId}
              onChange={(e) => setActiveStudentId(e.target.value)}
              className="bg-transparent border-none text-xs font-bold text-primary focus:ring-0 outline-none cursor-pointer py-0 pl-1 pr-6"
            >
              {students.filter(s => s.class_id === activeClassId).map((student) => (
                <option key={student.id} value={student.id}>
                  {getStudentName(student.id)} (⭐️ {student.current_stars})
                </option>
              ))}
              {students.filter(s => s.class_id === activeClassId).length === 0 && (
                <option value="">No students enrolled</option>
              )}
            </select>
          </div>
        )}
      </div>

      {/* Role switchers & Profile badges */}
      <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
        {/* Role Switcher Pill */}
        <div className="flex bg-surface-container-low p-1.5 rounded-full border border-outline-variant/40 shadow-inner">
          <button
            onClick={() => setRole('TEACHER')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeRole === 'TEACHER'
                ? 'bg-primary text-white shadow-md scale-102 font-bold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <ShieldCheck size={14} />
            <span>Teacher Portal</span>
          </button>
          <button
            onClick={() => setRole('STUDENT')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeRole === 'STUDENT'
                ? 'bg-secondary text-white shadow-md scale-102 font-bold'
                : 'text-on-surface-variant hover:text-secondary'
            }`}
          >
            <UserIcon size={14} />
            <span>Student Portal</span>
          </button>
        </div>

        {/* Details & Alerts indicator */}
        <div className="flex items-center gap-4">
          <div className="relative cursor-pointer transition-transform hover:scale-105 active:scale-95">
            <div className="p-2 bg-surface-container-high/40 rounded-full border border-white/40">
              <Bell className="text-primary" size={18} />
            </div>
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-secondary-container rounded-full border-2 border-white"></span>
          </div>

          <div className="flex items-center gap-3 pl-2 border-l border-outline-variant/35">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-primary">
                {activeRole === 'TEACHER' ? 'Ms. Nhung' : getStudentName(activeStudentId)}
              </p>
              <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">
                {activeRole === 'TEACHER' ? 'Senior Instructor' : `Student Wallet: ${currentStudentDetails?.current_stars} Stars`}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-secondary overflow-hidden shadow-sm">
              <img
                src={
                  activeRole === 'TEACHER'
                    ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLaayjt-D8ebD4amFUqQDe2HRPWr4ZHaO4PvaiLPcgFwcobigz1PKaNvQyXvs-WAoVmshjcGrFGRfaJ0rFo26RoM_YIlZedO9GFkTA6eGgTjgxFOKSqHl_dD2ryww93eSfi0f1yyqGYS-lJio3Kk4NW9mmjbzJObQny3kCNAMfPi1uEyC7Lbi8AbrggmGRj3zI0qhik3qYoyqleCn19LQ2xE00PmiKlFRBZuqcJDI8685rxuwcHKFSLb_j_RKEo1JMv082awJP38k'
                    : 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSiVzOzI3tSvcgwWz_59eGMVH95XTHRais6YMxSYJwC5iA0r_NgpWdZ80tiULUdQh38K9cgT5Y04abrxps-mNGa8MmneWtOB3mEaJRWFQXREHQAICAgRWRZFbq06a_4dJf7IwnpmP6_PDJ_wzKeFTlzk8X5AnRvNllEzi5-HmeFwdQnFlIqrpACjN9-09_eDwKxMnM-xGcsuDKFF_jMiaaHYhpbFBb1riwJGWgN7Y3S15WuFpztJZTV3nFmlrG_SSmJWqiTVE4_7o'
                }
                alt="Profile Avatar"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
