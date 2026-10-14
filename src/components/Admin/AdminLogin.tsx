import React, { useState } from 'react';

interface AdminLoginProps {
  onLogin: (email: string, name: string) => void;
  onBackToStore: () => void;
  showToast: (title: string, desc?: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLogin,
  onBackToStore,
  showToast,
}) => {
  const [email, setEmail] = useState('admin@shohojshop.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Simple validation for demo
      if (
        (email.trim().toLowerCase() === 'admin@shohojshop.com' ||
          email.trim() === '01712345678' ||
          email.trim().includes('@')) &&
        password.length >= 4
      ) {
        showToast('মার্চেন্ট অ্যাডমিন লগইন সফল হয়েছে!', 'সহজ শপ সিরাজগঞ্জ ব্রাঞ্চে স্বাগতম');
        onLogin(email, 'রাহিম আহমেদ');
      } else {
        setErrorMessage('ভুল ইমেইল বা পাসওয়ার্ড। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
      }
    }, 450);
  };

  const handleQuickDemoLogin = () => {
    setEmail('admin@shohojshop.com');
    setPassword('admin123');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast('ডেমো অ্যাডমিন লগইন সফল হয়েছে!', 'রাহিম আহমেদ (সুপার অ্যাডমিন)');
      onLogin('admin@shohojshop.com', 'রাহিম আহমেদ');
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#f2fcf5] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background soft ambient blobs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#5dfd8a]/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#005c55]/15 blur-3xl pointer-events-none" />

      {/* Back to store floating button */}
      <button
        onClick={onBackToStore}
        className="absolute top-6 left-6 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md text-[#141d19] hover:bg-white text-xs font-bold shadow-sm border border-[#e0ebe4] transition-all cursor-pointer z-10"
      >
        <span className="material-symbols-outlined text-base">arrow_back</span>
        <span>স্টোরফ্রন্টে ফিরে যান</span>
      </button>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#e0ebe4] p-6 sm:p-8 relative z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Brand header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#005c55] text-white flex items-center justify-center shadow-md mb-3">
            <span className="material-symbols-outlined text-3xl">storefront</span>
          </div>
          <div className="flex items-center gap-1.5">
            <h1 className="font-display text-2xl font-bold text-[#141d19]">
              সহজ শপ অ্যাডমিন
            </h1>
            <span className="bg-[#e0ebe4] text-[#141d19] px-2 py-0.5 rounded-full text-[10px] font-bold">
              BD
            </span>
          </div>
          <p className="text-xs text-[#3e4947] mt-1">
            মার্চেন্ট ড্যাশবোর্ড ও ইনভেন্টরি কন্ট্রোল প্যানেল
          </p>
        </div>

        {/* Demo Credentials Helper Pill */}
        <div className="bg-[#ecf6ef] border border-[#bdc9c6]/40 p-3 rounded-xl mb-5 flex items-center justify-between gap-2">
          <div className="text-[11px] text-[#141d19]">
            <span className="font-bold block text-[#005c55]">🔑 ডেমো অ্যাডমিন তথ্য:</span>
            <span>ইমেইল: <code className="bg-white px-1 py-0.5 rounded text-[10px] text-[#005c55] font-bold">admin@shohojshop.com</code></span>
            <span className="block mt-0.5">পাসওয়ার্ড: <code className="bg-white px-1 py-0.5 rounded text-[10px] text-[#005c55] font-bold">admin123</code></span>
          </div>
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="px-3 py-1.5 bg-[#006d2f] hover:bg-[#005322] text-white rounded-lg text-[11px] font-bold shadow-xs whitespace-nowrap transition-all cursor-pointer shrink-0"
          >
            ১-ক্লিক লগইন
          </button>
        </div>

        {/* Error alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-[#ffdad6] text-[#ba1a1a] text-xs flex items-center gap-2 border border-[#ba1a1a]/20">
            <span className="material-symbols-outlined text-base shrink-0">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#141d19] mb-1.5">
              ইমেইল অ্যাড্রেস বা মোবাইল নম্বর
            </label>
            <div className="flex items-center bg-[#ecf6ef] rounded-xl px-3.5 py-2.5 border border-[#e0ebe4] focus-within:ring-2 focus-within:ring-[#005c55] focus-within:bg-white transition-all">
              <span className="material-symbols-outlined text-[#6e7977] text-lg mr-2">
                mail
              </span>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@shohojshop.com"
                className="bg-transparent border-none outline-none text-xs text-[#141d19] w-full"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-[#141d19]">
                পাসওয়ার্ড (Password)
              </label>
              <button
                type="button"
                onClick={() =>
                  showToast('পাসওয়ার্ড রিসেট লিংক আপনার ভেরিফাইড WhatsApp নম্বরে পাঠানো হয়েছে')
                }
                className="text-[11px] text-[#005c55] hover:underline cursor-pointer"
              >
                পাসওয়ার্ড ভুলে গেছেন?
              </button>
            </div>
            <div className="flex items-center bg-[#ecf6ef] rounded-xl px-3.5 py-2.5 border border-[#e0ebe4] focus-within:ring-2 focus-within:ring-[#005c55] focus-within:bg-white transition-all">
              <span className="material-symbols-outlined text-[#6e7977] text-lg mr-2">
                lock
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent border-none outline-none text-xs text-[#141d19] w-full"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#6e7977] hover:text-[#141d19] cursor-pointer ml-1"
                aria-label="পাসওয়ার্ড দেখুন"
              >
                <span className="material-symbols-outlined text-lg">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-[#005c55] cursor-pointer rounded"
              />
              <span className="text-[#3e4947]">আমাকে মনে রাখুন (Remember me)</span>
            </label>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-[#005c55] hover:bg-[#0f766e] active:scale-98 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined text-lg animate-spin">
                  progress_activity
                </span>
                <span>লগইন হচ্ছে...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">login</span>
                <span>অ্যাডমিন প্যানেলে লগইন করুন</span>
              </>
            )}
          </button>
        </form>

        {/* Security badges */}
        <div className="mt-6 pt-4 border-t border-[#e0ebe4] flex items-center justify-between text-[11px] text-[#6e7977]">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[#006d2f] text-sm">
              security
            </span>
            ২৫৬-বিট এনক্রিপ্টেড
          </span>
          <span className="text-[#005c55] font-semibold">সহজ শপ সিরাজগঞ্জ ব্রাঞ্চ</span>
        </div>
      </div>
    </div>
  );
};
