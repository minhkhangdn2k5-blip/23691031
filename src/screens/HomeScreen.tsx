import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import ProductCard from '@components/ProductCard';
import { MOCK_PRODUCTS } from '@data/mockProducts';
import { SIZES } from '@constants/theme';
import { useTheme } from '@hooks/useTheme';

export const HomeScreen = () => {
  const { colors } = useTheme();
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setProducts([...MOCK_PRODUCTS].sort(() => Math.random() - 0.5));
      setRefreshing(false);
    }, 1500);
  }, []);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header AppBar */}
        <View
          style={[
            styles.header,
            { backgroundColor: colors.surface, borderBottomColor: colors.border },
          ]}
        >
          <TouchableOpacity style={styles.backButton} activeOpacity={0.7}>
            <Text style={[styles.backIcon, { color: colors.text }]}>‹</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Khám phá
          </Text>
          <View style={styles.rightPlaceholder} />
        </View>

        {/* Lưới 2 cột FlashList */}
        <FlashList
          data={products}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <ProductCard product={item} />}
          numColumns={2}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backIcon: {
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 30,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  rightPlaceholder: {
    width: 36,
  },
  listContent: {
    padding: SIZES.padding / 2,
    paddingBottom: 24,
  },
});

export default HomeScreen;
