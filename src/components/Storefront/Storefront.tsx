import React, { useMemo, useState } from 'react';
import { CategoryKey, Product, StoreSettings } from '../../types';
import {
  createWhatsAppOrderMessage,
  formatPrice,
  getWhatsAppUrl,
  toBengaliNumber,
} from '../../utils/bengali';
import { QuickViewModal } from '../Shared/QuickViewModal';

interface StorefrontProps {
  products: Product[];
  settings: StoreSettings;
  onNavigateToAdmin: () => void;
  onRecordOrder?: (product: Product, total: number) => void;
  showToast: (title: string, desc?: string) => void;
}

export const Storefront: React.FC<StorefrontProps> = ({
  products,
  settings,
  onNavigateToAdmin,
  onRecordOrder,
  showToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'low-to-high' | 'high-to-low' | 'rating'>('featured');
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  // Active storefront products only (filtered by isLive)
  const activeProducts = useMemo(() => {
    return products.filter((p) => p.isLive);
  }, [products]);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    let list = activeProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === '' ||
        product.title.toLowerCase().includes(q) ||
        product.categoryLabel.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.sku.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'low-to-high') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'high-to-low') {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list = [...list].sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [activeProducts, selectedCategory, searchQuery, sortBy]);

  // Handle direct WhatsApp order click on card
  const handleDirectOrder = (product: Product) => {
    const msg = createWhatsAppOrderMessage({
      productTitle: product.title,
      price: product.price,
      deliveryArea: 'ঢাকা ভেতরে',
      deliveryCharge: settings.deliveryDhaka,
    });
    const waUrl = getWhatsAppUrl(settings.whatsappNumber, msg);

    showToast('WhatsApp এ রিডাইরেক্ট হচ্ছে...', `${product.title} (৳${product.price})`);
    if (onRecordOrder) {
      onRecordOrder(product, product.price + settings.deliveryDhaka);
    }

    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 350);
  };

  const handleHeroGeneralChat = () => {
    const defaultMsg =
      'আসসালামু আলাইকুম। আমি সহজ শপ থেকে কিছু পণ্যের বিষয়ে জানতে চাই।';
    const url = getWhatsAppUrl(settings.whatsappNumber, defaultMsg);
    window.open(url, '_blank');
  };

  const categories: { key: CategoryKey; label: string }[] = [
    { key: 'all', label: `সকল পণ্য (${activeProducts.length})` },
    { key: 'gadgets', label: 'ইলেকট্রনিক্স ও গ্যাজেট' },
    { key: 'fashion', label: 'ফ্যাশন ও লাইফস্টাইল' },
    { key: 'home', label: 'গৃহস্থালি পণ্য' },
    { key: 'accessories', label: 'ঘড়ি ও এক্সেসরিজ' },
    { key: 'wellness', label: 'স্বাস্থ্য ও স্বস্তি' },
  ];

  return (
    <div className="min-h-screen bg-[#f2fcf5] text-[#141d19] flex flex-col font-sans">
      {/* 1. Fixed Header */}
      <header className="fixed top-0 w-full z-40 bg-white/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#e0ebe4]">
        {/* Announcement Strip */}
        <div className="bg-[#005c55] text-white text-center py-1.5 px-4 text-xs font-medium flex items-center justify-center gap-2">
          <span>{settings.urgentNoticeText}</span>
          <span className="hidden md:inline-block text-[#9cf2e8]">|</span>
          <span className="hidden md:inline-block text-xs uppercase tracking-wider text-[#9cf2e8]">
            Hotline: {settings.hotline}
          </span>
        </div>

        {/* Main Nav Bar */}
        <div className="h-18 max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo & Search */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#5dfd8a]/40 flex items-center justify-center text-[#007232]">
                <span className="material-symbols-outlined text-2xl text-[#006d2f]">storefront</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-xl font-bold text-[#005c55] tracking-tight">
                    {settings.storeName}
                  </span>
                  <span className="bg-[#e0ebe4] text-[#141d19] px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                    BD
                  </span>
                </div>
                <span className="block text-[11px] text-[#3e4947] -mt-0.5">
                  Shohoj Shop • WhatsApp Store
                </span>
              </div>
            </div>

            {/* Desktop Quick Search */}
            <div className="hidden xl:flex items-center bg-[#ecf6ef] rounded-full px-4 py-1.5 w-64 border border-[#e0ebe4]">
              <span className="material-symbols-outlined text-[#6e7977] text-lg mr-2">search</span>
              <input
                className="bg-transparent border-none outline-none text-xs text-[#141d19] placeholder:text-[#6e7977] w-full"
                placeholder="পণ্য খুঁজুন (Search)..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm">
            <a
              href="#"
              className="text-[#005c55] font-bold border-b-2 border-[#005c55] pb-0.5"
            >
              হোম
            </a>
            <a
              href="#productsSection"
              className="text-[#3e4947] hover:text-[#005c55] transition-colors"
            >
              সকল পণ্য
            </a>
            <a
              href="#productsSection"
              onClick={() => setSelectedCategory('gadgets')}
              className="text-[#3e4947] hover:text-[#005c55] transition-colors"
            >
              জনপ্রিয় অফার
            </a>
            <a
              href="#footer-section"
              className="text-[#3e4947] hover:text-[#005c55] transition-colors"
            >
              যোগাযোগ
            </a>
            <button
              onClick={onNavigateToAdmin}
              className="text-[#005c55] bg-[#9cf2e8]/40 hover:bg-[#9cf2e8]/70 px-3 py-1 rounded-full text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
              <span>অ্যাডমিন প্যানেল</span>
            </button>
          </nav>

          {/* WhatsApp Direct CTA & Support profile */}
          <div className="flex items-center gap-3">
            <a
              className="hidden sm:flex items-center gap-1.5 bg-[#006d2f] hover:bg-[#005322] text-white text-xs md:text-sm font-bold px-4 py-2 rounded-full transition-all shadow-[0_12px_28px_-6px_rgba(37,211,102,0.35)] cursor-pointer"
              href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
            >
              <span className="material-symbols-outlined text-base">chat</span>
              <span>{settings.whatsappNumber}</span>
            </a>

            <div className="flex items-center gap-2 pl-1 border-l border-[#e0ebe4]">
              <div className="flex flex-col text-right hidden sm:block">
                <span className="text-xs font-bold text-[#141d19] leading-tight">সহায়তা কেন্দ্র</span>
                <span className="text-[11px] text-[#006d2f] font-medium flex items-center justify-end gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006d2f] animate-pulse"></span>
                  সক্রিয় আছেন
                </span>
              </div>
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#5dfd8a]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqjbicJ_rC3ZDKvaUgLKvs9AiiA8pUftYwYYfI00a_Xuxrss4irWz40ZVYaZ8M6cTvRzHNiSnBX-AZTOO6OtyASbOKO0yHb0WjDz6SOe0j6zjWSyx563tsLZ4Mt-wLJ-ddkoXOZanjkm4aO9adJsZTTYfCANJDyuQWZzeJyKmnYuyaCoQj3yAxa6EJz7ejItQ5Mw-tbaCyN6yWIi9xxVzxmcQJ8i7_mthX_C9cF6J_0YKykVLLI2vY"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Page Body */}
      <main className="w-full pt-26">
        {/* 2. Hero Promotional Section */}
        <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#ecf6ef] via-white to-[#f2fcf5] py-10 md:py-14">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#5dfd8a]/20 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full bg-[#9cf2e8]/20 blur-2xl pointer-events-none" />

          <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Content */}
              <div className="lg:col-span-7 flex flex-col items-start space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#5dfd8a]/30 text-[#005322] border border-[#5dfd8a]/60 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#006d2f] animate-pulse"></span>
                  <span className="text-xs font-bold tracking-wide">
                    ১০০% ভেরিফাইড ই-কমার্স শপ • ঢাকা ও সারা বাংলাদেশ
                  </span>
                </div>

                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#141d19] tracking-tight leading-tight">
                  সহজ কেনাকাটা, সরাসরি{' '}
                  <span className="text-[#006d2f] underline decoration-[#5dfd8a] decoration-wavy underline-offset-8">
                    WhatsApp-এ
                  </span>{' '}
                  অর্ডার!
                </h1>

                <p className="text-sm sm:text-base text-[#3e4947] max-w-xl leading-relaxed">
                  কোনো জটিল রেজিস্ট্রেশন বা পাসওয়ার্ড ছাড়াই পছন্দের পণ্য বেছে নিন এবং এক ক্লিকেই
                  সরাসরি বিক্রেতার সাথে কথা বলে অর্ডার নিশ্চিত করুন।
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#005c55] text-white text-sm font-bold shadow-md hover:bg-[#0f766e] transition-all cursor-pointer"
                    href="#productsSection"
                  >
                    <span>পণ্য দেখুন এখনই</span>
                    <span className="material-symbols-outlined text-lg">arrow_downward</span>
                  </a>

                  <button
                    onClick={handleHeroGeneralChat}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#006d2f] text-white text-sm font-bold shadow-lg hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">chat</span>
                    <span>সরাসরি কথা বলুন WhatsApp-এ</span>
                  </button>
                </div>

                {/* Trust Badges Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 w-full">
                  <div className="p-3 bg-white rounded-xl shadow-sm border border-[#e0ebe4] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006d2f] text-xl">verified</span>
                    <span className="text-xs text-[#141d19] font-bold">ক্যাশ অন ডেলিভারি</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl shadow-sm border border-[#e0ebe4] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#945d00] text-xl">bolt</span>
                    <span className="text-xs text-[#141d19] font-bold">২৪-৪৮ ঘণ্টায় ডেলিভারি</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl shadow-sm border border-[#e0ebe4] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#005c55] text-xl">support_agent</span>
                    <span className="text-xs text-[#141d19] font-bold">লাইভ চ্যাট হেল্প</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl shadow-sm border border-[#e0ebe4] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006d2f] text-xl">sync</span>
                    <span className="text-xs text-[#141d19] font-bold">৭ দিনের রিপ্লেসমেন্ট</span>
                  </div>
                </div>
              </div>

              {/* Right Visual Showcase / Conversational Mockup */}
              <div className="lg:col-span-5 relative">
                <div className="relative bg-white rounded-2xl p-5 shadow-xl max-w-md mx-auto border border-[#e0ebe4]">
                  {/* Simulated WhatsApp Header */}
                  <div className="flex items-center justify-between pb-3 bg-[#005c55] text-white -m-5 mb-4 p-4 rounded-t-2xl">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#006d2f] flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-sm">store</span>
                      </div>
                      <div>
                        <div className="text-sm font-bold leading-none">সহজ শপ বাংলাদেশ</div>
                        <span className="text-[11px] text-[#9cf2e8] opacity-90">
                          অনলাইন অর্ডার সাপোর্ট • ২৪/৭
                        </span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-white">more_vert</span>
                  </div>

                  {/* Simulated Chat Bubbles */}
                  <div className="space-y-3 text-xs py-1">
                    <div className="bg-[#ecf6ef] p-3 rounded-xl max-w-[85%] text-[#141d19] shadow-xs">
                      <p className="font-bold text-[#006d2f] mb-0.5">সহজ শপ হেল্পডেস্ক:</p>
                      <p className="leading-relaxed">
                        আসসালামু আলাইকুম! কোনো পণ্য পছন্দ হলে সরাসরি মেসেজ দিন, আমরা দ্রুত ডেলিভারি নিশ্চিত করব। 🚚
                      </p>
                      <span className="text-[10px] text-[#6e7977] text-right block mt-1">10:42 AM</span>
                    </div>

                    <div className="bg-[#5dfd8a]/30 border border-[#5dfd8a]/40 p-3 rounded-xl max-w-[88%] ml-auto text-[#141d19] shadow-xs">
                      <p className="font-bold text-[#005c55] mb-0.5">ক্রেতা (আপনার অর্ডার):</p>
                      <p className="italic text-[#3e4947] leading-relaxed">
                        "টি৯ প্রফেশনাল হেয়ার ট্রিমার - ১ পিস ধানমন্ডি, ঢাকায় পাঠাবেন প্লিজ..."
                      </p>
                      <span className="text-[10px] text-[#006d2f] font-bold text-right block mt-1">
                        অর্ডার গৃহীত ✓✓
                      </span>
                    </div>

                    {/* Quick highlight banner inside chat */}
                    <div className="bg-[#e0ebe4]/70 p-2.5 rounded-xl flex items-center gap-3 border border-[#dbe5de]">
                      <img
                        className="w-14 h-14 object-cover rounded-lg bg-white shrink-0"
                        alt="টি৯ হেয়ার ট্রিমার গোল্ড"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDp3FnBf1YkuzD_ureVwDDspAsI87lc1u5CaD4Ggasw2bRcHtIWYlJJzY87TVPoUq1oQbtQ-KJvZgC5cqRUpEJ_-bj-qLS102jd7j5Krd7Pi6xm0_sVZZHnHccKM9-62ArGNrGPfXxYaDXJXtTvz0_3EIuHkrtXHeT1hntrQfaq0KxQ3Tt_vsFiMzdhc7HK-BDBD6yhLkYkO8z9fkHianS-ww_Qq4RV5EF134LeYEkd9yOiAJkNQ3wD"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold truncate text-[#141d19]">
                          টি৯ হেয়ার ট্রিমার গোল্ড
                        </div>
                        <div className="text-[#006d2f] font-bold text-xs mt-0.5">
                          ৳ ১,১৯০{' '}
                          <span className="line-through text-[#6e7977] text-[11px] font-normal">
                            ৳ ১,৮৫০
                          </span>
                        </div>
                      </div>
                      <button
                        className="px-3 py-1.5 bg-[#006d2f] hover:bg-[#005322] text-white rounded-full text-xs font-bold shadow hover:brightness-105 transition-all cursor-pointer"
                        onClick={() => {
                          const item = activeProducts[0];
                          if (item) handleDirectOrder(item);
                        }}
                      >
                        অর্ডার
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 pt-2 border-t border-[#e0ebe4] flex items-center justify-between text-[#3e4947] text-xs">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[#006d2f] text-sm">lock</span>
                      নিরাপদ এনক্রিপ্টেড চ্যাট
                    </span>
                    <span className="text-[#005c55] font-bold">গড় রেসপন্স টাইম: ৩ মিনিট</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Main Storefront Catalog Section */}
        <section
          className="w-full max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-10"
          id="productsSection"
        >
          {/* Filter Bar Header Box */}
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-[#e0ebe4] mb-8">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Search Input Field */}
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#6e7977]">
                  search
                </span>
                <input
                  className="w-full pl-11 pr-10 py-3 rounded-full bg-[#ecf6ef] text-[#141d19] text-sm placeholder:text-[#6e7977] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#005c55]/20 transition-all border border-[#e0ebe4]"
                  placeholder="পণ্যের নাম বা ক্যাটাগরি দিয়ে খুঁজুন (যেমন: ট্রিমার, ঘড়ি, ব্লেন্ডার)..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6e7977] hover:text-[#141d19] cursor-pointer"
                    onClick={() => setSearchQuery('')}
                  >
                    <span className="material-symbols-outlined text-lg">cancel</span>
                  </button>
                )}
              </div>

              {/* Sort dropdown */}
              <div className="flex items-center gap-2 shrink-0">
                <label className="text-xs font-semibold text-[#3e4947] flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">swap_vert</span>
                  সাজান:
                </label>
                <select
                  className="bg-[#ecf6ef] text-[#141d19] text-xs font-medium px-3 py-2.5 rounded-xl border border-[#e0ebe4] outline-none focus:ring-2 focus:ring-[#005c55]/20 cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="featured">জনপ্রিয়তা (Featured)</option>
                  <option value="low-to-high">দাম: কম থেকে বেশি</option>
                  <option value="high-to-low">দাম: বেশি থেকে কম</option>
                  <option value="rating">সর্বোচ্চ রেটিং</option>
                </select>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pt-4 pb-1 no-scrollbar">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#005c55] text-white shadow-sm'
                        : 'bg-[#ecf6ef] hover:bg-[#e0ebe4] text-[#141d19] border border-[#e0ebe4]'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Status Count Bar */}
            <div className="flex items-center justify-between text-xs text-[#3e4947] pt-3 border-t border-[#e0ebe4] mt-3">
              <span>
                মোট {toBengaliNumber(filteredProducts.length)}টি প্রিমিয়াম পণ্য প্রদর্শিত হচ্ছে
              </span>
              <span className="flex items-center gap-1.5 text-[#006d2f] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#006d2f]"></span>
                ক্যাশ অন ডেলিভারি সহজলভ্য
              </span>
            </div>
          </div>

          {/* Product Cards Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-[#e0ebe4]"
                >
                  {/* Card Image */}
                  <div className="relative w-full aspect-square overflow-hidden bg-[#ecf6ef]">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://lh3.googleusercontent.com/aida-public/AB6AXuCLR3NeYuHFYG3PqdowX55mfKdIc_OG06VP6F-X12pujouMYagv_tmp9bVDPwgejF4Y-c6EnOLse55GLGLO2gtGXhhjMNo8DdbaiK-aTy_JGJEkPj3apO8zofZoT3jhG1X74lAuOkR9kRUOQZprS2R9bDdkNKi4HtZ2GN46vPXLOPluI0rQ-FgRsgzCZ21o1zDLVW0Vf0IAgPJtgND8xjy87WdPxpTaCuWEKovTbWUx7FSMoeVYRZex';
                      }}
                    />
                    <span className="absolute top-3 left-3 bg-[#006d2f] text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm">
                      {product.discount} ছাড়
                    </span>
                    <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-[#141d19] px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 shadow-xs">
                      <span className="material-symbols-outlined text-[#006d2f] text-xs">
                        check_circle
                      </span>
                      {product.stockStatus === 'instock'
                        ? 'ইন স্টক'
                        : product.stockStatus === 'lowstock'
                        ? 'সীমিত স্টক'
                        : 'স্টক শেষ'}
                    </span>
                  </div>

                  {/* Card Details */}
                  <div className="p-4 flex flex-col flex-1">
                    <span className="text-[10px] uppercase tracking-wider text-[#6e7977] mb-1 font-bold">
                      {product.categoryLabel}
                    </span>
                    <h3 className="text-sm font-bold text-[#141d19] line-clamp-2 mb-1.5 group-hover:text-[#005c55] transition-colors leading-snug">
                      {product.title}
                    </h3>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="flex text-amber-500 text-xs">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className="material-symbols-outlined text-sm material-symbols-fill"
                          >
                            star
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-[#3e4947] font-medium">
                        {toBengaliNumber(product.rating)} ({toBengaliNumber(product.reviewsCount)}{' '}
                        রিভিউ)
                      </span>
                    </div>

                    <p className="text-xs text-[#3e4947] line-clamp-2 mb-4 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Pricing & Actions */}
                    <div className="mt-auto pt-2 border-t border-[#f2fcf5]">
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-lg font-bold text-[#005c55]">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-xs text-[#6e7977] line-through">
                          {formatPrice(product.regularPrice)}
                        </span>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleDirectOrder(product)}
                          className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-[#006d2f] hover:bg-[#005322] active:scale-98 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-base">chat</span>
                          <span>WhatsApp-এ অর্ডার করুন</span>
                        </button>

                        <button
                          onClick={() => setSelectedProductForModal(product)}
                          className="w-full py-1.5 rounded-full bg-[#ecf6ef] hover:bg-[#e0ebe4] text-[#141d19] text-xs font-semibold transition-colors cursor-pointer"
                        >
                          বিস্তারিত দেখুন
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* No Results Found */
            <div className="text-center py-16 bg-white rounded-2xl p-6 shadow-sm border border-[#e0ebe4]">
              <span className="material-symbols-outlined text-[#6e7977] text-5xl mb-2">
                sentiment_dissatisfied
              </span>
              <h3 className="text-lg font-bold text-[#141d19]">কোনো পণ্য খুঁজে পাওয়া যায়নি!</h3>
              <p className="text-xs text-[#3e4947] max-w-md mx-auto mt-1 mb-4">
                অন্য কোনো নাম বা কি-ওয়ার্ড দিয়ে অনুসন্ধান করুন অথবা ফিল্টার রিসেট করুন।
              </p>
              <button
                className="px-4 py-2 bg-[#005c55] text-white rounded-full text-xs font-bold cursor-pointer"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                সকল পণ্য দেখুন
              </button>
            </div>
          )}
        </section>

        {/* 4. How to Order Guide Section */}
        <section className="w-full bg-[#ecf6ef] py-12 border-y border-[#e0ebe4]">
          <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-[#006d2f] text-xs uppercase tracking-widest font-bold">
                সহজ প্রক্রিয়া
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-[#141d19] mt-1">
                কীভাবে সহজে WhatsApp-এ অর্ডার করবেন?
              </h2>
              <p className="text-xs md:text-sm text-[#3e4947] mt-2">
                আমাদের অর্ডার প্রক্রিয়া অত্যন্ত দ্রুত এবং ঝামেলাহীন। ৪টি সহজ ধাপে পণ্য পৌঁছে যাবে আপনার ঠিকানায়।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Step 1 */}
              <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-[#e0ebe4]">
                <div className="w-12 h-12 rounded-2xl bg-[#005c55]/10 text-[#005c55] flex items-center justify-center text-lg font-bold mb-4">
                  ০১
                </div>
                <h3 className="text-sm font-bold text-[#141d19] mb-1">পণ্য নির্বাচন করুন</h3>
                <p className="text-xs text-[#3e4947] leading-relaxed">
                  পছন্দের পণ্যের স্পেসিফিকেশন ও মূল্য দেখে চূড়ান্ত সিদ্ধান্ত নিন।
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-[#e0ebe4]">
                <div className="w-12 h-12 rounded-2xl bg-[#5dfd8a]/40 text-[#005322] flex items-center justify-center text-lg font-bold mb-4">
                  ০২
                </div>
                <h3 className="text-sm font-bold text-[#141d19] mb-1">WhatsApp বাটনে ক্লিক</h3>
                <p className="text-xs text-[#3e4947] leading-relaxed">
                  'WhatsApp-এ অর্ডার করুন' বাটনে ক্লিক করলেই প্রস্তুত মেসেজ সহ চ্যাট খুলবে।
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-[#e0ebe4]">
                <div className="w-12 h-12 rounded-2xl bg-[#ffddb8] text-[#734700] flex items-center justify-center text-lg font-bold mb-4">
                  ০৩
                </div>
                <h3 className="text-sm font-bold text-[#141d19] mb-1">ঠিকানা প্রদান করুন</h3>
                <p className="text-xs text-[#3e4947] leading-relaxed">
                  মেসেজটি পাঠিয়ে আপনার ডেলিভারি ঠিকানা এবং ফোন নম্বর উল্লেখ করুন।
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-[#e0ebe4]">
                <div className="w-12 h-12 rounded-2xl bg-[#006d2f] text-white flex items-center justify-center text-lg font-bold mb-4">
                  ০৪
                </div>
                <h3 className="text-sm font-bold text-[#141d19] mb-1">পণ্য পেয়ে মূল্য পরিশোধ</h3>
                <p className="text-xs text-[#3e4947] leading-relaxed">
                  ডেলিভারি ম্যান পণ্য নিয়ে গেলে যাচাই করে ক্যাশ অন ডেলিভারিতে টাকা দিন।
                </p>
              </div>
            </div>

            {/* Delivery Charge Banner */}
            <div className="mt-8 p-4 rounded-2xl bg-[#e0ebe4] flex flex-col md:flex-row items-center justify-between gap-4 border border-[#dbe5de]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#006d2f] flex items-center justify-center text-white shrink-0">
                  <span className="material-symbols-outlined text-xl">local_shipping</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-[#141d19]">স্বচ্ছ ডেলিভারি চার্জ পলিসি</div>
                  <p className="text-xs text-[#3e4947]">
                    ঢাকা সিটির ভিতরে ডেলিভারি মাত্র <b>৳{toBengaliNumber(settings.deliveryDhaka)}</b> এবং সারা বাংলাদেশে মাত্র <b>৳{toBengaliNumber(settings.deliveryOutside)}</b>।
                  </p>
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-white px-4 py-2 rounded-full shadow-sm text-[#006d2f] text-xs font-bold border border-[#dbe5de]">
                <span className="material-symbols-outlined text-sm">safety_check</span>
                <span>কোনো হিডেন বা অতিরিক্ত চার্জ নেই</span>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Customer Testimonials Section */}
        <section className="w-full py-12 max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <span className="text-[#006d2f] text-xs uppercase tracking-widest font-bold">
                গ্রাহক সন্তুষ্টি
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-[#141d19] mt-1">
                সন্তুষ্ট গ্রাহকদের বাস্তব অভিজ্ঞতা
              </h2>
            </div>
            <div className="mt-2 md:mt-0 flex items-center gap-2">
              <div className="flex text-amber-500">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="material-symbols-outlined text-sm material-symbols-fill">
                    star
                  </span>
                ))}
              </div>
              <span className="text-sm font-bold text-[#141d19]">৪.৯/৫ (১৫০০+ সফল অর্ডার)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Review 1 */}
            <div className="p-5 rounded-2xl bg-white shadow-sm flex flex-col justify-between border border-[#e0ebe4]">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-amber-500 text-xs">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span key={i} className="material-symbols-outlined text-xs material-symbols-fill">
                        star
                      </span>
                    ))}
                  </div>
                  <span className="text-[#006d2f] text-[11px] font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">verified</span>
                    ভেরিফাইড ক্রেতা
                  </span>
                </div>
                <p className="text-xs md:text-sm text-[#141d19] mb-4 leading-relaxed">
                  "টি৯ ট্রিমারটি অর্ডার করেছিলাম। কোনো রেজিস্ট্রেশন ছাড়া শুধু হোয়াটসঅ্যাপে মেসেজ দিয়েই ২৪ ঘণ্টার মধ্যে ধানমন্ডিতে হোম ডেলিভারি পেয়েছি। পণ্যের মান অরিজিনাল!"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-[#f2fcf5]">
                <div className="w-10 h-10 rounded-full bg-[#0f766e] text-white flex items-center justify-center font-bold text-sm">
                  রা
                </div>
                <div>
                  <div className="text-xs font-bold text-[#141d19]">রাকিবুল হাসান</div>
                  <span className="text-[11px] text-[#6e7977]">ধানমন্ডি, ঢাকা</span>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="p-5 rounded-2xl bg-white shadow-sm flex flex-col justify-between border border-[#e0ebe4]">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-amber-500 text-xs">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span key={i} className="material-symbols-outlined text-xs material-symbols-fill">
                        star
                      </span>
                    ))}
                  </div>
                  <span className="text-[#006d2f] text-[11px] font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">verified</span>
                    ভেরিফাইড ক্রেতা
                  </span>
                </div>
                <p className="text-xs md:text-sm text-[#141d19] mb-4 leading-relaxed">
                  "স্মার্ট ওয়াচ আল্ট্রা ২ টি চিটাগং এ ৩ দিনে হাতে পেয়েছি। ডেলিভারি ম্যানের সামনে প্যাকেট চেক করে টাকা পরিশোধের সুযোগ পাওয়ায় খুব ভালো লেগেছে।"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-[#f2fcf5]">
                <div className="w-10 h-10 rounded-full bg-[#5dfd8a]/50 text-[#005322] flex items-center justify-center font-bold text-sm">
                  ফা
                </div>
                <div>
                  <div className="text-xs font-bold text-[#141d19]">ফারহানা চৌধুরী</div>
                  <span className="text-[11px] text-[#6e7977]">জিইসি মোড়, চট্টগ্রাম</span>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="p-5 rounded-2xl bg-white shadow-sm flex flex-col justify-between border border-[#e0ebe4]">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-amber-500 text-xs">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span key={i} className="material-symbols-outlined text-xs material-symbols-fill">
                        star
                      </span>
                    ))}
                  </div>
                  <span className="text-[#006d2f] text-[11px] font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">verified</span>
                    ভেরিফাইড ক্রেতা
                  </span>
                </div>
                <p className="text-xs md:text-sm text-[#141d19] mb-4 leading-relaxed">
                  "মেমোরি ফোম কুশন ও ব্লুটুথ ইয়ারবাডস নিয়েছি। তাদের হোয়াটসঅ্যাপ সাপোর্ট প্রতিনিধি খুব বিনয়ী এবং দ্রুত রিপ্লাই দেন। সহজে কেনাকাটার বিশ্বস্ত জায়গা।"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-[#f2fcf5]">
                <div className="w-10 h-10 rounded-full bg-[#e0ebe4] text-[#005c55] font-bold flex items-center justify-center text-sm">
                  তা
                </div>
                <div>
                  <div className="text-xs font-bold text-[#141d19]">তানভীর আহমেদ</div>
                  <span className="text-[11px] text-[#6e7977]">উপশহর, সিলেট</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 6. Footer Section */}
      <footer className="w-full bg-[#ecf6ef] border-t border-[#e0ebe4] mt-10" id="footer-section">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Col 1 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#5dfd8a]/40 flex items-center justify-center text-[#006d2f]">
                  <span className="material-symbols-outlined text-lg">storefront</span>
                </div>
                <span className="font-display text-lg text-[#005c55] font-bold">
                  {settings.storeName}
                </span>
              </div>
              <p className="text-xs text-[#3e4947] mb-3 leading-relaxed">
                বাংলাদেশে নির্ভরযোগ্য এবং অতিদ্রুত WhatsApp কমার্স প্ল্যাটফর্ম। গুণগত পণ্যের বিশ্বস্ত ঠিকানা।
              </p>
              <div className="flex items-center gap-1.5 text-xs text-[#3e4947]">
                <span className="material-symbols-outlined text-[#006d2f] text-sm">verified</span>
                <span>সরকারি অনুমোদিত ই-কমার্স মার্চেন্ট</span>
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-[#141d19] mb-3">
                গুরুত্বপূর্ণ লিংক
              </h4>
              <ul className="space-y-2 text-xs text-[#3e4947]">
                <li>
                  <a
                    href="#productsSection"
                    className="hover:text-[#005c55] transition-colors"
                  >
                    সকল পণ্য কালেকশন
                  </a>
                </li>
                <li>
                  <a
                    href="#productsSection"
                    onClick={() => setSelectedCategory('gadgets')}
                    className="hover:text-[#005c55] transition-colors"
                  >
                    আজকের হট ডিল ও ডিসকাউন্ট
                  </a>
                </li>
                <li>
                  <button
                    onClick={onNavigateToAdmin}
                    className="hover:text-[#005c55] transition-colors text-left cursor-pointer"
                  >
                    মার্চেন্ট কন্ট্রোল প্যানেল
                  </button>
                </li>
                <li>
                  <a
                    href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#005c55] transition-colors"
                  >
                    কাস্টমার কেয়ার ও অভিযোগ
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-[#141d19] mb-3">
                সরাসরি যোগাযোগ
              </h4>
              <p className="text-xs text-[#3e4947] mb-2 leading-relaxed">
                যেকোনো জিজ্ঞাসা বা পাইকারি ক্রয়ের জন্য কল বা মেসেজ দিন:
              </p>
              <div className="bg-white p-3 rounded-xl border border-[#e0ebe4] shadow-xs mb-2">
                <span className="text-[10px] text-[#6e7977] block uppercase font-bold">
                  WhatsApp হটলাইন
                </span>
                <a
                  className="text-base text-[#006d2f] font-bold block mt-0.5 hover:underline"
                  href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {settings.whatsappNumber}
                </a>
                <span className="text-[11px] text-[#6e7977] block mt-0.5">
                  সকাল ৯:০০ - রাত ১১:০০ (প্রতিদিন)
                </span>
              </div>
            </div>

            {/* Col 4 */}
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-[#141d19] mb-3">
                নিরাপদ পেমেন্ট পার্টনার
              </h4>
              <p className="text-xs text-[#3e4947] mb-2">ক্যাশ অন ডেলিভারি ছাড়াও ডিজিটাল পেমেন্ট সুবিধা:</p>
              <div className="flex flex-wrap gap-1.5 text-xs">
                <span className="bg-[#dbe5de] px-2.5 py-1 rounded-md text-[#141d19] font-bold">bKash</span>
                <span className="bg-[#dbe5de] px-2.5 py-1 rounded-md text-[#141d19] font-bold">Nagad</span>
                <span className="bg-[#dbe5de] px-2.5 py-1 rounded-md text-[#141d19] font-bold">Rocket</span>
                <span className="bg-[#5dfd8a]/40 text-[#005322] px-2.5 py-1 rounded-md font-bold">
                  Cash on Delivery (COD)
                </span>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-[#3e4947] text-xs">
                <span className="material-symbols-outlined text-[#006d2f] text-sm">local_shipping</span>
                <span>সমগ্র বাংলাদেশে ৩-৫ দিনে হোম ডেলিভারি</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#e0ebe4] flex flex-col md:flex-row items-center justify-between text-xs text-[#6e7977] gap-2">
            <div>© ২০২৪ {settings.storeName} (Shohoj Shop). সর্বস্বত্ব সংরক্ষিত।</div>
            <div className="flex items-center gap-4">
              <span className="hover:text-[#005c55] cursor-pointer">গোপনীয়তা নীতি</span>
              <span className="hover:text-[#005c55] cursor-pointer">ব্যবহারের শর্তাবলী</span>
              <span className="hover:text-[#005c55] cursor-pointer">রিটার্ন ও রিফান্ড</span>
            </div>
          </div>
        </div>
      </footer>

      {/* 7. Floating Sticky WhatsApp CTA Button */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center group">
        <div className="hidden md:flex mr-3 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg text-[#141d19] text-xs font-semibold items-center gap-1.5 border border-[#e0ebe4]">
          <span className="w-2 h-2 rounded-full bg-[#006d2f] animate-ping"></span>
          <span>অর্ডারে সাহায্য লাগবে? WhatsApp-এ নক দিন</span>
        </div>
        <a
          className="w-14 h-14 rounded-full bg-[#006d2f] text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all relative cursor-pointer"
          href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
            'আসসালামু আলাইকুম। অর্ডার করতে সাহায্য চাই।'
          )}`}
          target="_blank"
          rel="noreferrer"
        >
          <span className="material-symbols-outlined text-3xl">chat</span>
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#ba1a1a] rounded-full ring-2 ring-white"></span>
        </a>
      </div>

      {/* 8. Quick View Order Modal */}
      {selectedProductForModal && (
        <QuickViewModal
          product={selectedProductForModal}
          settings={settings}
          onClose={() => setSelectedProductForModal(null)}
          onOrderSuccess={(product, total) => {
            showToast('অর্ডার বার্তা প্রস্তুত!', `WhatsApp এ পাঠানো হচ্ছে...`);
            if (onRecordOrder) onRecordOrder(product, total);
          }}
        />
      )}
    </div>
  );
};
