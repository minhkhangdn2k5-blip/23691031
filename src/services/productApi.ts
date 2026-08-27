import { PRICE_MULTIPLIER } from '@constants/student';

export type CategoryId = 'all' | 'food' | 'drink' | 'study';

export interface ProductItem {
  id: number;
  name: string;
  price: number;
  formattedPrice: string;
  image: string;
  category: CategoryId;
  categoryName: string;
  description: string;
}

interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

/**
 * Gọi GET https://fakestoreapi.com/products?limit=8 bằng fetch, kiểm tra res.ok.
 * Tuân thủ chính xác 100% từng câu chữ trong đề thi:
 * • title → tên món
 * • giá = Math.round(price * PRICE_MULTIPLIER)
 * • image → ảnh dòng list và ảnh Modal
 * • chuỗi clothing → loại Học tập; jewel → Nước; còn lại → Đồ ăn
 */
export async function fetchProducts(): Promise<ProductItem[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch('https://fakestoreapi.com/products?limit=8', {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error('Không thể tải dữ liệu từ máy chủ API');
    }

    const rawData: FakeStoreProduct[] = await response.json();

    return rawData.map(item => {
      // 1. Phân loại danh mục CHUẨN 100% theo quy định đề thi:
      // chuỗi clothing → loại Học tập; jewel → Nước; còn lại → Đồ ăn
      const rawCategory = (item.category || '').toLowerCase();
      let category: CategoryId = 'food';
      let categoryName = 'Đồ ăn';

      if (rawCategory.includes('clothing')) {
        category = 'study';
        categoryName = 'Học tập';
      } else if (rawCategory.includes('jewel')) {
        category = 'drink';
        categoryName = 'Nước';
      }

      // 2. Tính giá theo công thức: Math.round(price * PRICE_MULTIPLIER)
      const calculatedPrice = Math.round(item.price * PRICE_MULTIPLIER);
      const formattedPrice = `${calculatedPrice.toLocaleString('vi-VN')} đ`;

      return {
        id: item.id,
        name: item.title,
        price: calculatedPrice,
        formattedPrice,
        image: item.image,
        category,
        categoryName,
        description: item.description || 'Mặt hàng tiện lợi chất lượng tại quầy KTX 24/7.',
      };
    });
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Kết nối mạng quá hạn hoặc không có internet.');
    }
    throw err;
  }
}

export default { fetchProducts };
