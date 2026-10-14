import React, { useState } from 'react';
import { Product, StoreSettings } from '../../types';
import {
  createWhatsAppOrderMessage,
  formatPrice,
  getWhatsAppUrl,
  toBengaliNumber,
} from '../../utils/bengali';

interface QuickViewModalProps {
  product: Product | null;
  settings: StoreSettings;
  onClose: () => void;
  onOrderSuccess: (product: Product, total: number) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  settings,
  onClose,
  onOrderSuccess,
}) => {
  if (!product) return null;

  const [deliveryArea, setDeliveryArea] = useState<'inside' | 'outside'>('inside');
  const deliveryCharge =
    deliveryArea === 'inside' ? settings.deliveryDhaka : settings.deliveryOutside;
  const deliveryAreaLabel = deliveryArea === 'inside' ? 'ঢাকা ভেতরে' : 'ঢাকার বাইরে';

  const previewMessage = createWhatsAppOrderMessage({
    productTitle: product.title,
    price: product.price,
    deliveryArea: deliveryAreaLabel,
    deliveryCharge,
    pageUrl: typeof window !== 'undefined' ? window.location.href : '',
  });

  const handleSendOrder = () => {
    const waUrl = getWhatsAppUrl(settings.whatsappNumber, previewMessage);
    onOrderSuccess(product, product.price + deliveryCharge);
    window.open(waUrl, '_blank');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#29322e]/50 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 transition-all"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto transform transition-all p-6 relative border border-[#e0ebe4]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="বন্ধ করুন"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#ecf6ef] hover:bg-[#dbe5de] flex items-center justify-center text-[#141d19] transition-colors z-10 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Modal Left Product Image */}
          <div className="flex flex-col">
            <div className="aspect-square rounded-2xl overflow-hidden bg-[#ecf6ef] mb-3 relative group">
              <img
                src={product.imageUrl}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuCLR3NeYuHFYG3PqdowX55mfKdIc_OG06VP6F-X12pujouMYagv_tmp9bVDPwgejF4Y-c6EnOLse55GLGLO2gtGXhhjMNo8DdbaiK-aTy_JGJEkPj3apO8zofZoT3jhG1X74lAuOkR9kRUOQZprS2R9bDdkNKi4HtZ2GN46vPXLOPluI0rQ-FgRsgzCZ21o1zDLVW0Vf0IAgPJtgND8xjy87WdPxpTaCuWEKovTbWUx7FSMoeVYRZex';
                }}
              />
              <span className="absolute top-3 left-3 bg-[#006d2f] text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-sm">
                {product.discount} ছাড়
              </span>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#006d2f] font-bold py-1 bg-[#f2fcf5] rounded-lg">
              <span className="material-symbols-outlined text-sm">verified</span>
              <span>১০০% ব্র্যান্ড নিউ ও জেনুইন পণ্য</span>
            </div>
          </div>

          {/* Modal Right Details & WhatsApp Message Preview */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#006d2f]/10 text-[#006d2f] px-2.5 py-0.5 rounded-full text-xs font-bold inline-block">
                  {product.categoryLabel}
                </span>
                <span className="text-xs text-[#6e7977]">SKU: {product.sku}</span>
              </div>

              <h2 className="text-lg md:text-xl font-bold text-[#141d19] mb-2 leading-snug">
                {product.title}
              </h2>

              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-2xl font-bold text-[#005c55]">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm text-[#6e7977] line-through">
                  {formatPrice(product.regularPrice)}
                </span>
              </div>

              <p className="text-xs md:text-sm text-[#3e4947] mb-4 leading-relaxed">
                {product.fullDetails || product.description}
              </p>

              {/* Delivery Area Selector */}
              <div className="bg-[#ecf6ef] p-3 rounded-xl mb-4 border border-[#e0ebe4]">
                <span className="text-xs font-bold text-[#141d19] block mb-2">
                  ডেলিভারি এরিয়া নির্বাচন করুন:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryArea('inside')}
                    className={`py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      deliveryArea === 'inside'
                        ? 'bg-[#005c55] text-white shadow-sm'
                        : 'bg-[#e0ebe4] text-[#141d19] hover:bg-[#dbe5de]'
                    }`}
                  >
                    ঢাকা ভেতরে (+৳{toBengaliNumber(settings.deliveryDhaka)})
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryArea('outside')}
                    className={`py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      deliveryArea === 'outside'
                        ? 'bg-[#005c55] text-white shadow-sm'
                        : 'bg-[#e0ebe4] text-[#141d19] hover:bg-[#dbe5de]'
                    }`}
                  >
                    ঢাকার বাইরে (+৳{toBengaliNumber(settings.deliveryOutside)})
                  </button>
                </div>
              </div>

              {/* WhatsApp Message Preview Box */}
              <div className="bg-[#ecf6ef] p-3 rounded-xl mb-4 border border-[#e0ebe4]">
                <span className="text-[11px] font-bold text-[#006d2f] uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">chat</span>
                  WhatsApp প্রি-ফিল্ড মেসেজ প্রিভিউ:
                </span>
                <pre className="text-xs text-[#141d19] whitespace-pre-wrap font-sans bg-white p-2.5 rounded-lg border border-[#e0ebe4] shadow-inner max-h-28 overflow-y-auto leading-relaxed">
                  {previewMessage}
                </pre>
              </div>
            </div>

            {/* Direct Send Action */}
            <div className="flex flex-col gap-1.5 pt-2">
              <button
                onClick={handleSendOrder}
                className="w-full py-3 px-4 rounded-full bg-[#006d2f] hover:bg-[#005322] active:scale-98 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">chat</span>
                <span>WhatsApp-এ সরাসরি অর্ডার সেন্ড করুন</span>
              </button>
              <span className="text-center text-[11px] text-[#6e7977]">
                ক্লিক করলে সরাসরি সহজ শপ ভেরিফাইড WhatsApp চ্যাট ({settings.whatsappNumber}) খুলবে
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
