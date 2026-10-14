import React, { useEffect, useState } from 'react';
import { CategoryKey, Product } from '../../types';
import { formatPrice, toBengaliNumber } from '../../utils/bengali';

interface AddEditProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Partial<Product>) => void;
}

const sampleImages = [
  {
    name: 'হেয়ার ট্রিমার গোল্ড',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLR3NeYuHFYG3PqdowX55mfKdIc_OG06VP6F-X12pujouMYagv_tmp9bVDPwgejF4Y-c6EnOLse55GLGLO2gtGXhhjMNo8DdbaiK-aTy_JGJEkPj3apO8zofZoT3jhG1X74lAuOkR9kRUOQZprS2R9bDdkNKi4HtZ2GN46vPXLOPluI0rQ-FgRsgzCZ21o1zDLVW0Vf0IAgPJtgND8xjy87WdPxpTaCuWEKovTbWUx7FSMoeVYRZex',
  },
  {
    name: 'স্মার্ট ওয়াচ আল্ট্রা ২',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCP7NrzNwbeL5ZjatDbceAydHppJihJtS9N0vLYnaeuP8fUBXT83P542MqM7ZhdT3yUNVxlbPH1YYxItjkxh-63CioUqK2rThBx4hkPI-mmAasysNol0uyMHX4mvoN5mIHs14Qp0ZYVVK6iQnzMH-vYq9fyVaEWaHI0C-vCKEGiz74tS_JD9Ru1c4szAyb3eiv2dJ7Snec3D7lTtEDVtoiKm7Y3zwGWZsM4ws0r18ue4qy-9lP6nsVO',
  },
  {
    name: 'টিডব্লিউএস ইয়ারবাডস',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDD6lm9C6EiOgM0CQqrxvC7YSjqCRdr8tXOmcx7Ntt2How7AqXAvKkB3dU2CYELUmrwCnp_uwr_uwPLuxdDgM0rlRthyDeiYa6QfzhCMt8Ugf7nWen79Hu_jL8jL6k9FNOhhXwg8HlBk7IM9EveE_t6FFshppNxLjrMgORgut-4MQEMJL3_RJ3Qd3HMxULmg10sMnTApVvn03xheudUC0wq4hR8DVVUnsk_UxPGUeHaFXGlvDLKeOhr',
  },
  {
    name: 'লেদার ওয়ালেট ও বেল্ট',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfvYdi3mk1b2QmdjbeZfx5aib8F9abbJ4QRsLUlyFZdQdq9rD8v31AzFh2ZyVY0WZyahunp28FjpxRGjDvir3y0oUkm2mPcXFZ3m4yy2UZgPll5TNMkWuugjoP_Xj01oZbUxAGroZL7LKlRz6weEN0jouzEjtvRxxyqRKYSW287Ew0aT05W-10yT0lDJu4zRSv-7aISxCITKEAOwv0LNaZ-SMYX-iq93PZ_Tl6G6__cKzk5E8LwsYN',
  },
  {
    name: 'মিনি জুসার ও ব্লেন্ডার',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAe-W4TENHlIHyq5AyikST6e1S6-GQhVvgPS88rul2L1mCcA3fs72fqq9KVsRLlMvuXy2mKn1IE2GgXLPvE2Y7gPqyJDRsD2AuAvaklaCGUe9wBO2qMtO7T1QOmB9ULY0PQxkZ65MHLX53x9z3jv0CqU6V_ozZLd4tNtQfEZ-OG9pNgyFsRuMS_P8zk0PPODdyzr5N9qmxKcFclTE_nOC2yBKLUKGQ8Y3wPw2dQX92A7fk8cQ8ekYwg',
  },
  {
    name: 'খাদি কটন পাঞ্জাবি',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLrs_QVZXWvfit1_SFNNj7p4MFbcq0cNysguxqOBSjLlilMh1wkqtfDJuWJeu9r-tYTwYq8Y6U-881ZcfCSwSeaF-2VHzwLAHz0P6GbDyNmkV05-IB5rXm--7z50rKKVMxNhiddbsk1l1RwCRjZEXxnGclF5LvVQ7cxHVeGznwnDVsqpuU7vnhDr2kvKkN9TVUT-pklDa_FwV-HOGWNm_Cchrhbvz15CUTaSakWQ5uKLqF9MYQ2Qr6',
  },
  {
    name: 'ইলেকট্রিক কেটলি',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGmKuyaBlw8m_SOoLR7OnTLIlVTuRqYSGReEfj_P7HWDBHUPEfiOVsGD5TZCn1qxeOcDSb-7mAp21QTmy8PtjTMTsF_HCcgmtI0-AQc30xjkRL58NHSo73pSLUUT8BNa6Pw9DGCFx6z26MMfsdmfZIaZm92055s_h7YQVYnEaovMGaQxe5Tvli4pEGVGy2RJM_tcFf3l4N_rLyVXrZAZWKKhD0lahOEUnD28LBI94rfzxoVcZ6B0G-',
  },
  {
    name: 'ফিটনেস ব্যান্ড',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGUguqg1OoUVTSNilAQk__wT6RzGV7HxnPhfnHJ-xsWUwRebfM4_5DDB3HeXiGKytprA7hTT3FpK_gEBhuD0IgmDw5eBxFPYHNG-o221Oux_KkxrBXOZbzj8u5UyR54KLA2NRX0EhuDMcZCYA8TdF6zMKEvm4exAA4grqagZrNI4Hug05O35wER2PfN3vcdbLzvBTM2ewdF0N2ogT1n3Nrpg9U3OhhC4Gfa-KqDmE-5hchs71HAIfe',
  },
];

export const AddEditProductModal: React.FC<AddEditProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryKey>('gadgets');
  const [categoryLabel, setCategoryLabel] = useState('গ্যাজেট ও অডিও');
  const [stockCount, setStockCount] = useState(25);
  const [price, setPrice] = useState(1490);
  const [regularPrice, setRegularPrice] = useState(1990);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(sampleImages[0].url);
  const [showImagePicker, setShowImagePicker] = useState(false);

  useEffect(() => {
    if (product) {
      setTitle(product.title);
      setCategory(product.category);
      setCategoryLabel(product.categoryLabel);
      setStockCount(product.stockCount);
      setPrice(product.price);
      setRegularPrice(product.regularPrice);
      setDescription(product.description);
      setImageUrl(product.imageUrl);
    } else {
      setTitle('');
      setCategory('gadgets');
      setCategoryLabel('গ্যাজেট ও অডিও');
      setStockCount(25);
      setPrice(1490);
      setRegularPrice(1990);
      setDescription('হাই-কোয়ালিটি প্রিমিয়াম পণ্য, ১০০% অরিজিনাল গ্যাজেট।');
      setImageUrl(sampleImages[0].url);
    }
  }, [product, isOpen]);

  const handleCategoryChange = (val: string) => {
    if (val === 'gadgets') {
      setCategory('gadgets');
      setCategoryLabel('গ্যাজেট ও অডিও');
    } else if (val === 'fashion') {
      setCategory('fashion');
      setCategoryLabel('ফ্যাশন ও লাইফস্টাইল');
    } else if (val === 'home') {
      setCategory('home');
      setCategoryLabel('হোম ও কিচেন');
    } else if (val === 'accessories') {
      setCategory('accessories');
      setCategoryLabel('স্মার্ট ওয়াচ ও এক্সেসরিজ');
    } else {
      setCategory('wellness');
      setCategoryLabel('স্বাস্থ্য ও রূপচর্চা');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const discountPercent =
      regularPrice > price
        ? Math.round(((regularPrice - price) / regularPrice) * 100) + '%'
        : '০%';

    const stockStatus =
      stockCount <= 0 ? 'outstock' : stockCount <= 5 ? 'lowstock' : 'instock';

    onSave({
      title,
      category,
      categoryLabel,
      stockCount: Number(stockCount),
      stockStatus,
      price: Number(price),
      regularPrice: Number(regularPrice),
      discount: discountPercent,
      description,
      fullDetails: description,
      imageUrl,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#29322e]/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden my-auto border border-[#e0ebe4]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 bg-[#ecf6ef] flex items-center justify-between border-b border-[#e0ebe4]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#005c55] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-xl">add_shopping_cart</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#141d19]">
                {product ? 'পণ্য তথ্য সংশোধন ও সম্পাদনা' : 'সহজ শপে নতুন পণ্য যুক্ত করুন'}
              </h3>
              <span className="text-xs text-[#3e4947]">
                সঠিক তথ্য ও ছবি দিলে WhatsApp কনভার্সন বৃদ্ধি পায়
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#e0ebe4] flex items-center justify-center text-[#141d19] hover:bg-[#dbe5de] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {/* 1. Product Name */}
          <div>
            <label className="block text-xs font-bold text-[#141d19] mb-1">
              পণ্যের নাম (Product Title) <span className="text-[#ba1a1a]">*</span>
            </label>
            <input
              className="w-full bg-[#ecf6ef] rounded-lg px-4 py-2.5 text-xs md:text-sm text-[#141d19] outline-none focus:ring-2 focus:ring-[#005c55] border border-[#e0ebe4]"
              placeholder="উদাহরণ: প্রিমিয়াম ওয়্যারলেস স্টেরিও স্পিকার..."
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* 2. Category & Quantity row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#141d19] mb-1">
                পণ্যের ক্যাটাগরি <span className="text-[#ba1a1a]">*</span>
              </label>
              <select
                className="w-full bg-[#ecf6ef] rounded-lg px-4 py-2.5 text-xs text-[#141d19] outline-none focus:ring-2 focus:ring-[#005c55] border border-[#e0ebe4] cursor-pointer"
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="gadgets">গ্যাজেট ও অডিও (Gadgets)</option>
                <option value="fashion">ফ্যাশন ও লাইফস্টাইল (Fashion)</option>
                <option value="home">হোম ও কিচেন (Home & Kitchen)</option>
                <option value="accessories">স্মার্ট ওয়াচ ও এক্সেসরিজ</option>
                <option value="wellness">স্বাস্থ্য ও রূপচর্চা (Wellness)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#141d19] mb-1">
                স্টক পরিমাণ (Stock Quantity) <span className="text-[#ba1a1a]">*</span>
              </label>
              <input
                className="w-full bg-[#ecf6ef] rounded-lg px-4 py-2.5 text-xs text-[#141d19] outline-none focus:ring-2 focus:ring-[#005c55] border border-[#e0ebe4]"
                min="0"
                required
                type="number"
                value={stockCount}
                onChange={(e) => setStockCount(Number(e.target.value))}
              />
            </div>
          </div>

          {/* 3. Pricing Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#141d19] mb-1">
                বিক্রয় মূল্য (Sale Price ৳) <span className="text-[#ba1a1a]">*</span>
              </label>
              <div className="flex items-center bg-[#ecf6ef] rounded-lg px-4 py-2 border border-[#e0ebe4]">
                <span className="text-base font-bold text-[#005c55] mr-2">৳</span>
                <input
                  className="w-full bg-transparent border-none outline-none text-base font-bold text-[#141d19]"
                  min="1"
                  required
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#141d19] mb-1">
                মূল / রেগুলার মূল্য (Original ৳)
              </label>
              <div className="flex items-center bg-[#ecf6ef] rounded-lg px-4 py-2 border border-[#e0ebe4]">
                <span className="text-base font-bold text-[#6e7977] mr-2">৳</span>
                <input
                  className="w-full bg-transparent border-none outline-none text-base text-[#141d19]"
                  type="number"
                  value={regularPrice}
                  onChange={(e) => setRegularPrice(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* 4. Product Image & Picker */}
          <div>
            <label className="block text-xs font-bold text-[#141d19] mb-1">
              পণ্যের মূল ছবি (Product Image)
            </label>
            <div className="bg-[#ecf6ef] rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 border border-[#e0ebe4]">
              <div className="w-20 h-20 rounded-lg bg-white flex items-center justify-center shrink-0 overflow-hidden relative border border-[#e0ebe4] shadow-xs">
                <img
                  className="w-full h-full object-cover"
                  src={imageUrl}
                  alt="Preview"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-1.5 flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <button
                    type="button"
                    onClick={() => setShowImagePicker(!showImagePicker)}
                    className="px-3.5 py-1.5 bg-[#e0ebe4] hover:bg-[#dbe5de] text-[#141d19] text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">photo_library</span>
                    <span>গ্যালারি থেকে ছবি বেছে নিন</span>
                  </button>
                  <span className="text-[11px] text-[#6e7977]">
                    অথবা সরাসরি ছবির লিঙ্ক পেস্ট করুন
                  </span>
                </div>
                <input
                  type="text"
                  className="w-full bg-white rounded-md px-3 py-1.5 text-xs text-[#141d19] border border-[#e0ebe4] outline-none focus:ring-1 focus:ring-[#005c55]"
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
            </div>

            {/* Collapsible gallery */}
            {showImagePicker && (
              <div className="mt-2.5 p-3 bg-white rounded-xl border border-[#e0ebe4] shadow-inner grid grid-cols-4 sm:grid-cols-8 gap-2">
                {sampleImages.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setImageUrl(img.url);
                      setShowImagePicker(false);
                    }}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all p-0.5 ${
                      imageUrl === img.url ? 'border-[#005c55] scale-95 shadow-xs' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 5. Short Description */}
          <div>
            <label className="block text-xs font-bold text-[#141d19] mb-1">
              সংক্ষিপ্ত বিবরণ (কার্ড ভিউয়ের জন্য)
            </label>
            <textarea
              rows={2}
              className="w-full bg-[#ecf6ef] rounded-lg px-4 py-2 text-xs text-[#141d19] outline-none focus:ring-2 focus:ring-[#005c55] border border-[#e0ebe4]"
              placeholder="এক লাইনে আকর্ষণীয় পণ্যের বর্ণনা দিন..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* 6. Live WhatsApp Message Template Instant Preview */}
          <div className="bg-[#ecf6ef] p-3.5 rounded-xl border border-[#e0ebe4]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-[#006d2f] flex items-center gap-1 uppercase tracking-wider">
                <span className="material-symbols-outlined text-base">chat</span>
                WhatsApp মেসেজ অটো-টেমপ্লেট প্রিভিউ
              </span>
              <span className="text-[11px] text-[#6e7977]">গ্রাহক যা দেখবে</span>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-inner text-xs text-[#141d19] leading-relaxed border border-[#e0ebe4]">
              "আসসালামু আলাইকুম 'সহজ শপ'। আমি আপনার স্টোর থেকে{' '}
              <strong className="text-[#005c55] font-bold">
                {title || '[পণ্যের নাম]'}
              </strong>{' '}
              (মূল্য: <strong className="text-[#005c55] font-bold">৳{toBengaliNumber(price)}</strong>)
              অর্ডার করতে আগ্রহী। ডেলিভারি ঠিকানা নিচে পাঠাচ্ছি।"
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 flex flex-col-reverse sm:flex-row items-center justify-end gap-2 border-t border-[#e0ebe4]">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#e0ebe4] text-[#141d19] hover:bg-[#dbe5de] rounded-lg text-xs font-semibold transition-all cursor-pointer"
            >
              বাতিল করুন
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-[#005c55] text-white hover:bg-[#0f766e] rounded-lg text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">publish</span>
              <span>{product ? 'পরিবর্তন সংরক্ষণ করুন' : 'পণ্য প্রকাশ করুন'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
