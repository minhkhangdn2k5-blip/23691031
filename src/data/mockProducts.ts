/**
 * Mock Data danh sách 50 sản phẩm công nghệ thực tế cho ShopAI (Sprint 4)
 * Hình ảnh sản phẩm công nghệ thực tế (tai nghe, sạc GaN, chuột, bàn phím cơ, iPhone, Galaxy...)
 */

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  rating?: number;
  description?: string;
}

// 20 sản phẩm công nghệ cao cấp với ảnh unspash thực tế
const TECH_CATALOG: Omit<Product, 'id'>[] = [
  {
    name: 'GaN Sạc nhanh 65W GaN',
    price: 850000,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&q=80',
    category: 'Phụ kiện',
    description: 'Củ sạc nhanh công nghệ GaN 65W nhỏ gọn, hỗ trợ 3 cổng sạc đồng thời cho laptop và điện thoại.',
  },
  {
    name: 'Tai nghe chụp tai Wireless',
    price: 2900000,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    category: 'Âm thanh',
    description: 'Tai nghe không dây chống ồn chủ động ANC, âm trầm mạnh mẽ, thời lượng pin 40 giờ liên tục.',
  },
  {
    name: 'MX Master Chuột không dây',
    price: 1100000,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80',
    category: 'Gaming',
    description: 'Chuột công thái học cao cấp với con lăn siêu tốc MagSpeed, kết nối đa thiết bị qua Bluetooth và USB.',
  },
  {
    name: 'iPhone 15 Pro Max 256GB',
    price: 29990000,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80',
    category: 'Điện thoại',
    description: 'Khung viền Titan siêu nhẹ, chip A17 Pro mạnh mẽ, camera zoom quang học 5x sắc nét đỉnh cao.',
  },
  {
    name: 'Galaxy S21 Điện thoại Galaxy',
    price: 15990000,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&q=80',
    category: 'Điện thoại',
    description: 'Màn hình Dynamic AMOLED 2X 120Hz mượt mà, cụm camera AI 64MP ghi lại từng khoảnh khắc sống động.',
  },
  {
    name: 'Mechanical Bàn phím cơ K8',
    price: 2100000,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80',
    category: 'Gaming',
    description: 'Bàn phím cơ không dây switch Gateron Pro, keycap PBT cao cấp, hỗ trợ Hot-swap linh hoạt.',
  },
  {
    name: 'Apple Watch Series 9 GPS',
    price: 9500000,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
    category: 'Phụ kiện',
    description: 'Đồng hồ thông minh theo dõi sức khỏe toàn diện, màn hình Retina sáng gấp đôi, chạm hai lần cử chỉ tiện lợi.',
  },
  {
    name: 'Màn hình Gaming 27 inch 2K 180Hz',
    price: 5490000,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80',
    category: 'Gaming',
    description: 'Tấm nền Fast IPS 1ms, độ phủ màu 99% sRGB, tương thích G-Sync và FreeSync loại bỏ xé hình.',
  },
  {
    name: 'Loa Bluetooth Marshall Acton III',
    price: 6290000,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&q=80',
    category: 'Âm thanh',
    description: 'Âm thanh stereo vang dội, thiết kế cổ điển sang trọng đậm chất rock & roll, Bluetooth 5.2.',
  },
  {
    name: 'Pin sạc dự phòng Anker 20000mAh',
    price: 950000,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&q=80',
    category: 'Phụ kiện',
    description: 'Dung lượng lớn 20000mAh sạc nhanh 22.5W Power Delivery, bảo vệ an toàn đa lớp cho thiết bị.',
  },
  {
    name: 'MacBook Pro 14 inch M3 Pro',
    price: 39990000,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80',
    category: 'Máy tính',
    description: 'Hiệu năng đỉnh cao với chip M3 Pro, màn hình Liquid Retina XDR 120Hz ProMotion chân thực.',
  },
  {
    name: 'Sony WH-1000XM5 Chống ồn cao cấp',
    price: 7490000,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&q=80',
    category: 'Âm thanh',
    description: 'Bộ xử lý chống ồn V1 độc quyền, đàm thoại trong trẻo với 4 micro định chùm sóng beamforming.',
  },
  {
    name: 'Chuột Gaming Logitech G Pro Wireless',
    price: 2490000,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80',
    category: 'Gaming',
    description: 'Cảm biến HERO 25K chính xác từng micromet, trọng lượng siêu nhẹ 80g thiết kế cho tuyển thủ Esports.',
  },
  {
    name: 'Bàn phím cơ Keychron Q1 Pro',
    price: 3890000,
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&q=80',
    category: 'Gaming',
    description: 'Khung nhôm CNC nguyên khối, kết nối không dây Bluetooth 5.1 và có dây Type-C, núm xoay đa năng.',
  },
  {
    name: 'Camera an ninh ngoài trời 4K Solar',
    price: 1850000,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80',
    category: 'Gia dụng',
    description: 'Pin năng lượng mặt trời hoạt động liên tục không cần cắm điện, AI phát hiện chuyển động con người.',
  },
  {
    name: 'Bộ phát WiFi 6 Mesh AX3000',
    price: 1450000,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80',
    category: 'Mạng',
    description: 'Tốc độ WiFi 6 lên đến 3000Mbps, phủ sóng toàn diện loại bỏ hoàn toàn vùng chết sóng trong nhà.',
  },
  {
    name: 'Micro thu âm Podcast USB Condenser',
    price: 2200000,
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500&q=80',
    category: 'Âm thanh',
    description: 'Cắm là chạy qua USB, màng thu cardioid loại bỏ tạp âm phòng, có nút tắt tiếng cảm ứng nhanh.',
  },
  {
    name: 'Kính thực tế ảo VR Meta Quest 3',
    price: 12500000,
    image: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=500&q=80',
    category: 'Gaming',
    description: 'Công nghệ thực tế hỗn hợp (Mixed Reality) đột phá với màn hình 4K Infinite Display sống động.',
  },
  {
    name: 'Ổ cứng di động SSD 1TB NVMe 1050MB/s',
    price: 2450000,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&q=80',
    category: 'Phụ kiện',
    description: 'Tốc độ đọc ghi lên tới 1050MB/s qua cổng USB 3.2 Gen 2, vỏ nhôm tản nhiệt chống sốc đạt chuẩn IP55.',
  },
  {
    name: 'Webcam 4K Ultra HD tích hợp Micro',
    price: 1890000,
    image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=500&q=80',
    category: 'Phụ kiện',
    description: 'Độ phân giải 4K 30fps sắc nét, tự động lấy nét khuôn mặt và cân bằng ánh sáng thông minh trong phòng tối.',
  },
];

// Tạo danh sách 50 sản phẩm phong phú
export const MOCK_PRODUCTS: Product[] = Array.from({ length: 50 }).map((_, index) => {
  const item = TECH_CATALOG[index % TECH_CATALOG.length];
  const isDuplicate = index >= TECH_CATALOG.length;
  const version = Math.floor(index / TECH_CATALOG.length) + 1;

  return {
    id: `prod_${index + 1}`,
    name: isDuplicate ? `${item.name} v${version}` : item.name,
    price: item.price + (index % 5) * 20000,
    image: item.image,
    category: item.category,
    description: item.description,
  };
});

export default MOCK_PRODUCTS;
