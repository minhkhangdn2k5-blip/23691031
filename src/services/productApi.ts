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
 * Gọi API lấy danh sách 8 sản phẩm từ FakeStore API
 * và ánh xạ (mapping) sang định dạng món của CampusMart
 */
export async function fetchProducts(): Promise<ProductItem[]> {
  const response = await fetch('https://fakestoreapi.com/products?limit=8');

  if (!response.ok) {
    throw new Error('Không thể tải dữ liệu từ máy chủ API');
  }

  const rawData: FakeStoreProduct[] = await response.json();

  return rawData.map(item => {
    // 1. Phân loại danh mục theo quy định đề thi
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
      description: item.description || 'Món ăn / thức uống / dụng cụ học tập chất lượng tại KTX.',
    };
  });
}

export default { fetchProducts };
