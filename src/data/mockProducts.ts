/**
 * Mock Data danh sách 50 sản phẩm mẫu cho ShopAI (Chương 4 - Sprint 4)
 */

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  rating?: number;
  soldCount?: number;
  description?: string;
}

const SAMPLE_NAMES = [
  'Tai nghe không dây Bluetooth Pro chống ồn ANC',
  'Bàn phím cơ không dây RGB Hot-swap Gasket Mount',
  'Chuột Gaming không dây siêu nhẹ 4K Hz Polling Rate',
  'Đồng hồ thông minh Smartwatch AMOLED Pin 14 ngày',
  'Loa Bluetooth di động Bass cực mạnh chống nước IPX7',
  'Màn hình Gaming 27 inch 2K 180Hz Fast IPS 1ms',
  'Củ sạc nhanh GaN 65W 3 cổng Type-C & USB-A',
  'Pin sạc dự phòng 20000mAh sạc nhanh 22.5W',
  'Camera an ninh gia đình xoay 360 độ AI phát hiện người',
  'Bộ phát WiFi 6 Mesh chuẩn AX3000 phủ sóng xuyên tường',
  'Đèn bàn LED chống cận thông minh cảm ứng đa mức sáng',
  'Ổ cắm thông minh hẹn giờ bật tắt điều khiển qua app',
];

const SAMPLE_CATEGORIES = ['Âm thanh', 'Gaming', 'Phụ kiện', 'Gia dụng', 'Mạng'];

export const MOCK_PRODUCTS: Product[] = Array.from({ length: 50 }).map((_, index) => {
  const nameBase = SAMPLE_NAMES[index % SAMPLE_NAMES.length];
  const category = SAMPLE_CATEGORIES[index % SAMPLE_CATEGORIES.length];
  const price = 250000 + (index * 85000) % 2500000;
  const rating = Number((4.5 + ((index % 5) * 0.1)).toFixed(1));
  const soldCount = 50 + ((index * 37) % 950);

  return {
    id: `prod_${index + 1}`,
    name: `${nameBase} Gen ${(index % 3) + 1}`,
    price,
    image: `https://picsum.photos/id/${(index % 30) + 10}/400/400`,
    category,
    rating,
    soldCount,
    description: `Sản phẩm chính hãng ShopAI cao cấp với công nghệ hiện đại. Bảo hành 12 tháng 1 đổi 1. Hỗ trợ giao hàng hoả tốc trong ngày. Mã sản phẩm: SP-${1000 + index}.`,
  };
});

export default MOCK_PRODUCTS;
