import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useClass } from '../../context/ClassContext';
import { 
  School, 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  Award, 
  Settings, 
  LogOut, 
  HelpCircle,
  Gem
} from 'lucide-react';

interface SidebarLayoutProps {
  activeSection: string;
  setActiveSection: (sec: string) => void;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({ activeSection, setActiveSection }) => {
  const { logout, activeRole } = useAuth();
  const { addToast } = useClass();

  const primaryColorClass = activeRole === 'TEACHER' ? 'bg-primary text-white shadow-[0px_10px_20px_rgba(90,90,64,0.15)]' : 'bg-secondary text-white shadow-[0px_10px_20px_rgba(142,139,117,0.15)]';
  const hoverColorClass = activeRole === 'TEACHER' ? 'hover:bg-primary/10 hover:text-primary' : 'hover:bg-secondary/15 hover:text-secondary';
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleUpgradeClick = () => {
    addToast('Ms. Nhung, you are already on the Elite VIP Platinum Teacher license!', 'success');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 m-0 p-6 z-40 hidden lg:flex flex-col bg-white border-r border-[#E5E2D9] transition-all">
      {/* Brand Header */}
      <div className="mb-10 px-2">
        <h2 className="text-2xl font-serif italic text-primary leading-tight font-light">
          Starfish<br/>English Center
        </h2>
        <p className="text-[10px] uppercase tracking-widest text-[#A09E91] mt-2 font-bold">Ms. Nhung's Studio</p>
      </div>

      {/* Main Navigation links */}
      <nav className="flex flex-col gap-2 flex-grow">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-4 px-5 py-3 rounded-full text-sm font-button text-left transition-all ${
                isActive ? primaryColorClass : `text-on-surface-variant ${hoverColorClass}`
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Tools & Sessions switcher */}
      <div className="mt-auto space-y-4">
        {/* Elite subscription block */}
        <div className="bg-primary-container p-5 rounded-2xl text-on-primary-container shadow-md group border border-primary/20">
          <p className="text-sm font-bold flex items-center gap-2 text-white">
            <Gem size={15} className="text-secondary-container" />
            <span>Exclusive Perks</span>
          </p>
          <p className="text-xs text-white/80 mt-1 mb-4 leading-relaxed">
            Unlock elite premium coaching, masterclasses, and homework help 24/7.
          </p>
          <button
            onClick={handleUpgradeClick}
            className="w-full py-2.5 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold transition-all hover:scale-[1.03] active:scale-95 glow-amber"
          >
            Upgrade to VIP
          </button>
        </div>

        {/* Action utility items */}
        <div className="flex flex-col gap-1 border-t border-outline-variant/30 pt-4">
          <button
            onClick={() => addToast('Displaying online resource guide.', 'info')}
            className="flex items-center gap-3 px-5 py-2.5 text-on-surface-variant hover:bg-surface-container rounded-full text-xs font-semibold"
          >
            <HelpCircle size={15} />
            <span>Help Center</span>
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-5 py-2.5 text-error hover:bg-error-container/25 rounded-full text-xs font-bold transition-colors w-full"
          >
            <LogOut size={15} />
            <span>Logout Profile</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
