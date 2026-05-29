import React, { useState } from 'react';
import { useClass } from '../../context/ClassContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Star, 
  Sparkles, 
  Gift, 
  Flame, 
  CircleDot, 
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  CalendarDays,
  ShoppingBag,
  BellRing,
  BookmarkCheck,
  Award
} from 'lucide-react';

export const StudentPortal: React.FC = () => {
  const { students, attendance, diaries, rewards, redeemReward, addToast, users, classes } = useClass();
  const { activeStudentId, setActiveStudentId } = useAuth();

  // Selected reward item details modal state
  const [successRedeemedItemName, setSuccessRedeemedItemName] = useState<string | null>(null);

  // Active student object
  const currentStudent = students.find((s) => s.id === activeStudentId) || students[0];

  const getStudentClassRoom = () => {
    if (!currentStudent) return 'Room 402';
    const c = classes.find(item => item.id === currentStudent.class_id);
    return c ? c.class_name : 'Room 402';
  };

  const studentDiaries = diaries.filter(d => d.class_id === currentStudent?.class_id);

  // Calculate parameters for circular tuition ring
  const total = currentStudent?.total_sessions || 24;
  const remaining = currentStudent?.remaining_sessions || 0;
  const sessionPercentage = Math.round((remaining / total) * 100);

  // Remaining tuition indicator configuration
  const isTuitionLow = remaining < 4;
  const progressRingColor = isTuitionLow ? 'text-error' : 'text-secondary';
  const progressBgClass = isTuitionLow ? 'bg-error-container text-on-error-container' : 'bg-secondary-fixed/50 text-secondary';

  // Attendance dots calendar logs map
  const renderAttendanceStrip = () => {
    // Generate static mockup date labels for the past class dates
    const dates = ['2026-05-20', '2026-05-22', '2026-05-25', '2026-05-28', '2026-05-29'];
    
    return dates.map((date) => {
      const match = attendance.find(
        (a) => a.student_id === currentStudent.id && a.date === date
      );

      const dayLabel = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
      const numLabel = date.split('-')[2];

      let dotColor = 'border-outline-variant bg-white';
      let statusText = 'No session';

      if (match) {
        if (match.status === 'PRESENT') {
          dotColor = 'bg-primary border-primary text-white';
          statusText = 'Present';
        } else if (match.status === 'LATE') {
          dotColor = 'bg-secondary-container border-secondary-container text-on-secondary-container font-semibold';
          statusText = 'Late';
        } else {
          dotColor = 'bg-error border-error text-white';
          statusText = 'Absent';
        }
      }

      return (
        <div key={date} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/40 border border-white/20 shadow-sm" title={statusText}>
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{dayLabel}</span>
          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-black shadow-inner ${dotColor}`}>
            {numLabel}
          </div>
          <span className="text-[9px] font-bold opacity-75">{statusText}</span>
        </div>
      );
    });
  };

  const handleRedeem = (rewardId: string, rewardTitle: string) => {
    const res = redeemReward(currentStudent.id, rewardId);
    if (res.success) {
      setSuccessRedeemedItemName(rewardTitle);
    }
  };

  // Local checkbox checklist tracking for diary homework list
  const [checkedTasks, setCheckedTasks] = useState<{ [key: string]: boolean }>({});

  const toggleTask = (taskKey: string) => {
    setCheckedTasks(prev => ({
      ...prev,
      [taskKey]: !prev[taskKey]
    }));
  };

  return (
    <div className="space-y-8 pb-16 relative">
      {/* Dynamic Celebration Success Popup Card */}
      {successRedeemedItemName && (
        <div className="fixed inset-0 z-[99999] bg-primary/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-[32px] max-w-sm w-full text-center shadow-[0_20px_50px_rgba(0,48,30,0.3)] border-2 border-secondary animate-scale-up">
            <div className="w-20 h-20 bg-secondary/15 rounded-full flex items-center justify-center mx-auto mb-4 relative">
              <Sparkles className="text-secondary absolute top-1 right-1 animate-pulse" size={20} />
              <Gift className="text-secondary fill-secondary" size={40} />
            </div>
            <h3 className="font-headline-lg text-primary text-2xl font-black mb-2">Claimed Successfully!</h3>
            <p className="text-sm text-on-surface-variant mb-6">
              You swapped your hard-earned stars for the <span className="text-secondary font-black">{successRedeemedItemName}</span>. Your teacher Ms. Nhung will hand it to you in <span className="font-bold text-[#5A5A40] bg-[#F8F7F2] py-0.5 px-1.5 rounded">{getStudentClassRoom()}</span>!
            </p>
            <button
              onClick={() => setSuccessRedeemedItemName(null)}
              className="py-3 px-8 bg-primary text-white text-sm font-bold rounded-full w-full hover:scale-[1.02] transition-transform shadow outline-none"
            >
              Sweet! Keep earning
            </button>
          </div>
        </div>
      )}

      {/* Hero Wallet Showcase with reactive points indicator */}
      <section className="glass-card rounded-[32px] p-8 md:p-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between shadow-[0px_20px_40px_rgba(0,52,41,0.06)] border border-white/30">
        <div className="space-y-4 text-center md:text-left z-10 flex-1">
          <div className="inline-flex items-center gap-1.5 bg-secondary/10 px-4 py-1.5 rounded-full border border-secondary/20">
            <Flame className="text-secondary fill-secondary animate-bounce" size={14} />
            <span className="text-secondary text-[10px] uppercase font-label-caps font-bold tracking-widest">ACTIVE SCHOLAR MULTIPLIER</span>
          </div>
          <h2 className="font-headline-xl text-primary text-3xl md:text-5xl font-extrabold max-w-md tracking-tight leading-none">
            My Star Wallet
          </h2>
          <p className="text-on-surface-variant text-sm max-w-xs leading-relaxed font-semibold">
            Convert your learning brilliance into elite merchandise. Ms. Nhung keeps updates instant live!
          </p>
          <div className="flex items-baseline justify-center md:justify-start gap-2 py-2">
            <span className="text-[72px] leading-none font-black text-primary select-none">{currentStudent?.current_stars}</span>
            <span className="text-xl font-extrabold text-secondary tracking-wide uppercase">Stars</span>
          </div>
        </div>

        {/* Floating 3D Star Icon with soft light glows */}
        <div className="relative w-full md:w-[320px] h-[220px] flex items-center justify-center mt-6 md:mt-0 select-none">
          <div className="absolute inset-0 bg-secondary/10 blur-[80px] rounded-full scale-110"></div>
          <div className="relative transform hover:rotate-12 transition-transform duration-500">
            <Star className="text-secondary fill-secondary drop-shadow-[0_10px_30px_rgba(124,88,0,0.3)]" size={180} />
            <div className="absolute -top-1 -right-1 bg-white p-3 rounded-full shadow-xl border border-secondary-container/30 hover:scale-105 duration-200">
              <Award className="text-secondary" size={28} />
            </div>
          </div>
        </div>
      </section>

      {/* Micro-Widgets and strip calendar logs widgets */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Progress Ring Tuition micro card */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
          <h3 className="text-sm font-extrabold text-primary mb-4 self-start flex items-center gap-2">
            <CircleDot className="text-secondary" size={16} />
            <span>Remaining Tuition</span>
          </h3>

          <div className="relative w-44 h-44 mb-4">
            {/* Inline dynamic SVG Progress Orb */}
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-surface-container-high" cx="88" cy="88" r="76" fill="transparent" stroke="currentColor" strokeWidth="8"></circle>
              <circle
                className={`${progressRingColor} transition-all duration-1000 ease-out`}
                cx="88"
                cy="88"
                r="76"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="10"
                strokeDasharray="477.5"
                strokeDashoffset={477.5 - (477.5 * sessionPercentage) / 100}
                strokeLinecap="round"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-black ${isTuitionLow ? 'text-error' : 'text-primary'}`}>{remaining}</span>
              <span className="text-[9px] uppercase tracking-wider font-extrabold font-mono text-on-surface-variant">Units Left</span>
            </div>
          </div>

          {/* Conditional Low tuition renewing trigger alerts action */}
          {isTuitionLow ? (
            <div className="w-full bg-error-container p-3 rounded-2xl text-on-error-container flex flex-col gap-2 border border-error/20">
              <div className="flex items-center gap-1.5 justify-center">
                <AlertTriangle size={15} className="text-error" />
                <p className="text-xs font-black">Renew Tuition immediately!</p>
              </div>
              <button 
                onClick={() => addToast("Renew contact sent to administrative parent coordinator!", "success")}
                className="py-1.5 px-4 bg-error text-white font-bold rounded-full text-xs shadow-md active:scale-95 duration-150 outline-none"
              >
                Quick Renew Now
              </button>
            </div>
          ) : (
            <div className={`px-4 py-2 rounded-full flex items-center gap-1.5 border border-secondary/20 ${progressBgClass}`}>
              <CheckCircle size={14} />
              <span className="text-[10.5px] font-bold">Good Standing</span>
            </div>
          )}
        </div>

        {/* High Scannability Calendar stripe ribbon */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-extrabold text-primary flex items-center gap-2">
              <CalendarDays className="text-secondary" size={16} />
              <span>Attendance History Dot-Logs</span>
            </h3>
            <span className="text-[10px] font-bold text-on-surface-variant">Past 5 sessions</span>
          </div>

          <div className="grid grid-cols-5 gap-3 py-2">
            {renderAttendanceStrip()}
          </div>

          <p className="text-[11px] text-on-surface-variant mt-2 text-center font-medium bg-surface-container-low/55 py-2 px-4 rounded-xl">
            Green means <span className="text-primary font-black">Present</span> • Orange is <span className="text-secondary font-black">Late</span> • Red is <span className="text-error font-black">Absent</span>. Keep streaks active!
          </p>
        </div>

      </section>

      {/* Class Homework Feed checklists scroll */}
      <section className="bg-white/80 p-6 rounded-[32px] border border-white/40 shadow-sm">
        <h3 className="text-sm font-extrabold text-primary mb-4 flex items-center gap-2">
          <BookOpen className="text-secondary" size={16} />
          <span>Active Assignment Diaries & Checklist</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[350px] overflow-y-auto pr-2">
          {studentDiaries.length === 0 ? (
            <div className="col-span-2 text-center p-8 bg-neutral-100 rounded-2xl border border-dashed border-neutral-300 text-neutral-500 font-medium text-xs">
              No assignment logs or diaries published yet for your class. Great job on keeping up!
            </div>
          ) : (
            studentDiaries.map((diary) => (
            <article key={diary.id} className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-extrabold text-primary px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                    {diary.topic}
                  </h4>
                  <span className="text-[10px] font-bold font-mono text-on-surface-variant">{diary.date}</span>
                </div>

                {/* Checklist with reactive toggle checks */}
                <div className="space-y-2 mt-4 bg-white p-4 rounded-xl border border-outline-variant/15">
                  <span className="text-[9px] uppercase tracking-widest font-extrabold text-on-surface-variant block mb-2">My Task Checklist</span>
                  {diary.homework.split('\n').filter(Boolean).map((task, idx) => {
                    const taskKey = `${diary.id}-${idx}`;
                    const isChecked = !!checkedTasks[taskKey];
                    return (
                      <label key={idx} className="flex items-center gap-2.5 cursor-pointer select-none group/item">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleTask(taskKey)}
                          className="w-4 h-4 rounded-full border-outline-variant text-primary focus:ring-0 outline-none cursor-pointer transition-all"
                        />
                        <span className={`text-xs ${isChecked ? 'line-through text-on-surface-variant/75 font-normal' : 'text-primary font-bold'}`}>
                          {task}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </article>
          ))
          )}
        </div>
      </section>

      {/* Interactive premium Reward Store catalog */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-secondary" size={18} />
            <h3 className="text-lg font-bold text-primary">The Premium Exchange Store</h3>
          </div>
          <span className="text-xs bg-secondary-container/20 text-secondary font-bold px-3 py-1 rounded-full border border-secondary/20">
            Star Wallet: {currentStudent?.current_stars} Available ⭐️
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {rewards.map((reward) => {
            const hasEnoughStars = currentStudent?.current_stars >= reward.star_cost;
            const isOutOfStock = reward.stock <= 0;

            return (
              <div 
                key={reward.id} 
                className={`bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all border ${
                  hasEnoughStars ? 'border-primary/25' : 'border-outline-variant/20 grayscale opacity-80'
                }`}
              >
                {/* Visual Image container */}
                <div className="relative h-44 w-full bg-surface-container-low overflow-hidden">
                  <img src={reward.image_url} alt={reward.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 px-3 py-1 bg-secondary text-white rounded-full font-black text-xs shadow">
                    {reward.star_cost} Stars
                  </div>
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-primary/45 backdrop-blur-[1px] flex items-center justify-center">
                      <span className="bg-error text-white font-bold text-xs uppercase px-3 py-1.5 rounded-full tracking-wider">Out of Stock</span>
                    </div>
                  )}
                </div>

                {/* Details and Redeem action */}
                <div className="p-4 flex flex-col justify-between">
                  <div className="mb-4">
                    <div className="flex justify-between items-center gap-2 mb-1">
                      <h4 className="text-sm font-extrabold text-primary truncate" title={reward.title}>{reward.title}</h4>
                      <span className="text-[10px] font-bold text-on-surface-variant font-mono">Stock: {reward.stock}</span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant line-clamp-2 leading-relaxed">
                      Handcrafted, limited luxurious merchandise for Elite scholars. Claims are processed instantly.
                    </p>
                  </div>

                  <button
                    onClick={() => handleRedeem(reward.id, reward.title)}
                    disabled={isOutOfStock}
                    className={`w-full py-2.5 rounded-full font-button text-xs font-bold leading-none shadow transition-all outline-none flex items-center justify-center gap-1 ${
                      isOutOfStock
                        ? 'bg-outline-variant/40 text-on-surface-variant cursor-not-allowed shadow-none'
                        : hasEnoughStars
                        ? 'bg-secondary text-white hover:scale-[1.02] active:scale-95 cursor-pointer shadow-md'
                        : 'bg-primary/5 text-primary border border-primary/20 hover:bg-primary hover:text-white cursor-pointer hover:shadow-md'
                    }`}
                  >
                    <Sparkles size={11} />
                    <span>{hasEnoughStars ? 'Redeem Now' : 'Earn More Stars'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
