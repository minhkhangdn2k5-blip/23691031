import axios from 'axios';
import { MOCK_PRODUCTS, Product } from '@data/mockProducts';

export type PostItem = {
  id: number;
  title: string;
  body: string;
};

/**
 * 1. Fetch API nhập môn (Chương 2 - Mục 2.2.1)
 * Tải danh sách bài viết từ JSONPlaceholder dùng fetch() thuần
 * Kiểm tra trạng thái res.ok và parse JSON
 */
export async function fetchSamplePosts(): Promise<PostItem[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10');
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: Lỗi tải dữ liệu từ máy chủ`);
  }
  return res.json();
}

/**
 * 2. Axios nhập môn (Chương 2 - Mục 2.2.2)
 * Minh họa gọi API bằng Axios: tự động chuyển đổi JSON trong response.data
 * và xử lý lỗi tập trung qua axios.isAxiosError
 */
export async function fetchPostsWithAxios(): Promise<PostItem[]> {
  try {
    const response = await axios.get<PostItem[]>('https://jsonplaceholder.typicode.com/posts', {
      params: { _limit: 10 },
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.warn('Axios status code:', error.response?.status);
      console.warn('Axios error message:', error.message);
    }
    throw error;
  }
}

/**
 * 3. Tải danh sách sản phẩm ShopAI (Chương 2 & Chương 4)
 * Mô phỏng gọi API mạng có độ trễ 600ms, hỗ trợ đủ 3 trạng thái Loading / Success / Error
 */
export async function fetchProducts(): Promise<Product[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...MOCK_PRODUCTS]);
    }, 600);
  });
}

export type CategoryId = 'all' | 'sound' | 'gaming' | 'accessories' | 'smart';

export interface ProductItem extends Product {
  formattedPrice?: string;
  categoryName?: string;
}

export default { fetchSamplePosts, fetchPostsWithAxios, fetchProducts };

