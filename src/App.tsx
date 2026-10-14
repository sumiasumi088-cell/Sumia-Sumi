import React, { useState } from 'react';
import { initialCustomers, initialOrders, initialProducts, initialStoreSettings } from './data/mockData';
import { Customer, OrderInquiry, Product, StoreSettings } from './types';
import { Storefront } from './components/Storefront/Storefront';
import { MerchantDashboard } from './components/Admin/MerchantDashboard';
import { AdminLogin } from './components/Admin/AdminLogin';

interface ToastState {
  id: number;
  title: string;
  desc?: string;
}

export default function App() {
  const [currentView, setCurrentView] = useState<'storefront' | 'admin' | 'admin-login'>('storefront');

  // Admin authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('shohoj_admin_auth');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const [adminUser, setAdminUser] = useState({
    name: 'রাহিম আহমেদ',
    email: 'admin@shohojshop.com',
    role: 'সুপার অ্যাডমিন',
  });

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<OrderInquiry[]>(initialOrders);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [settings, setSettings] = useState<StoreSettings>(initialStoreSettings);
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = (title: string, desc?: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, desc }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Login handler
  const handleAdminLogin = (email: string, name: string) => {
    setIsAuthenticated(true);
    try {
      localStorage.setItem('shohoj_admin_auth', 'true');
    } catch {}
    setAdminUser({
      name: name || 'রাহিম আহমেদ',
      email: email || 'admin@shohojshop.com',
      role: 'সুপার অ্যাডমিন',
    });
    setCurrentView('admin');
  };

  // Logout handler
  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.setItem('shohoj_admin_auth', 'false');
    } catch {}
    showToast('সফলভাবে লগআউট সম্পন্ন হয়েছে', 'মার্চেন্ট সেশন সমাপ্ত করা হয়েছে');
    setCurrentView('admin-login');
  };

  // Navigation to Admin
  const handleNavigateToAdmin = () => {
    if (isAuthenticated) {
      setCurrentView('admin');
    } else {
      setCurrentView('admin-login');
    }
  };

  // Add / Edit Product
  const handleSaveProduct = (productData: Partial<Product>, editId?: string) => {
    if (editId) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editId ? { ...p, ...productData } : p))
      );
    } else {
      const newProduct: Product = {
        id: 'p_' + Date.now(),
        title: productData.title || 'নতুন পণ্য',
        sku: 'SHO-NEW-' + Math.floor(Math.random() * 90 + 10),
        category: productData.category || 'gadgets',
        categoryLabel: productData.categoryLabel || 'গ্যাজেট ও অডিও',
        price: productData.price || 1200,
        regularPrice: productData.regularPrice || 1600,
        discount: productData.discount || '২৫%',
        stockStatus: productData.stockStatus || 'instock',
        stockCount: productData.stockCount ?? 20,
        rating: 5.0,
        reviewsCount: 1,
        description: productData.description || '১০০% নতুন পণ্য',
        fullDetails: productData.fullDetails || productData.description || '',
        imageUrl:
          productData.imageUrl ||
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAcSCvS2N7bGFquXkYIONhrMTjjtDDB1HJZG8pSk734edN672LytAhkICIRMI8a-9f8CgN00dWzX-LJ8-cxJUXavhFsr356wCdXLEm8tXIfSoE_pdriXw9ETMHMHc4kH0Sg_7LZsBkd12NIVn01P6ktKhVDjV_gnBLWhdf8huW4zpUqCtZzpc-4ErTEHdLhQlsvpRq8A4sQ9g7v857MCib94V29tULQYGwRw3GJXx0wAdvpjH7rDfrE',
        whatsappOrdersCount: 0,
        isLive: true,
      };
      setProducts((prev) => [newProduct, ...prev]);
    }
  };

  // Delete Product
  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Toggle Live status
  const handleToggleProductLive = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, isLive: !p.isLive } : p))
    );
  };

  // Update Settings
  const handleUpdateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Record an order triggered by customer
  const handleRecordCustomerOrder = (product: Product, total: number) => {
    const newOrder: OrderInquiry = {
      id: `WA-${Math.floor(1000 + Math.random() * 9000)}`,
      time: 'এইমাত্র',
      customerName: 'অনলাইন গ্রাহক',
      customerPhone: '+880 1819-203948',
      customerLocation: 'ঢাকা',
      productName: product.title,
      quantity: 1,
      totalPrice: total,
      status: 'new',
      statusLabel: 'নতুন ইনকোয়ারি',
    };
    setOrders((prev) => [newOrder, ...prev]);
    // increment inquiry count on product
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id
          ? { ...p, whatsappOrdersCount: p.whatsappOrdersCount + 1 }
          : p
      )
    );
  };

  return (
    <div className="relative min-h-screen bg-[#f2fcf5] text-[#141d19]">
      {/* View Switcher Fixed Top Banner */}
      <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 bg-[#141d19]/90 backdrop-blur-md text-white px-2 py-1.5 rounded-full shadow-2xl flex items-center gap-1.5 border border-white/20 text-xs">
        <span className="text-[10px] text-[#9cf2e8] px-2 font-bold uppercase tracking-wider hidden sm:inline-block">
          স্ক্রিন পরিবর্তন:
        </span>

        <button
          onClick={() => setCurrentView('storefront')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
            currentView === 'storefront'
              ? 'bg-[#006d2f] text-white shadow-md'
              : 'text-[#bdc9c6] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-sm">storefront</span>
          <span>স্টোরফ্রন্ট (Customer)</span>
        </button>

        <button
          onClick={handleNavigateToAdmin}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
            currentView === 'admin'
              ? 'bg-[#0f766e] text-white shadow-md'
              : currentView === 'admin-login'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-[#bdc9c6] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-sm">
            {isAuthenticated ? 'admin_panel_settings' : 'lock'}
          </span>
          <span>
            {isAuthenticated
              ? 'মার্চেন্ট অ্যাডমিন (Dashboard)'
              : 'অ্যাডমিন লগইন (Login)'}
          </span>
        </button>

        {/* Quick logout button if authenticated */}
        {isAuthenticated && (
          <button
            onClick={handleAdminLogout}
            title="দ্রুত লগআউট"
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ba1a1a]/40 hover:bg-[#ba1a1a] text-white text-[11px] font-bold transition-all cursor-pointer border border-[#ba1a1a]/50"
          >
            <span className="material-symbols-outlined text-xs">logout</span>
            <span className="hidden md:inline">লগআউট</span>
          </button>
        )}
      </div>

      {/* Main View Router */}
      {currentView === 'storefront' && (
        <Storefront
          products={products}
          settings={settings}
          onNavigateToAdmin={handleNavigateToAdmin}
          onRecordOrder={handleRecordCustomerOrder}
          showToast={showToast}
        />
      )}

      {currentView === 'admin-login' && (
        <AdminLogin
          onLogin={handleAdminLogin}
          onBackToStore={() => setCurrentView('storefront')}
          showToast={showToast}
        />
      )}

      {currentView === 'admin' && (
        isAuthenticated ? (
          <MerchantDashboard
            products={products}
            orders={orders}
            customers={customers}
            settings={settings}
            adminUser={adminUser}
            onLogout={handleAdminLogout}
            onUpdateSettings={handleUpdateSettings}
            onSaveProduct={handleSaveProduct}
            onDeleteProduct={handleDeleteProduct}
            onToggleProductLive={handleToggleProductLive}
            onNavigateToStore={() => setCurrentView('storefront')}
            showToast={showToast}
          />
        ) : (
          <AdminLogin
            onLogin={handleAdminLogin}
            onBackToStore={() => setCurrentView('storefront')}
            showToast={showToast}
          />
        )
      )}

      {/* Toast Notification Container */}
      <div className="fixed top-20 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-white text-[#141d19] p-3.5 rounded-xl shadow-xl flex items-center gap-3 border-l-4 border-[#006d2f] animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto border border-[#e0ebe4]"
          >
            <div className="w-8 h-8 rounded-full bg-[#5dfd8a]/40 text-[#006d2f] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-lg">check_circle</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold leading-tight text-[#141d19]">{toast.title}</p>
              {toast.desc && (
                <p className="text-[11px] text-[#3e4947] truncate mt-0.5">{toast.desc}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
