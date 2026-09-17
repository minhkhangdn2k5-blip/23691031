import { z } from 'zod';

/**
 * Tấm khiên Zod Schema cho Dữ liệu Sản phẩm (Chương 6 - Bước 4)
 * Type-Safety tuyệt đối từ Front-end đến Back-end
 */
export const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Tên sản phẩm không được để trống'),
  price: z.number().positive('Giá sản phẩm phải lớn hơn 0'),
  image: z.string(),
  category: z.string().optional(),
  description: z.string().optional(),
});

// Khuôn mẫu cho Danh sách (Mảng) sản phẩm trả về từ API
export const ProductListSchema = z.array(ProductSchema);

// Tự động suy luận Type TypeScript từ Zod Schema — Không cần viết interface 2 lần!
export type Product = z.infer<typeof ProductSchema>;
