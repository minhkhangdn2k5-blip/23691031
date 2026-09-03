# ShopAI — Ứng Dụng Thương Mại Điện Tử & AI (Chương 1 đến Chương 4)

Dự án thực chiến theo giáo trình **React Native Thực Chiến (11 Chương)** và **Bản Đồ Đề Cương Chính Thức**.

---

## 📱 CÁC TÍNH NĂNG ĐÃ TRIỂN KHAI (CHƯƠNG 1 → 4)

### Chương 1: Công cụ, Môi trường & Khởi tạo (Sprint 1)
- React Native CLI với TypeScript
- Thiết lập ESLint & Prettier tự động định dạng
- Bọc toàn bộ ứng dụng bằng `SafeAreaProvider` từ `react-native-safe-area-context`

### Chương 2: Core Components & Clean Architecture (Sprint 2)
- Cấu trúc thư mục Enterprise (`src/`): `components`, `screens`, `navigation`, `services`, `hooks`, `constants`, `data`, `contexts`, `utils`, `types`
- Cấu hình Path Aliases đầy đủ (`@components`, `@screens`, `@constants`...)
- Core Components: `View`, `Text`, `Image`, `TextInput`, `Pressable`, `ScrollView`, `FlatList`, `SectionList`, `Modal`, `Alert`, `Switch`, `ActivityIndicator`
- Tầng dịch vụ API: `productApi.ts` với `fetchSamplePosts()` và `fetchProducts()`

### Chương 3: Design System & UI Kit Atoms (Sprint 3)
- Hệ thống Tokens: `COLORS`, `SIZES`, `FONTS` (`src/constants/theme.ts`)
- Bộ UI Kit Atoms:
  - `Typography`: Hỗ trợ đầy đủ variants chữ (`h1`, `h2`, `h3`, `body1`, `body2`, `small`)
  - `ShopInput`: Kế thừa `TextInputProps`, hỗ trợ nhãn `label`, hiển thị lỗi `error`
  - `ShopButton`: Hỗ trợ 3 biến thể (`primary`, `secondary`, `outline`), trạng thái `isLoading`, `disabled`
- `ThemeContext`: Chuyển đổi mượt mà chế độ **Sáng / Tối (Dark / Light Mode)** tức thì
- Tối ưu Re-render với `React.memo`, `useMemo`, `useCallback`
- Quản lý state nâng cao với `useReducer`

### Chương 4: List Virtualization & Reanimated 3 (Sprint 4)
- **Lưới 2 cột FlashList**: Sử dụng `@shopify/flash-list` tối ưu bộ nhớ gấp 10 lần `FlatList`
- **Reanimated 3 Worklet**: Thẻ sản phẩm `ProductCard` có hiệu ứng mờ dần (Fade-in) chạy trực tiếp trên Native UI Thread
- **Pull-to-refresh**: Vuốt kéo xuống để làm mới danh sách dữ liệu
- **Tìm kiếm & Lọc**: Tìm kiếm theo thời gian thực kết hợp kỹ thuật Debounce và bộ lọc danh mục
- **Collapsing Header Demo**: Hiệu ứng cuộn thu nhỏ thanh tiêu đề với `useAnimatedScrollHandler` và `interpolate`

### Đề cương Chương 4: Điều hướng React Navigation V7
- `NavigationContainer` tích hợp Deep Linking (`shopai://`)
- `BottomTabNavigator` (`MainTabs`):
  - Tab 1: **Trang chủ** (`HomeScreen` - FlashList Grid 2 cột)
  - Tab 2: **Demos Đề Cương** (`DemosScreen` - Trình chạy toàn bộ demo Core Components)
  - Tab 3: **Cuộn Header** (`CollapsingHeaderDemo` - Demo Reanimated scroll-driven)
- `NativeStackNavigator`: Điều hướng chuyển trang chi tiết sản phẩm (`ProductDetailScreen`) truyền và nhận tham số `productId`

---

## 🛠 HƯỚNG DẪN CÀI ĐẶT & CHẠY ỨNG DỤNG

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Khởi động Metro Bundler
```bash
npm start
```

### 3. Chạy ứng dụng trên Android Emulator
```bash
npm run android
```

### 4. Kiểm tra TypeScript & Unit Test
```bash
npx tsc --noEmit
npm test
```
