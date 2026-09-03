import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SIZES } from '@constants/theme';
import { useTheme } from '@hooks/useTheme';
import Typography from '@components/ui/Typography';

// Import các màn demo từ đề cương Chương 2, 3, 4
import ViewDemo from './demos/ViewDemo';
import TextDemo from './demos/TextDemo';
import ImageDemo from './demos/ImageDemo';
import TextInputDemo from './demos/TextInputDemo';
import PressableDemo from './demos/PressableDemo';
import ScrollDemo from './demos/ScrollDemo';
import FlatListDemo from './demos/FlatListDemo';
import SectionListDemo from './demos/SectionListDemo';
import AlertDemo from './demos/AlertDemo';
import ModalDemo from './demos/ModalDemo';
import SwitchDemo from './demos/SwitchDemo';
import LoadingDemo from './demos/LoadingDemo';
import StyleSheetWalkthrough from './demos/StyleSheetWalkthrough';
import DemoPropsState from './demos/DemoPropsState';
import FetchDemo from './demos/FetchDemo';
import AxiosDemo from './demos/AxiosDemo';
import CollapsingHeaderDemo from './demos/CollapsingHeaderDemo';

interface DemoItem {
  id: string;
  title: string;
  chapter: string;
  desc: string;
  component: React.ComponentType;
}

const DEMOS: DemoItem[] = [
  { id: 'view', title: '1. View Demo', chapter: 'Chương 2 (2.1.1)', desc: 'Hộp chứa bố cục Flexbox', component: ViewDemo },
  { id: 'text', title: '2. Text Demo', chapter: 'Chương 2 (2.1.1)', desc: 'Hiển thị văn bản, nesting Text', component: TextDemo },
  { id: 'image', title: '3. Image Demo', chapter: 'Chương 2 (2.1.1)', desc: 'Ảnh local, remote và resizeMode', component: ImageDemo },
  { id: 'input', title: '4. TextInput Demo', chapter: 'Chương 2 (2.1.1)', desc: 'Ô nhập văn bản controlled input', component: TextInputDemo },
  { id: 'pressable', title: '5. Pressable / Touchable', chapter: 'Chương 2 (2.1.2)', desc: 'Sự kiện chạm, pressed feedback', component: PressableDemo },
  { id: 'scroll', title: '6. ScrollView Demo', chapter: 'Chương 2 (2.1.1)', desc: 'Cuộn nội dung đơn giản', component: ScrollDemo },
  { id: 'flatlist', title: '7. FlatList Demo', chapter: 'Chương 2 (2.1.3)', desc: 'Danh sách tối ưu hoá bộ nhớ', component: FlatListDemo },
  { id: 'sectionlist', title: '8. SectionList Demo', chapter: 'Chương 2 (2.1.3)', desc: 'Danh sách nhóm theo đề mục', component: SectionListDemo },
  { id: 'alert', title: '9. Alert Demo', chapter: 'Chương 2', desc: 'Hộp thoại cảnh báo native', component: AlertDemo },
  { id: 'modal', title: '10. Modal Demo', chapter: 'Chương 2', desc: 'Cửa sổ bật nổi (Popup)', component: ModalDemo },
  { id: 'switch', title: '11. Switch Demo', chapter: 'Chương 2', desc: 'Công tắc bật/tắt giá trị boolean', component: SwitchDemo },
  { id: 'loading', title: '12. ActivityIndicator', chapter: 'Chương 2', desc: 'Vòng xoay chờ tải dữ liệu', component: LoadingDemo },
  { id: 'props_state', title: '13. Props & State Demo', chapter: 'Chương 2 (1.2.2)', desc: 'Quản lý state nội bộ và truyền props', component: DemoPropsState },
  { id: 'fetch', title: '14. Fetch API Demo', chapter: 'Chương 2 (2.2.1)', desc: 'Gọi API từ JSONPlaceholder', component: FetchDemo },
  { id: 'axios', title: '15. Axios Demo', chapter: 'Chương 2 (2.2.2)', desc: 'Thư viện Axios nhập môn', component: AxiosDemo },
  { id: 'style', title: '16. StyleSheet Walkthrough', chapter: 'Chương 2 (1.2.4)', desc: 'Hệ thống StyleSheet.create', component: StyleSheetWalkthrough },
  { id: 'collapse', title: '17. Collapsing Header', chapter: 'Chương 4 (4.4)', desc: 'Reanimated 3 Worklet scroll-driven', component: CollapsingHeaderDemo },
];

export const DemosScreen: React.FC = () => {
  const { colors } = useTheme();
  const [activeDemo, setActiveDemo] = useState<DemoItem | null>(null);

  const ActiveComponent = activeDemo ? activeDemo.component : null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Typography variant="h2" style={{ fontWeight: '800' }}>
          Đề cương Thực hành
        </Typography>
        <Typography variant="caption" color={colors.textLight}>
          Tất cả các bài tập & Core Components từ Chương 1 đến Chương 4
        </Typography>
      </View>

      <ScrollView contentContainerStyle={styles.scrollList} showsVerticalScrollIndicator={false}>
        {DEMOS.map(item => (
          <TouchableOpacity
            key={item.id}
            onPress={() => setActiveDemo(item)}
            style={[styles.itemCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            activeOpacity={0.7}
          >
            <View style={styles.itemHeader}>
              <Typography variant="bodyBold" style={{ fontWeight: '700' }}>
                {item.title}
              </Typography>
              <View style={[styles.badge, { backgroundColor: colors.background }]}>
                <Text style={[styles.badgeText, { color: colors.primary }]}>{item.chapter}</Text>
              </View>
            </View>
            <Typography variant="small" color={colors.textLight} style={styles.itemDesc}>
              {item.desc}
            </Typography>
            <Typography variant="caption" color={colors.primary} style={styles.viewLink}>
              Xem Demo →
            </Typography>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Demo Modal View */}
      <Modal visible={!!activeDemo} animationType="slide" onRequestClose={() => setActiveDemo(null)}>
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
            <View>
              <Typography variant="h3" style={{ fontWeight: '700' }}>
                {activeDemo?.title}
              </Typography>
              <Typography variant="caption" color={colors.textLight}>
                {activeDemo?.chapter}
              </Typography>
            </View>
            <TouchableOpacity onPress={() => setActiveDemo(null)} style={styles.closeBtn}>
              <Typography variant="bodyBold" color={colors.primary}>
                Đóng ✕
              </Typography>
            </TouchableOpacity>
          </View>
          <View style={styles.modalBody}>{ActiveComponent ? <ActiveComponent /> : null}</View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  scrollList: {
    padding: SIZES.padding,
    paddingBottom: 32,
  },
  itemCard: {
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  itemDesc: {
    lineHeight: 18,
    marginBottom: 8,
  },
  viewLink: {
    fontWeight: '700',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  closeBtn: {
    padding: 6,
  },
  modalBody: {
    flex: 1,
  },
});

export default DemosScreen;
