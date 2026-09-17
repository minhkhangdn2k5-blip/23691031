import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import Typography from '@components/ui/Typography';
import { SIZES } from '@constants/theme';
import { useTheme } from '@hooks/useTheme';

interface HeaderMenuModalProps {
  visible: boolean;
  onClose: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  isEn: boolean;
  onToggleLanguage: () => void;
  onOpenReduxDemo?: () => void;
  onLogout?: () => void;
}

/**
 * HeaderMenuModal: Menu 3 sọc sang trọng (Luxury Hamburger Menu)
 * Gom toàn bộ: Đổi Sáng/Tối, Chuyển ngữ Anh/Việt, Demo Redux Toolkit, và Đăng xuất vào 1 nơi gọn gàng
 */
export const HeaderMenuModal: React.FC<HeaderMenuModalProps> = ({
  visible,
  onClose,
  isDark,
  onToggleTheme,
  isEn,
  onToggleLanguage,
  onOpenReduxDemo,
  onLogout,
}) => {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[
            styles.menuCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
          onPress={e => e.stopPropagation()}
        >
          {/* Tiêu đề Menu */}
          <View style={[styles.menuHeader, { borderBottomColor: colors.border }]}>
            <Typography variant="body1" color={colors.text} style={{ fontWeight: '800' }}>
              Cài đặt & Tiện ích
            </Typography>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Typography variant="body2" color={colors.textLight} style={{ fontWeight: '700' }}>
                ✕
              </Typography>
            </TouchableOpacity>
          </View>

          {/* Mục 1: Đổi Giao diện Sáng / Tối */}
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={onToggleTheme}
            activeOpacity={0.7}
          >
            <View style={styles.itemLeft}>
              <Typography variant="body1" style={styles.itemIcon}>
                {isDark ? '☀️' : '🌙'}
              </Typography>
              <Typography variant="body2" color={colors.text} style={{ fontWeight: '600' }}>
                Chế độ {isDark ? 'Sáng' : 'Tối'}
              </Typography>
            </View>
            <View style={[styles.pillBadge, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Typography variant="small" color={colors.primary} style={{ fontWeight: '700' }}>
                {isDark ? 'Đang bật Tối' : 'Đang bật Sáng'}
              </Typography>
            </View>
          </TouchableOpacity>

          {/* Mục 2: Đổi Ngôn ngữ Anh / Việt */}
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={onToggleLanguage}
            activeOpacity={0.7}
          >
            <View style={styles.itemLeft}>
              <Typography variant="body1" style={styles.itemIcon}>
                🌐
              </Typography>
              <Typography variant="body2" color={colors.text} style={{ fontWeight: '600' }}>
                Ngôn ngữ ({isEn ? 'English' : 'Tiếng Việt'})
              </Typography>
            </View>
            <View style={[styles.pillBadge, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Typography variant="small" color={colors.primary} style={{ fontWeight: '700' }}>
                {isEn ? '🇬🇧 EN' : '🇻🇳 VI'}
              </Typography>
            </View>
          </TouchableOpacity>

          {/* Mục 3: Mở màn hình Demo Redux Toolkit (Đề cương 5.1.2 & 5.2.1-5.2.4) */}
          {onOpenReduxDemo && (
            <TouchableOpacity
              style={[styles.menuItem, { borderBottomColor: colors.border }]}
              onPress={() => {
                onClose();
                onOpenReduxDemo();
              }}
              activeOpacity={0.7}
            >
              <View style={styles.itemLeft}>
                <Typography variant="body1" style={styles.itemIcon}>
                  ⚛️
                </Typography>
                <Typography variant="body2" color={colors.text} style={{ fontWeight: '600' }}>
                  Demo Redux Toolkit
                </Typography>
              </View>
              <Typography variant="body2" color={colors.textLight} style={{ fontWeight: '700' }}>
                ›
              </Typography>
            </TouchableOpacity>
          )}

          {/* Mục 3: Đăng xuất (Thoát) */}
          {onLogout && (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                onClose();
                onLogout();
              }}
              activeOpacity={0.7}
            >
              <View style={styles.itemLeft}>
                <Typography variant="body1" style={styles.itemIcon}>
                  🚪
                </Typography>
                <Typography variant="body2" color={colors.error} style={{ fontWeight: '700' }}>
                  Đăng xuất (Thoát)
                </Typography>
              </View>
              <Typography variant="body2" color={colors.error} style={{ fontWeight: '700' }}>
                ›
              </Typography>
            </TouchableOpacity>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 58,
    paddingRight: 16,
  },
  menuCard: {
    width: 270,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  pillBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
  },
});

export default HeaderMenuModal;
