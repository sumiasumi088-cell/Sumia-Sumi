import React from 'react';

interface DeleteConfirmModalProps {
  productTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  productTitle,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#29322e]/50 backdrop-blur-sm flex items-center justify-center p-4 transition-all"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 flex flex-col items-center text-center border border-[#e0ebe4]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-14 h-14 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-3xl">delete_forever</span>
        </div>

        <h3 className="text-base font-bold text-[#141d19] mb-1">
          পণ্যটি স্থায়ীভাবে মুছে ফেলতে চান?
        </h3>

        <p className="text-xs text-[#3e4947] mb-6 leading-relaxed">
          "{productTitle}" মুছে ফেললে আপনার স্টোরফ্রন্ট ও WhatsApp ক্যাটালগ থেকে অদৃশ্য হয়ে যাবে।
        </p>

        <div className="flex items-center gap-3 w-full">
          <button
            className="flex-1 py-2.5 bg-[#e0ebe4] text-[#141d19] text-xs font-semibold rounded-lg hover:bg-[#dbe5de] transition-colors cursor-pointer"
            onClick={onClose}
          >
            বাতিল
          </button>
          <button
            className="flex-1 py-2.5 bg-[#ba1a1a] text-white text-xs font-bold rounded-lg hover:opacity-90 shadow-sm transition-all cursor-pointer"
            onClick={onConfirm}
          >
            হ্যাঁ, মুছে ফেলুন
          </button>
        </div>
      </div>
    </div>
  );
};
