/**
 * Mock Data danh sách sản phẩm mẫu cho ShopAI (Sprint 4)
 * Bao gồm đầy đủ thông tin: Mã ID, Tên sản phẩm, Giá tiền VND và Link ảnh sắc nét
 */

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  rating?: number;
  soldCount?: number;
}

const SAMPLE_NAMES = [
  'Tai nghe không dây Bluetooth Pro chống ồn',
  'Bàn phím cơ không dây RGB Hot-swap',
  'Chuột Gaming không dây siêu nhẹ 4K Hz',
  'Đồng hồ thông minh Smartwatch Amoled Pin 14 ngày',
  'Loa Bluetooth di động Bass cực mạnh chống nước IPX7',
  'Màn hình Gaming 27 inch 2K 180Hz Fast IPS',
  'Củ sạc nhanh GaN 65W 3 cổng Type-C & USB-A',
  'Pin sạc dự phòng 20000mAh sạc nhanh 22.5W',
  'Camera an ninh gia đình xoay 360 độ ban đêm có màu',
  'Bộ phát WiFi 6 Mesh chuẩn AX3000 phủ sóng toàn nhà',
  'Đèn bàn LED chống cận thông minh bảo vệ thị lực',
  'Ổ cắm thông minh hẹn giờ bật tắt điều khiển từ xa',
];

const SAMPLE_CATEGORIES = ['Âm thanh', 'Gaming', 'Phụ kiện', 'Gia dụng thông minh', 'Mạng'];

// Tạo mảng 50 sản phẩm phong phú
export const MOCK_PRODUCTS: Product[] = Array.from({ length: 50 }).map((_, index) => {
  const nameBase = SAMPLE_NAMES[index % SAMPLE_NAMES.length];
  const category = SAMPLE_CATEGORIES[index % SAMPLE_CATEGORIES.length];
  const price = 250000 + (index * 85000) % 2500000;
  const rating = Number((4.5 + ((index % 5) * 0.1)).toFixed(1));
  const soldCount = 50 + ((index * 37) % 950);

  return {
    id: `prod_${index + 1}`,
    name: `${nameBase} Gen ${(index % 3) + 1}`,
    price: price,
    image: `https://picsum.photos/id/${(index % 30) + 10}/400/400`,
    category,
    rating,
    soldCount,
  };
});
