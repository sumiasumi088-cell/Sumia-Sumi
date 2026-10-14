export const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliNumber(n: number | string): string {
  if (n === undefined || n === null) return '০';
  return n.toString().replace(/\d/g, (d) => bnDigits[parseInt(d, 10)]);
}

export function formatPrice(amount: number): string {
  const formatted = amount.toLocaleString('en-US');
  return `৳ ${toBengaliNumber(formatted)}`;
}

export function cleanPhoneNumber(phone: string): string {
  // Remove non-digits
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '880' + cleaned.slice(1);
  } else if (!cleaned.startsWith('880')) {
    cleaned = '880' + cleaned;
  }
  return cleaned;
}

export function createWhatsAppOrderMessage(params: {
  productTitle: string;
  price: number;
  deliveryArea: string;
  deliveryCharge: number;
  template?: string;
  pageUrl?: string;
}): string {
  const { productTitle, price, deliveryArea, deliveryCharge } = params;
  const totalPrice = price + deliveryCharge;

  return `আসসালামু আলাইকুম। আমি সহজ শপ (Shohoj Shop) থেকে এই পণ্যটি অর্ডার করতে চাই:

📦 পণ্যের নাম: ${productTitle}
💰 মূল্য: ৳ ${toBengaliNumber(price)}
🚚 ডেলিভারি এলাকা: ${deliveryArea} (চার্জ: ৳ ${toBengaliNumber(deliveryCharge)})
💳 সর্বমোট: ৳ ${toBengaliNumber(totalPrice)}

আমার ডেলিভারি ঠিকানা ও ফোন নম্বর নিচে পাঠাচ্ছি। অনুগ্রহ করে অর্ডারটি কনফার্ম করুন।`;
}

export function getWhatsAppUrl(phone: string, text: string): string {
  const cleaned = cleanPhoneNumber(phone);
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(text)}`;
}
