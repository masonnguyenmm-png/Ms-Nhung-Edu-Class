import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ClassProvider, useClass } from './context/ClassContext';
import { SidebarLayout } from './components/shared/SidebarLayout';
import { ResponsiveTopbar } from './components/shared/ResponsiveTopbar';
import { LoginGate } from './components/shared/LoginGate';
import { TeacherDashboard } from './views/teacher/TeacherDashboard';
import { StudentPortal } from './views/student/StudentPortal';
import { ConfettiCanvas } from './components/ui/ConfettiCanvas';
import { ToastOverlay } from './components/ui/ToastOverlay';
import { School, BookOpen, CalendarDays, Compass, Sparkles, Settings as SettingsIcon, Milestone, HelpCircle, GraduationCap } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { user, activeRole } = useAuth();
  const { addToast } = useClass();
  const [activeSection, setActiveSection] = useState<string>('dashboard');

  if (!user || !activeRole) {
    return <LoginGate />;
  }

  // Render correct dashboard screen according to active role
  const renderDashboardContent = () => {
    if (activeRole === 'TEACHER') {
      return <TeacherDashboard />;
    } else {
      return <StudentPortal />;
    }
  };

  // Structured premium pages mockup representation for other sections
  const renderMockView = (title: string, Icon: React.ComponentType<any>) => {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-white/70 backdrop-blur-md rounded-[32px] border border-white/45 min-h-[400px] animate-fade-in shadow-sm">
        <div className="w-16 h-16 rounded-full bg-secondary/15 flex items-center justify-center mb-4 text-secondary">
          <Icon size={32} />
        </div>
        <h3 className="font-headline-lg text-primary text-2xl font-black mb-2">{title} Module</h3>
        <p className="text-on-surface-variant text-sm max-w-sm mb-6">
          Premium system features for "{title}" are loaded and synchronized reactively under license key <span className="font-mono bg-surface-container font-extrabold px-1.5 py-0.5 rounded text-xs select-all text-primary">ELITE-PRESTAGE-402</span>.
        </p>
        <button
          onClick={() => {
            setActiveSection('dashboard');
            addToast('Viewing interactive workspace.', 'info');
          }}
          className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-full shadow hover:scale-[1.02] duration-150 outline-none"
        >
          Return to Dashboard
        </button>
      </div>
    );
  };

  const renderActiveView = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboardContent();
      case 'courses':
        return renderMockView('Courses & Curriculum', BookOpen);
      case 'schedule':
        return renderMockView('Class Timetable & Scheduling', CalendarDays);
      case 'achievements':
        return renderMockView('Global Student Hall of Fame', Sparkles);
      case 'settings':
        return renderMockView('Personal Preference Configuration', SettingsIcon);
      default:
        return renderDashboardContent();
    }
  };

  return (
    <div className="min-h-screen text-on-surface font-body-md relative overflow-x-hidden pt-36 lg:pl-80 pr-4 md:pr-8 pl-4 lg:pt-28">
      {/* Background Animated Drift Mesh Glows */}
      <div className="fixed inset-0 z-[-1] mesh-gradient-bg opacity-30 pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-[#5A5A40]/15 rounded-full filter blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-[#7A786B]/12 rounded-full filter blur-[100px] delay-1000"></div>
        <div className="absolute top-[40%] right-[30%] w-[200px] md:w-[450px] h-[200px] md:h-[450px] bg-[#E5E2D9]/25 rounded-full filter blur-[80px] delay-500"></div>
      </div>

      {/* Floating Canvas Confettis Layer */}
      <ConfettiCanvas />

      {/* Reactive global notifications */}
      <ToastOverlay />

      {/* Standard sidebar Navigation panels */}
      <SidebarLayout activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Top Application Ribbon */}
      <ResponsiveTopbar />

      {/* Responsive Content Stream View */}
      <main className="max-w-[1280px] mx-auto pt-6 pb-20">
        {renderActiveView()}
      </main>

      {/* Bottom responsive mobile bottom-nav bar togglers */}
      <nav className="lg:hidden fixed bottom-4 left-4 right-4 z-50 bg-white/80 backdrop-blur-2xl px-6 py-3 rounded-full border border-white/30 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveSection('dashboard')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            activeSection === 'dashboard' ? 'text-primary' : 'text-on-surface-variant'
          }`}
        >
          <Compass size={18} />
          <span>Home</span>
        </button>
        <button
          onClick={() => setActiveSection('courses')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            activeSection === 'courses' ? 'text-primary' : 'text-on-surface-variant'
          }`}
        >
          <BookOpen size={18} />
          <span>Study</span>
        </button>
        <button
          onClick={() => setActiveSection('achievements')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            activeSection === 'achievements' ? 'text-primary' : 'text-on-surface-variant'
          }`}
        >
          <Sparkles size={18} />
          <span>Stars</span>
        </button>
        <button
          onClick={() => setActiveSection('settings')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            activeSection === 'settings' ? 'text-primary' : 'text-on-surface-variant'
          }`}
        >
          <SettingsIcon size={18} />
          <span>Me</span>
        </button>
      </nav>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ClassProvider>
        <MainAppContent />
      </ClassProvider>
    </AuthProvider>
  );
}
export { App };
