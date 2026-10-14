export type CategoryKey = 'all' | 'gadgets' | 'fashion' | 'home' | 'accessories' | 'wellness';

export interface Product {
  id: string;
  title: string;
  sku: string;
  category: CategoryKey;
  categoryLabel: string;
  price: number;
  regularPrice: number;
  discount: string;
  stockStatus: 'instock' | 'lowstock' | 'outstock';
  stockCount: number;
  rating: number;
  reviewsCount: number;
  description: string;
  fullDetails: string;
  imageUrl: string;
  whatsappOrdersCount: number;
  isLive: boolean;
}

export interface OrderInquiry {
  id: string;
  time: string;
  customerName: string;
  customerPhone: string;
  customerLocation: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  status: 'new' | 'confirmed' | 'dispatched' | 'delivered';
  statusLabel: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  location: string;
  totalOrders: number;
  totalSpent: number;
  lastActive: string;
}

export interface StoreSettings {
  whatsappNumber: string;
  hotline: string;
  storeName: string;
  branchName: string;
  deliveryDhaka: number;
  deliveryOutside: number;
  template: string;
  codEnabled: boolean;
  urgentNoticeEnabled: boolean;
  urgentNoticeText: string;
}
