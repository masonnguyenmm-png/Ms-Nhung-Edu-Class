import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useClass } from '../../context/ClassContext';
import { School, LogIn, Sparkles, User, ShieldCheck } from 'lucide-react';

export const LoginGate: React.FC = () => {
  const { login } = useAuth();
  const { addToast } = useClass();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      addToast('Please input both username and password credentials.', 'warning');
      return;
    }

    setLoading(true);
    // Simulating slight loading feeling for deluxe transitions
    setTimeout(() => {
      const res = login(username, password);
      setLoading(false);
      if (res) {
        addToast(`Welcome back, ${username}! Successful Elite session initialized.`, 'success');
      } else {
        addToast('Invalid credentials. Hint: use password123 as requested.', 'error');
      }
    }, 450);
  };

  // Pre-seed helper chips for Ms. Nhung/Student review
  const selectQuickProfile = (user: string) => {
    setUsername(user);
    setPassword('password123');
    addToast(`Prefilled credentials for ${user}! Click login below.`, 'info');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#aff0d9]/20 via-[#feb700]/10 to-[#e1e1f5]/30 filter blur-3xl z-[-1]"></div>

      <div className="w-full max-w-md bg-white/70 backdrop-blur-2xl p-8 rounded-[32px] border border-white/40 shadow-2xl transition-all duration-300">
        
        {/* Brand visual header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white mx-auto mb-4 shadow-lg hover:rotate-12 duration-300 select-none">
            <School size={28} />
          </div>
          <h2 className="font-headline-lg text-primary text-2xl font-black tracking-tight leading-none">
            Elite English Portal
          </h2>
          <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mt-2">
            Center Management & Star Wallet
          </p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-extrabold text-primary mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter msnhung or student1"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-surface-container-low px-4 py-3 text-sm rounded-full border border-outline-variant/30 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none text-primary font-bold"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-extrabold text-primary mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="password123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container-low px-4 py-3 text-sm rounded-full border border-outline-variant/30 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none text-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary text-white rounded-full font-button text-sm flex items-center justify-center gap-2 shadow-lg hover:bg-on-primary-fixed-variant transition-all hover:translate-y-[-1px] outline-none"
          >
            <LogIn size={16} />
            <span>{loading ? 'Authorizing Profile...' : 'Login Securely'}</span>
          </button>
        </form>

        {/* Fast testing evaluator profiles switcher panel */}
        <div className="mt-8 pt-6 border-t border-outline-variant/30 text-center">
          <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant mb-3">
            Click to prefill developer credentials
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => selectQuickProfile('msnhung')}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary/5 text-primary rounded-full text-xs font-bold border border-primary/10 hover:bg-primary/10 active:scale-95 duration-100 outline-none"
            >
              <ShieldCheck size={13} />
              <span>Ms. Nhung (Teacher)</span>
            </button>
            <button
              onClick={() => selectQuickProfile('student1')}
              className="flex items-center gap-1.5 px-4 py-2 bg-secondary/10 text-secondary rounded-full text-xs font-bold border border-secondary/10 hover:bg-secondary/15 active:scale-95 duration-100 outline-none"
            >
              <User size={13} />
              <span>Student 1 (Parent)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
