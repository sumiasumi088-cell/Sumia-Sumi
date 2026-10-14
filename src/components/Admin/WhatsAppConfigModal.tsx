import React, { useState } from 'react';

interface WhatsAppConfigModalProps {
  currentNumber: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newNumber: string) => void;
}

export const WhatsAppConfigModal: React.FC<WhatsAppConfigModalProps> = ({
  currentNumber,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  // strip +880 or leading parts
  const initialPure = currentNumber.replace('+880 ', '').replace('+880', '');
  const [val, setVal] = useState(initialPure || '1712-345678');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = val.startsWith('+880') ? val : `+880 ${val.trim()}`;
    onSave(formatted);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#29322e]/50 backdrop-blur-sm flex items-center justify-center p-4 transition-all"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 flex flex-col border border-[#e0ebe4]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-lg">chat</span>
            </div>
            <h4 className="text-base font-bold text-[#141d19]">WhatsApp নম্বর পরিবর্তন</h4>
          </div>
          <button
            onClick={onClose}
            className="text-[#3e4947] hover:text-[#141d19] cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <p className="text-xs text-[#3e4947] mb-4 leading-relaxed">
          গ্রাহকদের সকল এক-ক্লিক অর্ডার ইনকোয়ারি সরাসরি আপনার এই নির্দিষ্ট নম্বরে ফরওয়ার্ড হবে।
        </p>

        <form onSubmit={handleSubmit}>
          <label className="text-xs font-bold text-[#141d19] block mb-1">
            সচল WhatsApp মোবাইল নম্বর
          </label>
          <div className="flex items-center bg-[#ecf6ef] rounded-lg px-4 py-2.5 mb-5 border border-[#e0ebe4]">
            <span className="text-sm font-bold text-[#3e4947] pr-2.5 border-r border-[#bdc9c6] mr-2.5">
              +880
            </span>
            <input
              className="bg-transparent border-none outline-none text-sm font-bold text-[#141d19] w-full"
              type="text"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              placeholder="1712-345678"
              required
            />
          </div>

          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              className="px-4 py-2 bg-[#e0ebe4] text-[#141d19] text-xs font-semibold rounded-lg hover:bg-[#dbe5de] transition-colors cursor-pointer"
              onClick={onClose}
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
            >
              সংরক্ষণ করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
