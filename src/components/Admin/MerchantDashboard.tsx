import React, { useMemo, useState } from 'react';
import { Customer, OrderInquiry, Product, StoreSettings } from '../../types';
import { formatPrice, getWhatsAppUrl, toBengaliNumber } from '../../utils/bengali';
import { AddEditProductModal } from './AddEditProductModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { WhatsAppConfigModal } from './WhatsAppConfigModal';

interface MerchantDashboardProps {
  products: Product[];
  orders: OrderInquiry[];
  customers: Customer[];
  settings: StoreSettings;
  adminUser?: {
    name: string;
    email: string;
    role: string;
  };
  onLogout: () => void;
  onUpdateSettings: (newSettings: Partial<StoreSettings>) => void;
  onSaveProduct: (productData: Partial<Product>, editId?: string) => void;
  onDeleteProduct: (productId: string) => void;
  onToggleProductLive: (productId: string) => void;
  onNavigateToStore: () => void;
  showToast: (title: string, desc?: string) => void;
}

export const MerchantDashboard: React.FC<MerchantDashboardProps> = ({
  products,
  orders,
  customers,
  settings,
  adminUser,
  onLogout,
  onUpdateSettings,
  onSaveProduct,
  onDeleteProduct,
  onToggleProductLive,
  onNavigateToStore,
  showToast,
}) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'settings' | 'customers'>('products');

  // Search & Filter state for Products
  const [productSearch, setProductSearch] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'instock' | 'lowstock' | 'outstock'>('all');

  // Global search in Topbar
  const [globalSearch, setGlobalSearch] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProductCandidate, setDeleteProductCandidate] = useState<Product | null>(null);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);

  // Settings form local state
  const [waNumberInput, setWaNumberInput] = useState(settings.whatsappNumber.replace('+880 ', ''));
  const [templateInput, setTemplateInput] = useState(settings.template);
  const [dhakaChargeInput, setDhakaChargeInput] = useState(settings.deliveryDhaka);
  const [outsideChargeInput, setOutsideChargeInput] = useState(settings.deliveryOutside);
  const [codEnabled, setCodEnabled] = useState(settings.codEnabled);
  const [urgentNoticeEnabled, setUrgentNoticeEnabled] = useState(settings.urgentNoticeEnabled);

  // Active products count
  const liveCount = useMemo(() => products.filter((p) => p.isLive).length, [products]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        productSearch.trim() === '' ||
        p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.categoryLabel.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.sku.toLowerCase().includes(productSearch.toLowerCase());

      const matchStock = stockFilter === 'all' || p.stockStatus === stockFilter;

      const matchGlobal =
        globalSearch.trim() === '' ||
        p.title.toLowerCase().includes(globalSearch.toLowerCase()) ||
        p.sku.toLowerCase().includes(globalSearch.toLowerCase());

      return matchSearch && matchStock && matchGlobal;
    });
  }, [products, productSearch, stockFilter, globalSearch]);

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (!globalSearch.trim()) return true;
      const q = globalSearch.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        o.productName.toLowerCase().includes(q)
      );
    });
  }, [orders, globalSearch]);

  // Handle open edit
  const handleEdit = (p: Product) => {
    setEditingProduct(p);
    setIsAddModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsAddModalOpen(true);
  };

  const handleSaveProductSubmit = (productData: Partial<Product>) => {
    onSaveProduct(productData, editingProduct?.id);
    showToast(
      editingProduct
        ? 'পণ্য সফলভাবে হালনাগাদ (Update) করা হয়েছে'
        : 'নতুন পণ্যটি সফলভাবে স্টোরফ্রন্টে প্রকাশ করা হয়েছে'
    );
  };

  const handleDeleteConfirmed = () => {
    if (deleteProductCandidate) {
      onDeleteProduct(deleteProductCandidate.id);
      showToast('পণ্যটি সফলভাবে মুছে ফেলা হয়েছে', deleteProductCandidate.title);
      setDeleteProductCandidate(null);
    }
  };

  const handleSaveSettings = () => {
    onUpdateSettings({
      whatsappNumber: waNumberInput.startsWith('+880') ? waNumberInput : `+880 ${waNumberInput.trim()}`,
      template: templateInput,
      deliveryDhaka: Number(dhakaChargeInput),
      deliveryOutside: Number(outsideChargeInput),
      codEnabled,
      urgentNoticeEnabled,
    });
    showToast('মার্চেন্ট ও WhatsApp সেটিংস সংরক্ষণ করা হয়েছে');
  };

  return (
    <div className="min-h-screen bg-[#f2fcf5] text-[#141d19] flex">
      {/* 1. Left Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-[#29322e] text-[#e9f3ec] z-40 flex flex-col justify-between py-6 shadow-xl">
        <div className="px-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 px-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#005c55] flex items-center justify-center text-white shadow-sm">
              <span className="material-symbols-outlined text-xl">storefront</span>
            </div>
            <div>
              <span className="font-display text-base font-bold text-white block">
                সহজ শপ অ্যাডমিন
              </span>
              <span className="text-[10px] text-[#bdc9c6] uppercase tracking-wider block">
                Merchant Dashboard
              </span>
            </div>
          </div>

          {/* Menu Category */}
          <div className="mb-2 px-2 text-[10px] uppercase tracking-wider text-[#bdc9c6] font-bold">
            প্রধান মেনু
          </div>

          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer text-left ${
                activeTab === 'products'
                  ? 'bg-[#005c55] text-white font-bold shadow-sm'
                  : 'text-[#bdc9c6] hover:bg-[#3e4947]/40 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-lg">inventory_2</span>
              <span>পণ্য তালিকা ও স্টক</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer text-left ${
                activeTab === 'orders'
                  ? 'bg-[#005c55] text-white font-bold shadow-sm'
                  : 'text-[#bdc9c6] hover:bg-[#3e4947]/40 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-lg">chat</span>
                <span>WhatsApp ইনবক্স ও চ্যাট</span>
              </div>
              <span className="w-5 h-5 rounded-full bg-[#ba1a1a] text-white text-[10px] font-bold flex items-center justify-center">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer text-left ${
                activeTab === 'settings'
                  ? 'bg-[#005c55] text-white font-bold shadow-sm'
                  : 'text-[#bdc9c6] hover:bg-[#3e4947]/40 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-lg">settings</span>
              <span>মার্চেন্ট সেটিংস ও টেমপ্লেট</span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer text-left ${
                activeTab === 'customers'
                  ? 'bg-[#005c55] text-white font-bold shadow-sm'
                  : 'text-[#bdc9c6] hover:bg-[#3e4947]/40 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-lg">group</span>
              <span>গ্রাহক তালিকা ({customers.length})</span>
            </button>
          </nav>

          {/* Storefront & Session Section */}
          <div className="mt-8 mb-2 px-2 text-[10px] uppercase tracking-wider text-[#bdc9c6] font-bold">
            স্টোর ও সেশন
          </div>

          <nav className="space-y-1.5">
            <button
              onClick={onNavigateToStore}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#bdc9c6] hover:bg-[#3e4947]/40 hover:text-white transition-all cursor-pointer text-left"
            >
              <span className="material-symbols-outlined text-lg">store</span>
              <span>স্টোর ভিজিট করুন</span>
            </button>

            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#ffdad6] hover:bg-[#ba1a1a]/30 hover:text-white transition-all cursor-pointer text-left group"
            >
              <span className="material-symbols-outlined text-lg text-[#ffb4ab] group-hover:text-white">
                logout
              </span>
              <span>লগআউট (Logout)</span>
            </button>
          </nav>
        </div>

        {/* Live Status indicator */}
        <div className="px-4">
          <div className="bg-[#3e4947]/30 border border-[#bdc9c6]/20 p-3 rounded-xl flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#66ff8e] animate-pulse"></div>
              <span className="text-xs text-[#e9f3ec] font-medium">WhatsApp Gateway লাইভ</span>
            </div>
            <span className="material-symbols-outlined text-lg text-[#66ff8e]">bolt</span>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="pl-72 flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="fixed top-0 left-72 right-0 h-16 bg-white/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#e0ebe4] z-30 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-[#ecf6ef] rounded-full px-4 py-1.5 w-80 border border-[#e0ebe4]">
              <span className="material-symbols-outlined text-[#6e7977] text-lg mr-2">search</span>
              <input
                className="bg-transparent border-none outline-none text-xs text-[#141d19] placeholder:text-[#6e7977] w-full"
                placeholder="অর্ডার আইডি, ফোন বা নাম খুঁজুন..."
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => showToast('কোনো নতুন নোটিফিকেশন নেই')}
              className="w-9 h-9 rounded-full bg-[#ecf6ef] flex items-center justify-center text-[#3e4947] hover:text-[#141d19] transition-colors relative cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
            </button>

            <div className="flex items-center gap-3 pl-2 border-l border-[#e0ebe4]">
              <div className="text-right hidden sm:block">
                <span className="block text-xs font-bold text-[#141d19]">
                  {adminUser?.name || 'মার্চেন্ট অ্যাডমিন'}
                </span>
                <span className="block text-[11px] text-[#3e4947]">
                  {adminUser?.role || 'সুপার অ্যাডমিন'} • {settings.branchName.replace('সহজ শপ ', '')}
                </span>
              </div>
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#005c55]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqjbicJ_rC3ZDKvaUgLKvs9AiiA8pUftYwYYfI00a_Xuxrss4irWz40ZVYaZ8M6cTvRzHNiSnBX-AZTOO6OtyASbOKO0yHb0WjDz6SOe0j6zjWSyx563tsLZ4Mt-wLJ-ddkoXOZanjkm4aO9adJsZTTYfCANJDyuQWZzeJyKmnYuyaCoQj3yAxa6EJz7ejItQ5Mw-tbaCyN6yWIi9xxVzxmcQJ8i7_mthX_C9cF6J_0YKykVLLI2vY"
              />

              <button
                onClick={onLogout}
                title="অ্যাডমিন প্যানেল থেকে লগআউট করুন"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ffdad6]/70 hover:bg-[#ffdad6] text-[#ba1a1a] text-xs font-bold transition-all cursor-pointer border border-[#ba1a1a]/20 shadow-xs"
              >
                <span className="material-symbols-outlined text-base">logout</span>
                <span className="hidden md:inline-block">লগআউট</span>
              </button>
            </div>
          </div>
        </header>

        {/* Body content */}
        <main className="pt-20 px-6 py-6 pb-16 flex flex-col gap-6">
          {/* Store Admin Overview Header */}
          <div className="bg-white rounded-xl shadow-sm p-5 border border-[#e0ebe4]">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
              {/* Merchant Info & Status */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#0f766e] text-[#a3faef] flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-[#141d19]">
                      {settings.branchName}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-[#5dfd8a]/40 text-[#005322] px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                      <span className="w-2 h-2 rounded-full bg-[#006d2f] animate-ping"></span>
                      অনলাইন স্টোর সক্রিয় (Live)
                    </span>
                  </div>
                  <p className="text-xs text-[#3e4947] flex items-center gap-1.5 mt-0.5">
                    <span className="material-symbols-outlined text-sm text-[#005c55]">
                      verified_user
                    </span>
                    লগইনকৃত: অ্যাডমিন (রাহিম আহমেদ) •{' '}
                    <span className="text-[#005c55] font-bold">সুপার অ্যাডমিন ভূমিকা</span>
                  </p>
                </div>
              </div>

              {/* WhatsApp Gateway Direct Configuration Bar */}
              <div className="flex flex-wrap items-center gap-3 bg-[#ecf6ef] px-4 py-2.5 rounded-xl border border-[#e0ebe4]">
                <div className="flex items-center gap-2 text-[#141d19]">
                  <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xs">
                    <span className="material-symbols-outlined text-lg">chat</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-[#3e4947] font-bold uppercase tracking-wider">
                      অর্ডার গ্রহণের বর্তমান WhatsApp নম্বর
                    </span>
                    <span className="block text-sm font-bold tracking-tight text-[#141d19]">
                      {settings.whatsappNumber}
                    </span>
                  </div>
                </div>
                <button
                  className="px-3 py-1.5 bg-white hover:bg-[#e0ebe4] text-[#141d19] text-xs font-bold rounded-lg transition-all flex items-center gap-1 border border-[#e0ebe4] cursor-pointer"
                  onClick={() => setIsWhatsAppModalOpen(true)}
                >
                  <span className="material-symbols-outlined text-sm">tune</span>
                  <span>নম্বর পরিবর্তন করুন</span>
                </button>
              </div>
            </div>
          </div>

          {/* Performance KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* KPI 1 */}
            <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-[#e0ebe4]">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#3e4947] font-semibold">মোট সক্রিয় পণ্য</span>
                <div className="w-9 h-9 rounded-lg bg-[#ecf6ef] flex items-center justify-center text-[#005c55]">
                  <span className="material-symbols-outlined text-lg">inventory_2</span>
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-[#141d19]">
                  {toBengaliNumber(liveCount)}
                </span>
                <span className="text-xs text-[#3e4947]">টি তালিকাভুক্ত</span>
              </div>
              <div className="mt-2 text-[#006d2f] text-xs flex items-center gap-1 font-semibold">
                <span className="material-symbols-outlined text-xs">trending_up</span>
                <span>সকল পণ্য অনলাইন শপে সক্রিয়</span>
              </div>
            </div>

            {/* KPI 2 */}
            <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-[#e0ebe4]">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#3e4947] font-semibold">আজকের WhatsApp ইনকোয়ারি</span>
                <div className="w-9 h-9 rounded-lg bg-[#5dfd8a]/30 flex items-center justify-center text-[#006d2f]">
                  <span className="material-symbols-outlined text-lg">mark_chat_unread</span>
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-[#141d19]">১৮</span>
                <span className="text-xs text-[#3e4947]">টি কথোপকথন</span>
              </div>
              <div className="mt-2 text-[#006d2f] text-xs flex items-center gap-1 font-semibold">
                <span className="material-symbols-outlined text-xs">arrow_upward</span>
                <span>+১২% গতকালের তুলনায় বৃদ্ধি</span>
              </div>
            </div>

            {/* KPI 3 */}
            <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-[#e0ebe4]">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#3e4947] font-semibold">মোট আনুমানিক বিক্রি</span>
                <div className="w-9 h-9 rounded-lg bg-[#0f766e]/20 flex items-center justify-center text-[#005c55]">
                  <span className="material-symbols-outlined text-lg">payments</span>
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-[#005c55]">৳ ৪২,৫০০</span>
                <span className="text-xs text-[#3e4947]">এই মাসে</span>
              </div>
              <div className="mt-2 text-[#3e4947] text-xs flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-[#734700]">hourglass_bottom</span>
                <span>কনফার্মড WhatsApp কার্টস</span>
              </div>
            </div>

            {/* KPI 4 */}
            <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-[#e0ebe4]">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#3e4947] font-semibold">পেন্ডিং ডেলিভারি</span>
                <div className="w-9 h-9 rounded-lg bg-[#ffddb8] flex items-center justify-center text-[#734700]">
                  <span className="material-symbols-outlined text-lg">local_shipping</span>
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-[#734700]">৭</span>
                <span className="text-xs text-[#3e4947]">টি পার্সেল স্টেজিংয়ে</span>
              </div>
              <div className="mt-2 text-[#734700] text-xs flex items-center gap-1 font-semibold">
                <span className="material-symbols-outlined text-xs">schedule</span>
                <span>আজ পাঠাতে হবে: ৪ টি</span>
              </div>
            </div>
          </div>

          {/* Navigation Segment Tabs & Actions Bar */}
          <div className="bg-white rounded-xl shadow-sm p-2 border border-[#e0ebe4] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto">
              <button
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'products'
                    ? 'bg-[#005c55] text-white shadow-sm'
                    : 'text-[#3e4947] hover:bg-[#ecf6ef]'
                }`}
                onClick={() => setActiveTab('products')}
              >
                <span className="material-symbols-outlined text-base">inventory_2</span>
                <span>পণ্য তালিকা ও স্টক</span>
              </button>

              <button
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-[#005c55] text-white font-bold shadow-sm'
                    : 'text-[#3e4947] hover:bg-[#ecf6ef]'
                }`}
                onClick={() => setActiveTab('orders')}
              >
                <span className="material-symbols-outlined text-base">chat_bubble</span>
                <span>WhatsApp অর্ডার ইনবক্স</span>
                <span className="w-5 h-5 rounded-full bg-[#ba1a1a] text-white text-[10px] font-bold flex items-center justify-center">
                  {orders.length}
                </span>
              </button>

              <button
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-[#005c55] text-white font-bold shadow-sm'
                    : 'text-[#3e4947] hover:bg-[#ecf6ef]'
                }`}
                onClick={() => setActiveTab('settings')}
              >
                <span className="material-symbols-outlined text-base">settings</span>
                <span>মার্চেন্ট সেটিংস ও টেমপ্লেট</span>
              </button>
            </div>

            {/* Quick CTA to Add Product */}
            <div className="w-full md:w-auto flex items-center justify-end">
              <button
                className="w-full md:w-auto px-4 py-2 bg-[#005c55] text-white hover:bg-[#0f766e] rounded-lg text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                onClick={handleOpenAdd}
              >
                <span className="material-symbols-outlined text-base">add_circle</span>
                <span>নতুন পণ্য যোগ করুন</span>
              </button>
            </div>
          </div>

          {/* TAB 1: PRODUCTS & INVENTORY */}
          {activeTab === 'products' && (
            <div className="flex flex-col gap-4">
              {/* Controls Bar: Search, Status Filter */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e0ebe4] flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Search Box */}
                <div className="flex items-center bg-[#ecf6ef] rounded-lg px-3 py-2 w-full md:w-96 border border-[#e0ebe4]">
                  <span className="material-symbols-outlined text-[#6e7977] text-base mr-2">search</span>
                  <input
                    className="bg-transparent border-none outline-none text-xs text-[#141d19] placeholder:text-[#6e7977] w-full"
                    placeholder="পণ্যের নাম বা ক্যাটাগরি দিয়ে খুঁজুন..."
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                  {productSearch && (
                    <button
                      onClick={() => setProductSearch('')}
                      className="text-[#6e7977] hover:text-[#141d19] text-xs cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">cancel</span>
                    </button>
                  )}
                </div>

                {/* Filter Badges */}
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
                  <span className="text-[10px] text-[#3e4947] font-bold uppercase mr-1">
                    ফিল্টার:
                  </span>
                  <button
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      stockFilter === 'all'
                        ? 'bg-[#005c55] text-white'
                        : 'bg-[#ecf6ef] text-[#141d19] hover:bg-[#e0ebe4]'
                    }`}
                    onClick={() => setStockFilter('all')}
                  >
                    সকল পণ্য
                  </button>
                  <button
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      stockFilter === 'instock'
                        ? 'bg-[#005c55] text-white font-bold'
                        : 'bg-[#ecf6ef] text-[#141d19] hover:bg-[#e0ebe4]'
                    }`}
                    onClick={() => setStockFilter('instock')}
                  >
                    ইন স্টক
                  </button>
                  <button
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      stockFilter === 'lowstock'
                        ? 'bg-[#005c55] text-white font-bold'
                        : 'bg-[#ecf6ef] text-[#141d19] hover:bg-[#e0ebe4]'
                    }`}
                    onClick={() => setStockFilter('lowstock')}
                  >
                    সীমিত স্টক
                  </button>
                  <button
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      stockFilter === 'outstock'
                        ? 'bg-[#005c55] text-white font-bold'
                        : 'bg-[#ecf6ef] text-[#141d19] hover:bg-[#e0ebe4]'
                    }`}
                    onClick={() => setStockFilter('outstock')}
                  >
                    আউট অব স্টক
                  </button>
                </div>
              </div>

              {/* Products Data Table */}
              <div className="bg-white rounded-xl shadow-sm border border-[#e0ebe4] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[#ecf6ef] text-[#3e4947] text-[11px] uppercase tracking-wider border-b border-[#e0ebe4]">
                        <th className="py-3 px-4">পণ্যের বিবরণ ও ছবি</th>
                        <th className="py-3 px-4">ক্যাটাগরি</th>
                        <th className="py-3 px-4">মূল্য (৳)</th>
                        <th className="py-3 px-4">স্টক স্ট্যাটাস</th>
                        <th className="py-3 px-4">WhatsApp ইনকোয়ারি</th>
                        <th className="py-3 px-4">স্টোর স্ট্যাটাস</th>
                        <th className="py-3 px-4 text-right">পদক্ষেপ (Action)</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs divide-y divide-[#e0ebe4]">
                      {filteredProducts.map((p) => (
                        <tr
                          key={p.id}
                          className="hover:bg-[#f2fcf5] transition-colors"
                        >
                          {/* Image & Title */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                className="w-12 h-12 rounded-lg object-cover bg-[#ecf6ef] shrink-0 border border-[#e0ebe4]"
                                src={p.imageUrl}
                                alt={p.title}
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    'https://lh3.googleusercontent.com/aida-public/AB6AXuCLR3NeYuHFYG3PqdowX55mfKdIc_OG06VP6F-X12pujouMYagv_tmp9bVDPwgejF4Y-c6EnOLse55GLGLO2gtGXhhjMNo8DdbaiK-aTy_JGJEkPj3apO8zofZoT3jhG1X74lAuOkR9kRUOQZprS2R9bDdkNKi4HtZ2GN46vPXLOPluI0rQ-FgRsgzCZ21o1zDLVW0Vf0IAgPJtgND8xjy87WdPxpTaCuWEKovTbWUx7FSMoeVYRZex';
                                }}
                              />
                              <div className="min-w-0 max-w-xs">
                                <span className="font-bold text-[#141d19] block truncate">
                                  {p.title}
                                </span>
                                <span className="text-[11px] text-[#6e7977]">
                                  SKU: {p.sku}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-4">
                            <span className="text-[11px] bg-[#ecf6ef] text-[#3e4947] px-2.5 py-1 rounded-md font-semibold border border-[#e0ebe4]">
                              {p.categoryLabel}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="py-3 px-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-[#005c55]">
                                {formatPrice(p.price)}
                              </span>
                              <span className="text-[11px] text-[#6e7977] line-through">
                                {formatPrice(p.regularPrice)}
                              </span>
                            </div>
                          </td>

                          {/* Stock Status */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  p.stockStatus === 'instock'
                                    ? 'bg-[#006d2f]'
                                    : p.stockStatus === 'lowstock'
                                    ? 'bg-[#734700]'
                                    : 'bg-[#ba1a1a]'
                                }`}
                              ></span>
                              <span
                                className={`font-bold text-[11px] ${
                                  p.stockStatus === 'instock'
                                    ? 'text-[#006d2f]'
                                    : p.stockStatus === 'lowstock'
                                    ? 'text-[#734700]'
                                    : 'text-[#ba1a1a]'
                                }`}
                              >
                                {p.stockStatus === 'instock' &&
                                  `ইন স্টক (${toBengaliNumber(p.stockCount)} টি)`}
                                {p.stockStatus === 'lowstock' &&
                                  `সীমিত স্টক (${toBengaliNumber(p.stockCount)} টি বাকি)`}
                                {p.stockStatus === 'outstock' && 'স্টক শেষ (০ টি)'}
                              </span>
                            </div>
                          </td>

                          {/* Inquiries */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1 font-semibold text-[#141d19]">
                              <span className="material-symbols-outlined text-base text-[#25D366]">
                                chat
                              </span>
                              <span>{toBengaliNumber(p.whatsappOrdersCount)} টি অর্ডার</span>
                            </div>
                          </td>

                          {/* Store Live Toggle */}
                          <td className="py-3 px-4">
                            <button
                              onClick={() => {
                                onToggleProductLive(p.id);
                                showToast(
                                  p.isLive
                                    ? 'পণ্যটি স্টোরফ্রন্টে সাময়িকভাবে নিষ্ক্রিয় করা হয়েছে'
                                    : 'পণ্যটি স্টোরফ্রন্টে সক্রিয় (Live) করা হয়েছে'
                                );
                              }}
                              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                                p.isLive ? 'bg-[#006d2f]' : 'bg-[#bdc9c6]'
                              }`}
                              role="switch"
                              aria-checked={p.isLive}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out mt-0.5 ${
                                  p.isLive ? 'translate-x-5' : 'translate-x-0.5'
                                }`}
                              />
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                className="p-1.5 rounded-lg text-[#3e4947] hover:text-[#005c55] hover:bg-[#ecf6ef] transition-colors cursor-pointer"
                                onClick={() => handleEdit(p)}
                                title="সম্পাদনা করুন"
                              >
                                <span className="material-symbols-outlined text-base">edit</span>
                              </button>
                              <button
                                className="p-1.5 rounded-lg text-[#3e4947] hover:text-[#005c55] hover:bg-[#ecf6ef] transition-colors cursor-pointer"
                                onClick={onNavigateToStore}
                                title="স্টোরে প্রিভিউ"
                              >
                                <span className="material-symbols-outlined text-base">visibility</span>
                              </button>
                              <button
                                className="p-1.5 rounded-lg text-[#ba1a1a] hover:bg-[#ffdad6]/50 transition-colors cursor-pointer"
                                onClick={() => setDeleteProductCandidate(p)}
                                title="মুছে ফেলুন"
                              >
                                <span className="material-symbols-outlined text-base">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer */}
                <div className="px-4 py-3 bg-[#ecf6ef] flex flex-col sm:flex-row items-center justify-between text-[#3e4947] text-xs gap-2 border-t border-[#e0ebe4]">
                  <span>
                    মোট {toBengaliNumber(filteredProducts.length)}টি পণ্য প্রদর্শিত হচ্ছে
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button className="px-2.5 py-1 rounded bg-[#dbe5de] text-[#141d19] text-[11px] opacity-60 cursor-not-allowed">
                      পূর্ববর্তী
                    </button>
                    <button className="px-2.5 py-1 rounded bg-[#005c55] text-white text-[11px] font-bold">
                      ১
                    </button>
                    <button className="px-2.5 py-1 rounded bg-[#dbe5de] text-[#141d19] text-[11px] opacity-60 cursor-not-allowed">
                      পরবর্তী
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WHATSAPP ORDER INQUIRIES & TRACKING */}
          {activeTab === 'orders' && (
            <div className="flex flex-col gap-4">
              {/* Status KPI summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e0ebe4] flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] text-[#3e4947] uppercase font-bold">
                      নতুন ইনকামিং লিডস
                    </span>
                    <span className="text-xl font-bold text-[#005c55]">
                      {toBengaliNumber(orders.filter((o) => o.status === 'new').length)} টি আনরিড
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-3xl text-[#25D366]">
                    mark_chat_unread
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e0ebe4] flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] text-[#3e4947] uppercase font-bold">
                      ঠিকানা নিশ্চিত হয়েছে
                    </span>
                    <span className="text-xl font-bold text-[#006d2f]">
                      {toBengaliNumber(orders.filter((o) => o.status === 'confirmed').length)} টি প্রস্তুত
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-3xl text-[#006d2f]">
                    assignment_turned_in
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e0ebe4] flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] text-[#3e4947] uppercase font-bold">
                      কুরিয়ারে হস্তান্তর
                    </span>
                    <span className="text-xl font-bold text-[#734700]">
                      {toBengaliNumber(orders.filter((o) => o.status === 'dispatched' || o.status === 'delivered').length)} টি রানিং
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-3xl text-[#734700]">
                    local_shipping
                  </span>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-xl shadow-sm border border-[#e0ebe4] overflow-hidden">
                <div className="p-4 flex flex-wrap items-center justify-between gap-2 bg-[#ecf6ef] border-b border-[#e0ebe4]">
                  <span className="text-xs md:text-sm font-bold text-[#141d19] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#005c55]">chat</span>
                    সরাসরি WhatsApp কার্ট ও ইনকোয়ারি লগ
                  </span>
                  <button
                    className="px-3 py-1.5 bg-white hover:bg-[#e0ebe4] text-[#141d19] rounded-lg text-xs flex items-center gap-1 font-semibold border border-[#e0ebe4] cursor-pointer"
                    onClick={() => showToast('সর্বশেষ WhatsApp ডাটা সিঙ্ক সম্পন্ন হয়েছে')}
                  >
                    <span className="material-symbols-outlined text-base">sync</span>
                    <span>রিফ্রেশ করুন</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[#ecf6ef] text-[#3e4947] text-[11px] uppercase tracking-wider border-b border-[#e0ebe4]">
                        <th className="py-3 px-4">ইনকোয়ারি আইডি ও সময়</th>
                        <th className="py-3 px-4">গ্রাহকের নাম ও ফোন</th>
                        <th className="py-3 px-4">আকাঙ্ক্ষিত পণ্য ও বিবরণ</th>
                        <th className="py-3 px-4">মোট মূল্য</th>
                        <th className="py-3 px-4">অর্ডার অবস্থা</th>
                        <th className="py-3 px-4 text-right">সরাসরি WhatsApp চ্যাট</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs divide-y divide-[#e0ebe4]">
                      {filteredOrders.map((ord) => {
                        const directChatUrl = getWhatsAppUrl(
                          ord.customerPhone,
                          `আসসালামু আলাইকুম ${ord.customerName}। আপনার সহজ শপ অর্ডার #${ord.id} (${ord.productName}) প্রসঙ্গে মেসেজ দিচ্ছি:`
                        );

                        return (
                          <tr key={ord.id} className="hover:bg-[#f2fcf5] transition-colors">
                            <td className="py-3 px-4">
                              <span className="text-xs font-bold text-[#141d19] block">
                                #{ord.id}
                              </span>
                              <span className="text-[11px] text-[#6e7977]">{ord.time}</span>
                            </td>

                            <td className="py-3 px-4">
                              <div className="min-w-0">
                                <span className="text-xs font-bold text-[#141d19] block">
                                  {ord.customerName}
                                </span>
                                <span className="text-[11px] text-[#3e4947]">
                                  {ord.customerPhone} • {ord.customerLocation}
                                </span>
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#005c55] shrink-0"></span>
                                <span className="text-xs text-[#141d19] truncate max-w-xs">
                                  {ord.productName} ({toBengaliNumber(ord.quantity)} টি)
                                </span>
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              <span className="text-xs font-bold text-[#005c55]">
                                {formatPrice(ord.totalPrice)}
                              </span>
                            </td>

                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                  ord.status === 'new'
                                    ? 'bg-[#fef3c7] text-[#92400e]'
                                    : ord.status === 'confirmed'
                                    ? 'bg-[#dcfce7] text-[#15803d]'
                                    : ord.status === 'dispatched'
                                    ? 'bg-[#ccfbf1] text-[#115e59]'
                                    : 'bg-[#ecf6ef] text-[#006d2f]'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    ord.status === 'new'
                                      ? 'bg-[#d97706]'
                                      : ord.status === 'confirmed'
                                      ? 'bg-[#16a34a]'
                                      : 'bg-[#0d9488]'
                                  }`}
                                ></span>
                                {ord.statusLabel}
                              </span>
                            </td>

                            <td className="py-3 px-4 text-right">
                              <a
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-full text-xs font-bold shadow-xs transition-transform active:scale-95 cursor-pointer"
                                href={directChatUrl}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <span className="material-symbols-outlined text-base">chat</span>
                                <span>WhatsApp-এ চ্যাট করুন</span>
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MERCHANT SETTINGS & TEMPLATES */}
          {activeTab === 'settings' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* WhatsApp Gateway Settings */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-[#e0ebe4] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#5dfd8a]/40 text-[#006d2f] flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl">contact_phone</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#141d19]">
                        অর্ডার গ্রহণের WhatsApp কনফিগারেশন
                      </h3>
                      <p className="text-xs text-[#3e4947]">
                        গ্রাহকরা স্টোরফ্রন্ট থেকে এক ক্লিকে সরাসরি যে নম্বরে মেসেজ পাঠাবে
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="block text-xs font-bold text-[#141d19] mb-1">
                        অফিসিয়াল ব্যবসায়িক নম্বর
                      </label>
                      <div className="flex items-center bg-[#ecf6ef] rounded-lg px-4 py-2 border border-[#e0ebe4]">
                        <span className="text-xs font-bold text-[#3e4947] pr-2.5 border-r border-[#bdc9c6] mr-2.5">
                          +880 (বাংলাদেশ)
                        </span>
                        <input
                          className="bg-transparent border-none outline-none text-xs font-bold text-[#141d19] w-full"
                          type="text"
                          value={waNumberInput}
                          onChange={(e) => setWaNumberInput(e.target.value)}
                        />
                      </div>
                      <span className="text-[11px] text-[#6e7977] block mt-1">
                        নম্বরটি সচল WhatsApp অ্যাকাউন্টের সাথে যুক্ত হতে হবে।
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#141d19] mb-1">
                        স্বয়ংক্রিয় প্রি-ফিল্ড মেসেজ টেমপ্লেট
                      </label>
                      <textarea
                        className="w-full bg-[#ecf6ef] rounded-lg p-3 text-xs text-[#141d19] outline-none focus:ring-2 focus:ring-[#005c55] border border-[#e0ebe4]"
                        rows={4}
                        value={templateInput}
                        onChange={(e) => setTemplateInput(e.target.value)}
                      />
                      <span className="text-[11px] text-[#3e4947] block mt-1 font-semibold">
                        {'{পণ্যের নাম}'} এবং {'{মূল্য}'} স্বয়ংক্রিয়ভাবে পরিবর্তিত হবে।
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    className="px-5 py-2.5 bg-[#005c55] text-white hover:bg-[#0f766e] rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    onClick={handleSaveSettings}
                  >
                    <span className="material-symbols-outlined text-base">save</span>
                    <span>সেটিংস সংরক্ষণ করুন</span>
                  </button>
                </div>
              </div>

              {/* Delivery & Policy Settings */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-[#e0ebe4] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#ffddb8] text-[#734700] flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl">storefront</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#141d19]">
                        স্টোরফ্রন্ট পলিসি ও ডেলিভারি চার্জ
                      </h3>
                      <p className="text-xs text-[#3e4947]">
                        চেকআউট কার্টে প্রদর্শিত ডেলিভারি চার্জ নির্ধারণ করুন
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#141d19] mb-1">
                          ঢাকা সিটির ভিতরে চার্জ (৳)
                        </label>
                        <div className="bg-[#ecf6ef] rounded-lg px-3 py-2 border border-[#e0ebe4]">
                          <input
                            className="bg-transparent border-none outline-none text-xs font-bold text-[#141d19] w-full"
                            type="number"
                            value={dhakaChargeInput}
                            onChange={(e) => setDhakaChargeInput(Number(e.target.value))}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#141d19] mb-1">
                          ঢাকার বাহিরে সারা বাংলাদেশ (৳)
                        </label>
                        <div className="bg-[#ecf6ef] rounded-lg px-3 py-2 border border-[#e0ebe4]">
                          <input
                            className="bg-transparent border-none outline-none text-xs font-bold text-[#141d19] w-full"
                            type="number"
                            value={outsideChargeInput}
                            onChange={(e) => setOutsideChargeInput(Number(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#ecf6ef] p-4 rounded-xl space-y-3 border border-[#e0ebe4]">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-[#141d19] block">
                            ক্যাশ অন ডেলিভারি (COD)
                          </span>
                          <span className="text-[11px] text-[#3e4947]">
                            পণ্য হাতে পেয়ে মূল্য পরিশোধ সুবিধা
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={codEnabled}
                          onChange={(e) => setCodEnabled(e.target.checked)}
                          className="w-4 h-4 accent-[#005c55] cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#e0ebe4]">
                        <div>
                          <span className="text-xs font-bold text-[#141d19] block">
                            জরুরি নোটিশ বার প্রদর্শন
                          </span>
                          <span className="text-[11px] text-[#3e4947]">
                            "সারাদেশে ক্যাশ অন ডেলিভারি এবং দ্রুত WhatsApp এ অর্ডার নিশ্চিতকরণ!"
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={urgentNoticeEnabled}
                          onChange={(e) => setUrgentNoticeEnabled(e.target.checked)}
                          className="w-4 h-4 accent-[#005c55] cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    className="px-5 py-2.5 bg-[#005c55] text-white hover:bg-[#0f766e] rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    onClick={() => {
                      handleSaveSettings();
                      showToast('স্টোর পলিসি ও ডেলিভারি চার্জ সফলভাবে আপডেট হয়েছে');
                    }}
                  >
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    <span>পলিসি আপডেট করুন</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOMERS LIST */}
          {activeTab === 'customers' && (
            <div className="bg-white rounded-xl shadow-sm border border-[#e0ebe4] overflow-hidden">
              <div className="p-4 bg-[#ecf6ef] border-b border-[#e0ebe4] flex items-center justify-between">
                <span className="text-xs md:text-sm font-bold text-[#141d19] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#005c55]">group</span>
                  গ্রাহক ডাটাবেজ ও ক্রয়ের ইতিহাস
                </span>
                <span className="text-xs text-[#3e4947] font-semibold">
                  মোট {toBengaliNumber(customers.length)} জন নিবন্ধিত গ্রাহক
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#ecf6ef] text-[#3e4947] text-[11px] uppercase tracking-wider border-b border-[#e0ebe4]">
                      <th className="py-3 px-4">গ্রাহকের নাম</th>
                      <th className="py-3 px-4">মোবাইল নম্বর</th>
                      <th className="py-3 px-4">ঠিকানা</th>
                      <th className="py-3 px-4">মোট অর্ডার</th>
                      <th className="py-3 px-4">মোট কেনাকাটা</th>
                      <th className="py-3 px-4">সর্বশেষ সক্রিয়</th>
                      <th className="py-3 px-4 text-right">পদক্ষেপ</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-[#e0ebe4]">
                    {customers.map((c) => (
                      <tr key={c.id} className="hover:bg-[#f2fcf5] transition-colors">
                        <td className="py-3 px-4 font-bold text-[#141d19]">{c.name}</td>
                        <td className="py-3 px-4 text-[#3e4947]">{c.phone}</td>
                        <td className="py-3 px-4 text-[#3e4947]">{c.location}</td>
                        <td className="py-3 px-4">
                          <span className="bg-[#ecf6ef] px-2.5 py-0.5 rounded-full font-bold text-[#005c55]">
                            {toBengaliNumber(c.totalOrders)} টি
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-[#005c55]">
                          {formatPrice(c.totalSpent)}
                        </td>
                        <td className="py-3 px-4 text-[#6e7977]">{c.lastActive}</td>
                        <td className="py-3 px-4 text-right">
                          <a
                            href={getWhatsAppUrl(c.phone, `আসসালামু আলাইকুম ${c.name}! সহজ শপ থেকে আপনাকে ধন্যবাদ জানাচ্ছি।`)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1 bg-[#25D366] text-white rounded-full text-[11px] font-bold hover:bg-[#1ebe5d] cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-sm">chat</span>
                            <span>মেসেজ দিন</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 3. Add / Edit Product Modal */}
      <AddEditProductModal
        product={editingProduct}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveProductSubmit}
      />

      {/* 4. Delete Confirmation Modal */}
      <DeleteConfirmModal
        productTitle={deleteProductCandidate?.title || ''}
        isOpen={!!deleteProductCandidate}
        onClose={() => setDeleteProductCandidate(null)}
        onConfirm={handleDeleteConfirmed}
      />

      {/* 5. Quick WhatsApp Number Modal */}
      <WhatsAppConfigModal
        currentNumber={settings.whatsappNumber}
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        onSave={(newNumber) => {
          onUpdateSettings({ whatsappNumber: newNumber });
          setWaNumberInput(newNumber.replace('+880 ', ''));
          showToast(`অর্ডার WhatsApp নম্বর সফলভাবে পরিবর্তিত: ${newNumber}`);
        }}
      />
    </div>
  );
};
