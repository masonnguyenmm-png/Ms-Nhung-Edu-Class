import React, { useState } from 'react';
import { useClass } from '../../context/ClassContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, 
  Minus, 
  Send, 
  Calendar, 
  Star, 
  Users, 
  Trash2, 
  BookOpen, 
  Clock, 
  School,
  ChevronLeft, 
  ChevronRight, 
  UserPlus, 
  FolderPlus, 
  Grid, 
  List, 
  CheckCircle2, 
  AlertTriangle,
  Info
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const { 
    classes, 
    activeClassId, 
    setActiveClassId, 
    addClass, 
    addStudent, 
    students, 
    attendance, 
    diaries, 
    cycleAttendance, 
    setAttendanceDirect, 
    adjustStars, 
    addDiary, 
    addToast,
    users
  } = useClass();

  const { activeStudentId, setActiveStudentId } = useAuth();

  // Active view tab
  const [viewTab, setViewTab] = useState<'seating' | 'list' | 'database'>('seating');

  // Interactive attendance date control
  const [attendanceDate, setAttendanceDate] = useState<string>('2026-05-29');

  // Dynamic database Hub form states
  const [newClassName, setNewClassName] = useState<string>('');
  const [newStudentName, setNewStudentName] = useState<string>('');
  const [newStudentClass, setNewStudentClass] = useState<string>(activeClassId || '');
  const [newStudentSessions, setNewStudentSessions] = useState<number>(24);

  // Diary publishers form states
  const [topic, setTopic] = useState<string>('');
  const [homework, setHomework] = useState<string>('');

  // Default avatars list mapped for seating
  const studentImages: { [key: string]: string } = {
    'student-quynhchi': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    'student-anhkhoa': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150',
    'student-baongoc': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    'student-chilan': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
    'student-duyminh': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    'student-haiyen': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    'student-longhoang': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    'student-maiphuong': 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=150',
    'student-namanh': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150',
    'student-phuclam': 'https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&q=80&w=150'
  };

  const getStudentImage = (id: string, idx: number) => {
    if (studentImages[id]) return studentImages[id];
    const fallbacks = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150'
    ];
    return fallbacks[idx % fallbacks.length];
  };

  const getStudentName = (studentId: string) => {
    const userFound = users.find(u => u.id === studentId);
    if (userFound) return userFound.full_name;
    return studentId.replace('student-', '').replace(/^\w/, (c) => c.toUpperCase());
  };

  const handlePublishDiary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      addToast('Please enter a topic name before publishing.', 'warning');
      return;
    }
    addDiary(topic, homework, attendanceDate);
    setTopic('');
    setHomework('');
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) {
      addToast('Please input a Class Name.', 'warning');
      return;
    }
    const created = addClass(newClassName);
    setActiveClassId(created.id);
    setNewClassName('');
    setViewTab('seating');
  };

  const handleEnrollStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentClass) {
      addToast('Please provide a student name and class.', 'warning');
      return;
    }
    addStudent(newStudentName, newStudentClass, newStudentSessions);
    setNewStudentName('');
    setViewTab('seating');
  };

  // Helper date lists for navigation
  const dateOptions = ['2026-05-25', '2026-05-26', '2026-05-27', '2026-05-28', '2026-05-29', '2026-05-30'];
  
  const stepDate = (direction: 'prev' | 'next') => {
    const currentIdx = dateOptions.indexOf(attendanceDate);
    if (direction === 'prev' && currentIdx > 0) {
      setAttendanceDate(dateOptions[currentIdx - 1]);
    } else if (direction === 'next' && currentIdx < dateOptions.length - 1) {
      setAttendanceDate(dateOptions[currentIdx + 1]);
    }
  };

  const activeClass = classes.find(c => c.id === activeClassId);

  // Filtration based on Selected Classroom Database
  const filteredStudents = students.filter(s => s.class_id === activeClassId);
  const filteredDiaries = diaries.filter(d => d.class_id === activeClassId);

  // Explicit Attendance Calculations
  const totalEnrolled = filteredStudents.length;
  const attendanceOnDate = attendance.filter(a => a.date === attendanceDate);

  const presentCount = filteredStudents.filter(s => {
    const log = attendanceOnDate.find(a => a.student_id === s.id);
    return log?.status === 'PRESENT';
  }).length;

  const lateCount = filteredStudents.filter(s => {
    const log = attendanceOnDate.find(a => a.student_id === s.id);
    return log?.status === 'LATE';
  }).length;

  const absentCount = filteredStudents.filter(s => {
    const log = attendanceOnDate.find(a => a.student_id === s.id);
    return log?.status === 'ABSENT';
  }).length;

  const unmarkedCount = totalEnrolled - (presentCount + lateCount + absentCount);
  const presentRate = totalEnrolled > 0 ? Math.round(((presentCount + lateCount) / totalEnrolled) * 100) : 0;

  const getAttendanceLog = (studentId: string) => {
    return attendance.find(a => a.student_id === studentId && a.date === attendanceDate) || null;
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Banner HUD with Reactive database info */}
      <section className="relative overflow-hidden rounded-3xl p-8 md:p-10 flex flex-col justify-center bg-gradient-to-br from-primary via-primary-container to-secondary border border-white/10 shadow-[0px_20px_40px_rgba(90,90,64,0.12)]">
        <div className="z-10 relative">
          <span className="inline-block px-4 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold tracking-widest uppercase mb-4">
            Today: May 29, 2026 • Starfish Premium Database
          </span>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="font-headline-xl text-white text-3xl md:text-5xl font-light italic leading-tight mb-2">
                {activeClass ? activeClass.class_name : "No Classroom Selected"}
              </h2>
              <p className="text-white/80 text-xs tracking-wider uppercase font-bold">
                Ms. Nhung's Studio • {totalEnrolled} Active Scholars Enrolled
              </p>
            </div>

            {/* Quick Stats bubble */}
            <div className="bg-white/10 backdrop-blur-md border border-white/25 rounded-2xl p-4 flex gap-6 text-white min-w-[200px] justify-around">
              <div className="text-center">
                <span className="block text-xs text-white/75 font-medium">Attendance Ratio</span>
                <span className="text-2xl font-black text-secondary-container">{presentRate}%</span>
              </div>
              <div className="w-px bg-white/20"></div>
              <div className="text-center">
                <span className="block text-xs text-white/75 font-medium">Active Class</span>
                <span className="text-lg font-black block mt-0.5 uppercase tracking-wide font-mono bg-white/20 px-2 rounded">
                  {activeClassId.replace('class-', '').substring(0, 8)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-6">
            <button 
              onClick={() => addToast(`Started session for ${activeClass?.class_name || 'Class'}!`, 'success')}
              className="bg-secondary-container text-on-secondary-container px-6 py-2.5 rounded-full text-xs font-bold shadow-lg hover:scale-[1.03] active:scale-95 transition-all outline-none"
            >
              Start Live Session
            </button>
            <button 
              onClick={() => setViewTab('database')}
              className="bg-white/10 backdrop-blur-md border border-white/25 text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-white/20 transition-all outline-none flex items-center gap-2"
            >
              <UserPlus size={14} />
              <span>Enroll / Manage Database</span>
            </button>
          </div>
        </div>
        <div className="absolute right-[-5%] top-[-20%] w-[350px] h-[350px] bg-secondary opacity-20 blur-[90px] rounded-full"></div>
      </section>

      {/* Rõ ràng hơn: Attendance Date and Stats Dashboard */}
      <section className="bg-white border border-[#E5E2D9] rounded-3xl p-6 shadow-sm space-y-6">
        
        {/* Date Selector Header block */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#F8F7F2] p-4 rounded-2xl border border-[#E5E2D9]">
          <div className="flex items-center gap-2">
            <Calendar className="text-[#5A5A40]" size={20} />
            <div>
              <h3 className="text-sm font-bold text-primary">Sổ Điểm Danh Lớp Học (Attendance Register)</h3>
              <p className="text-[11px] text-on-surface-variant font-medium">Select a date below to modify or consult history logs</p>
            </div>
          </div>

          {/* Navigational controls */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => stepDate('prev')}
              className="p-2 bg-white hover:bg-neutral-100 rounded-full border border-neutral-200 transition-all text-primary"
              disabled={attendanceDate === dateOptions[0]}
              title="Previous Date"
            >
              <ChevronLeft size={16} />
            </button>
            <select
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="bg-white border border-neutral-200 hover:border-neutral-300 px-4 py-1.5 rounded-full text-xs font-black text-primary focus:ring-0 outline-none cursor-pointer"
            >
              {dateOptions.map((date) => (
                <option key={date} value={date}>
                  {date === '2026-05-29' ? `Today (May 29, 2026)` : date}
                </option>
              ))}
            </select>
            <button 
              onClick={() => stepDate('next')}
              className="p-2 bg-white hover:bg-neutral-100 rounded-full border border-neutral-200 transition-all text-primary"
              disabled={attendanceDate === dateOptions[dateOptions.length - 1]}
              title="Next Date"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Attendance Analytical Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          
          <div className="bg-[#FAF9F6] border border-[#E5E2D9] p-4 rounded-2xl text-center">
            <span className="block text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Enrolled</span>
            <span className="text-3xl font-light font-serif mt-1 text-primary block">{totalEnrolled}</span>
            <span className="text-[9px] text-[#A09E91] mt-1 block">total students</span>
          </div>

          <div className="bg-emerald-50/50 border border-emerald-200/65 p-4 rounded-2xl text-center">
            <span className="block text-[10px] text-emerald-800 uppercase tracking-widest font-bold flex items-center justify-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Present</span>
            </span>
            <span className="text-3xl font-bold mt-1 text-emerald-700 block">{presentCount}</span>
            <span className="text-[9px] text-emerald-600 mt-1 block">on-time scholars</span>
          </div>

          <div className="bg-amber-50/50 border border-amber-200/65 p-4 rounded-2xl text-center">
            <span className="block text-[10px] text-amber-800 uppercase tracking-widest font-bold flex items-center justify-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span>Late</span>
            </span>
            <span className="text-3xl font-bold mt-1 text-amber-700 block">{lateCount}</span>
            <span className="text-[9px] text-amber-600 mt-1 block">came late today</span>
          </div>

          <div className="bg-red-50/50 border border-red-200/65 p-4 rounded-2xl text-center">
            <span className="block text-[10px] text-red-800 uppercase tracking-widest font-bold flex items-center justify-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>Absent</span>
            </span>
            <span className="text-3xl font-bold mt-1 text-red-700 block">{absentCount}</span>
            <span className="text-[9px] text-red-600 mt-1 block">excused / unexcused</span>
          </div>

          <div className="bg-neutral-50/80 border border-neutral-200/80 p-4 rounded-2xl text-center">
            <span className="block text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Unmarked</span>
            <span className="text-3xl font-black mt-1 text-neutral-600 block">{unmarkedCount}</span>
            <span className="text-[9px] text-neutral-400 mt-1 block">unrecorded seats</span>
          </div>

          <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl text-center col-span-2 sm:col-span-1">
            <span className="block text-[10px] text-primary uppercase tracking-widest font-bold">Presence Rate</span>
            <span className="text-3xl font-serif font-light text-primary mt-1 block">{presentRate}%</span>
            <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-primary h-full transition-all duration-500" style={{ width: `${presentRate}%` }}></div>
            </div>
          </div>

        </div>

        {/* Toggler controls for design layout modes */}
        <div className="flex border-b border-[#E5E2D9] pb-4 justify-between items-center flex-wrap gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setViewTab('seating')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                viewTab === 'seating' 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-on-surface-variant hover:bg-neutral-100 hover:text-primary'
              }`}
            >
              <Grid size={14} />
              <span>Sơ Đồ Lớp (Seating Chart)</span>
            </button>
            <button
              onClick={() => setViewTab('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                viewTab === 'list' 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-on-surface-variant hover:bg-neutral-100 hover:text-primary'
              }`}
            >
              <List size={14} />
              <span>Danh Sách Chi Tiết (Explicit Roster)</span>
            </button>
            <button
              onClick={() => setViewTab('database')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                viewTab === 'database' 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-on-surface-variant hover:bg-neutral-100 hover:text-primary'
              }`}
            >
              <School size={14} />
              <span>Cập Nhật Database (Class & Student Enrollment)</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#A09E91] font-bold bg-neutral-50 px-3 py-1.5 rounded-full">
            <Info size={14} />
            <span>Click attendance log pins directly to override any date</span>
          </div>
        </div>

        {/* Tab 1: Seating Chart with interactive clicks */}
        {viewTab === 'seating' && (
          <div className="space-y-4">
            {filteredStudents.length === 0 ? (
              <div className="p-12 text-center bg-[#F8F7F2] rounded-3xl border border-dashed border-[#E5E2D9]">
                <Users size={40} className="text-[#A09E91] mx-auto mb-2" />
                <h4 className="font-bold text-primary">No students enrolled yet</h4>
                <p className="text-xs text-on-surface-variant mt-1 mb-4">You can easily add new students to this class in the Database Hub tab!</p>
                <button 
                  onClick={() => setViewTab('database')}
                  className="px-6 py-2 bg-primary text-white rounded-full text-xs font-bold shadow hover:scale-102 transition-transform"
                >
                  Configure Database
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {filteredStudents.map((student, idx) => {
                  const log = getAttendanceLog(student.id);
                  const isSelected = activeStudentId === student.id;
                  const image = getStudentImage(student.id, idx);
                  const nameClean = getStudentName(student.id);

                  let statusText = 'Unmarked';
                  let statusColor = 'bg-neutral-100 border-neutral-300 text-neutral-600';
                  if (log) {
                    if (log.status === 'PRESENT') {
                      statusText = 'Present';
                      statusColor = 'bg-emerald-600 border-emerald-700 text-white font-bold';
                    } else if (log.status === 'LATE') {
                      statusText = 'Late';
                      statusColor = 'bg-amber-400 border-amber-500 text-black font-semibold';
                    } else {
                      statusText = 'Absent';
                      statusColor = 'bg-red-500 border-red-600 text-white font-bold';
                    }
                  }

                  return (
                    <div
                      key={student.id}
                      onClick={() => cycleAttendance(student.id, attendanceDate)}
                      className={`relative flex flex-col items-center justify-between p-4 rounded-3xl cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-white border-2 border-primary shadow-xl scale-[1.02]' 
                          : 'bg-white hover:bg-[#FAF9F6] border border-[#E5E2D9] shadow-sm hover:scale-[1.01]'
                      }`}
                    >
                      {/* Placement identifier */}
                      <div className="absolute top-3 left-3 w-5 h-5 bg-neutral-100 rounded-full flex items-center justify-center text-[10px] font-bold text-[#5A5A40]">
                        {idx + 1}
                      </div>

                      {/* Display attendance pill */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          cycleAttendance(student.id, attendanceDate);
                        }}
                        className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-bold shadow border ${statusColor}`}
                      >
                        {statusText}
                      </button>

                      {/* Avatar */}
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md mt-6 relative">
                        <img src={image} alt={nameClean} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      </div>

                      {/* Info */}
                      <div className="text-center mt-3 w-full">
                        <h4 className="font-bold text-primary text-sm tracking-tight truncate px-1">{nameClean}</h4>
                        <div className="flex items-center justify-center gap-1 mt-1 bg-secondary/10 py-0.5 px-2 rounded-full w-fit mx-auto border border-secondary/20">
                          <Star size={11} className="text-[#8E8B75] fill-[#8E8B75]" />
                          <span className="text-[11px] font-black text-[#5A5A40]">{student.current_stars} ⭐️</span>
                        </div>
                        <p className="text-[9px] font-bold text-on-surface-variant mt-1.5 uppercase tracking-wide">
                          Tuition Count: <span className={student.remaining_sessions < 4 ? 'text-error font-extrabold' : 'text-primary'}>{student.remaining_sessions} left</span>
                        </p>
                      </div>

                      {/* Quick controls inside seating */}
                      <div className="flex gap-2.5 mt-3 w-full" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => adjustStars(student.id, 1)}
                          className="flex-1 bg-[#FAF9F6] border border-[#E5E2D9] active:bg-[#F1EFE7] py-1.5 rounded-lg flex items-center justify-center text-[#5A5A40] font-black hover:bg-neutral-50 transition-all outline-none"
                          title="Reward point (+1 Star)"
                        >
                          <Plus size={14} />
                        </button>
                        <button
                          onClick={() => adjustStars(student.id, -1)}
                          className="flex-1 bg-red-50/50 border border-red-200 py-1.5 rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white active:scale-95 transition-all text-red-500 text-xs font-semibold"
                          title="Deduct point (-1 Star)"
                        >
                          <Minus size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Tabular Explicit Attendance Roster with precise buttons */}
        {viewTab === 'list' && (
          <div className="overflow-x-auto">
            {filteredStudents.length === 0 ? (
              <div className="p-12 text-center bg-[#F8F7F2] rounded-3xl border border-dashed border-[#E5E2D9]">
                <Users size={40} className="text-[#A09E91] mx-auto mb-2" />
                <h4 className="font-bold text-primary">No students enrolled yet</h4>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E2D9] text-xs font-label-caps uppercase text-[#A09E91] tracking-wider font-bold">
                    <th className="py-3 px-4 w-12">Seat</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4 text-center">Status On Date</th>
                    <th className="py-3 px-4 w-60 text-center">Set Status Direct (Rõ Ràng)</th>
                    <th className="py-3 px-4 text-center">Star Multiplier</th>
                    <th className="py-3 px-4 text-right">Tuition Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-xs">
                  {filteredStudents.map((student, idx) => {
                    const log = getAttendanceLog(student.id);
                    const currentStatus = log?.status || null;
                    const nameClean = getStudentName(student.id);

                    return (
                      <tr key={student.id} className="hover:bg-neutral-50/50 transition-all">
                        <td className="py-4 px-4 font-bold font-mono text-[#A09E91]">{idx + 1}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={getStudentImage(student.id, idx)} 
                              alt={nameClean} 
                              className="w-8 h-8 rounded-full object-cover shadow-sm border border-neutral-200"
                            />
                            <div>
                              <p className="font-bold text-primary text-sm">{nameClean}</p>
                              <p className="text-[10px] text-neutral-400 font-mono">ID: {student.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          {currentStatus === 'PRESENT' && (
                            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase tracking-wider text-[10px] border border-emerald-200">
                              PRESENT (Có mặt)
                            </span>
                          )}
                          {currentStatus === 'LATE' && (
                            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold uppercase tracking-wider text-[10px] border border-amber-200">
                              LATE (Đi muộn)
                            </span>
                          )}
                          {currentStatus === 'ABSENT' && (
                            <span className="px-3 py-1 rounded-full bg-red-100 text-[#C62828] font-bold uppercase tracking-wider text-[10px] border border-red-200">
                              ABSENT (Nghỉ học)
                            </span>
                          )}
                          {currentStatus === null && (
                            <span className="px-3 py-1 rounded-full bg-neutral-150 text-neutral-500 font-bold uppercase tracking-wider text-[10px] border border-neutral-200">
                              UNMARKED (Chưa lưu)
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex justify-center items-center gap-1.5">
                            <button
                              onClick={() => setAttendanceDirect(student.id, attendanceDate, 'PRESENT')}
                              className={`px-2.5 py-1.5 rounded-lg text-[10.5px] font-bold border transition-all ${
                                currentStatus === 'PRESENT'
                                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                                  : 'bg-white hover:bg-emerald-50 text-emerald-700 border-neutral-200'
                              }`}
                            >
                              Present
                            </button>
                            <button
                              onClick={() => setAttendanceDirect(student.id, attendanceDate, 'LATE')}
                              className={`px-2.5 py-1.5 rounded-lg text-[10.5px] font-bold border transition-all ${
                                currentStatus === 'LATE'
                                  ? 'bg-amber-400 text-black border-amber-500 shadow-sm'
                                  : 'bg-white hover:bg-amber-50 text-amber-700 border-neutral-200'
                              }`}
                            >
                              Late
                            </button>
                            <button
                              onClick={() => setAttendanceDirect(student.id, attendanceDate, 'ABSENT')}
                              className={`px-2.5 py-1.5 rounded-lg text-[10.5px] font-bold border transition-all ${
                                currentStatus === 'ABSENT'
                                  ? 'bg-red-500 text-white border-red-650 shadow-sm'
                                  : 'bg-white hover:bg-red-50 text-red-650 border-neutral-200'
                              }`}
                            >
                              Absent
                            </button>
                            <button
                              onClick={() => setAttendanceDirect(student.id, attendanceDate, null)}
                              className="px-2 py-1.5 rounded-lg text-[10px] font-semibold text-neutral-400 hover:text-red-500 border border-neutral-200 hover:border-red-200 bg-white hover:bg-red-50 transition-all icon"
                              title="Reset to unmarked"
                            >
                              Reset
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => adjustStars(student.id, 1)}
                              className="p-1.5 bg-[#F8F7F2] border border-[#E5E2D9] text-[#5A5A40] font-black rounded-lg hover:scale-105 transition-all outline-none"
                            >
                              <Plus size={12} />
                            </button>
                            <span className="font-bold text-primary font-mono text-xs">{student.current_stars} ⭐️</span>
                            <button 
                              onClick={() => adjustStars(student.id, -1)}
                              className="p-1.5 bg-[#F8F7F2] border border-[#E5E2D9] text-[#5A5A40] font-black rounded-lg hover:scale-105 transition-all outline-none"
                            >
                              <Minus size={12} />
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <p className="font-bold text-primary">{student.remaining_sessions} / {student.total_sessions} sessions</p>
                          <p className={`text-[10px] font-bold ${student.remaining_sessions < 4 ? 'text-error font-extrabold' : 'text-neutral-400'}`}>
                            {student.remaining_sessions < 4 ? '⚠️ Tuition Renewal Alert' : '✓ Good Standing'}
                          </p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab 3: Classroom & Students database builder */}
        {viewTab === 'database' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Form list and creation of Classes */}
            <div className="bg-[#FAF9F6] border border-[#E5E2D9] p-6 rounded-2xl space-y-4">
              <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                <FolderPlus size={16} className="text-[#8E8B75]" />
                <span>1. Tạo Lớp Học Mới (Add New Class)</span>
              </h4>
              <p className="text-[11px] text-on-surface-variant leading-relaxed font-medium">Instantly publishes a distinct separate classroom database. Each class gets its own roster of students and isolated diaries feed.</p>
              
              <form onSubmit={handleCreateClass} className="space-y-3 pt-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#7A786B] mb-1">Class Name (Include Room No.)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Starfish Primary Kids Phase 1 (Room 102)"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    className="w-full bg-white px-4 py-2 text-xs rounded-full border border-neutral-300 focus:ring-1 focus:ring-[#8E8B75] outline-none text-primary font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-primary text-white text-xs font-bold rounded-full shadow hover:scale-[1.01] hover:bg-opacity-90 transition-transform flex items-center justify-center gap-2 outline-none"
                >
                  <Plus size={14} />
                  <span>Create Class Database</span>
                </button>
              </form>

              <div className="mt-4 pt-4 border-t border-[#E5E2D9]">
                <h5 className="text-xs uppercase font-bold text-[#7A786B] mb-2">Current Active Databases:</h5>
                <div className="space-y-2">
                  {classes.map(c => {
                    const count = students.filter(s => s.class_id === c.id).length;
                    return (
                      <div key={c.id} className="flex justify-between items-center py-1.5 px-3 bg-white border border-neutral-200 rounded-lg text-xs">
                        <span className="font-bold text-primary">{c.class_name}</span>
                        <span className="text-[10px] font-mono font-bold bg-[#FAF9F6] px-2 py-0.5 border border-neutral-100 rounded text-[#8E8B75]">
                          {count} students
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Student dynamic enrollment */}
            <div className="bg-[#FAF9F6] border border-[#E5E2D9] p-6 rounded-2xl space-y-4">
              <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                <UserPlus size={16} className="text-[#8E8B75]" />
                <span>2. Đăng Ký Học Viên Mới (Enroll New Student)</span>
              </h4>
              <p className="text-[11px] text-on-surface-variant leading-relaxed font-medium">Add a scholar into the selected class. This automatically generates a secure student role login and credentials link.</p>

              <form onSubmit={handleEnrollStudent} className="space-y-3 pt-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#7A786B] mb-1">Student Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nguyen Thu Trang"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    className="w-full bg-white px-4 py-2 text-xs rounded-full border border-neutral-300 focus:ring-1 focus:ring-[#8E8B75] outline-none text-primary font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#7A786B] mb-1">Class Assigned</label>
                    <select
                      value={newStudentClass}
                      onChange={(e) => setNewStudentClass(e.target.value)}
                      className="w-full bg-white px-3 py-2 text-xs rounded-full border border-neutral-300 focus:ring-1 focus:ring-[#8E8B75] outline-none text-primary font-bold"
                    >
                      {classes.map(c => (
                        <option key={c.id} value={c.id}>{c.class_name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#7A786B] mb-1">Tuition Unit Credit</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={96}
                      value={newStudentSessions}
                      onChange={(e) => setNewStudentSessions(Number(e.target.value))}
                      className="w-full bg-white px-4 py-2 text-xs rounded-full border border-neutral-300 focus:ring-1 focus:ring-[#8E8B75] outline-none text-primary font-bold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-secondary text-white text-xs font-bold rounded-full shadow hover:scale-[1.01] hover:bg-opacity-90 transition-transform flex items-center justify-center gap-2 outline-none"
                >
                  <Plus size={14} />
                  <span>Enroll Scholar</span>
                </button>
              </form>

              <div className="bg-white/60 p-3 rounded-xl border border-neutral-200 text-[10.5px] leading-relaxed text-[#5A5A40] space-y-1 font-medium">
                <p className="font-bold flex items-center gap-1">
                  <Info size={12} />
                  <span>Student Credentials Info:</span>
                </p>
                <p>Upon addition, the student is available in the Student Portal tab. The account will support the standard login password (<code>password123</code>).</p>
              </div>
            </div>

          </div>
        )}

      </section>

      {/* Bento Layout Secondary grid: Homework diary and historical ledger */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Homework diary publishing module */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#E5E2D9] shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-headline-lg text-primary text-xl font-bold mb-1 flex items-center gap-2">
              <BookOpen size={20} className="text-[#8E8B75]" />
              <span>Instant Class Diary Publisher</span>
            </h4>
            <p className="text-xs text-on-surface-variant mb-4 font-semibold">
              Publish topic & homework reminders instantly for the active class: <span className="text-[#5A5A40] bg-[#F8F7F2] p-1 rounded font-black">{activeClass?.class_name || 'Class'}</span>
            </p>

            <form onSubmit={handlePublishDiary} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-[#7A786B] mb-1">
                  Topics Discussed Today
                </label>
                <input
                  type="text"
                  placeholder="e.g. Phonetics Masterclass & Speaking Skills"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-[#FAF9F6] px-4 py-2.5 text-xs rounded-full border border-neutral-200 focus:ring-1 focus:ring-secondary focus:border-secondary outline-none text-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-[#7A786B] mb-1">
                  Homework Tasks (one task per line for student checkoff)
                </label>
                <textarea
                  rows={4}
                  placeholder={`Review Vocabulary sheet Unit 2&#10;Complete descriptive writing essay`}
                  value={homework}
                  onChange={(e) => setHomework(e.target.value)}
                  className="w-full bg-[#FAF9F6] px-4 py-3 text-xs rounded-2xl border border-neutral-200 focus:ring-1 focus:ring-secondary focus:border-secondary outline-none text-primary font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary text-white rounded-full font-button text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:bg-opacity-95 transition-all outline-none"
              >
                <Send size={14} />
                <span>Publish Class Diary</span>
              </button>
            </form>
          </div>
        </div>

        {/* Dynamic Class Diaries list */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#E5E2D9] shadow-sm">
          <h4 className="font-headline-lg text-primary text-xl font-bold mb-1 flex items-center gap-2">
            <Calendar size={20} className="text-[#8E8B75]" />
            <span>Class Diaries Feed</span>
          </h4>
          <p className="text-xs text-on-surface-variant mb-4">Displaying all published registers & tasks associated with the active class.</p>
          
          <div className="space-y-4 max-h-[330px] overflow-y-auto pr-2">
            {filteredDiaries.length === 0 ? (
              <div className="p-8 text-center bg-neutral-50 rounded-2xl border border-dashed border-neutral-200 text-neutral-400">
                No class journals or lessons published for this class yet.
              </div>
            ) : (
              filteredDiaries.map((diary) => (
                <div key={diary.id} className="p-4 bg-[#FAF9F6] rounded-2xl border border-neutral-200 hover:border-neutral-300 transition-colors">
                  <div className="flex justify-between items-center mb-1 flex-wrap gap-2">
                    <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full font-bold">
                      {diary.topic}
                    </span>
                    <span className="text-[10px] font-bold text-on-surface-variant font-mono">
                      {diary.date}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-on-surface-variant leading-relaxed whitespace-pre-line bg-white p-3 rounded-xl border border-neutral-200 pl-4 border-l-4 border-l-[#8E8B75]">
                    {diary.homework}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </section>
    </div>
  );
};
