import { MOCK_PRODUCTS, Product } from '@data/mockProducts';

export type PostItem = {
  id: number;
  title: string;
  body: string;
};

/**
 * Tải danh sách bài viết mẫu từ JSONPlaceholder (Chương 2 - Sprint 2)
 */
export async function fetchSamplePosts(): Promise<PostItem[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10');
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json();
}

/**
 * Tải danh sách sản phẩm ShopAI (Chương 4)
 * Trả về danh sách Product với dữ liệu phong phú
 */
export async function fetchProducts(): Promise<Product[]> {
  // Giả lập độ trễ mạng nhẹ 300ms
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([...MOCK_PRODUCTS]);
    }, 300);
  });
}

export type CategoryId = 'all' | 'sound' | 'gaming' | 'accessories' | 'smart';

export interface ProductItem extends Product {
  formattedPrice?: string;
  categoryName?: string;
}

export default { fetchSamplePosts, fetchProducts };
