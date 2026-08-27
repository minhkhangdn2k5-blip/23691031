import React, { useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, Animated, StyleSheet } from 'react-native';

export default function LoadingDemo() {
  // Setup Animation cho Skeleton
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0.3, duration: 800, useNativeDriver: true })
      ])
    ).start();
  }, [fadeAnim]);

  return (
    <View style={styles.card}>
      <Text style={styles.header}>2.6.9. Loading & Skeleton UI</Text>
      
      {/* 1. ActivityIndicator (Vòng quay mặc định) */}
      <Text style={styles.label}>1) Vòng quay ActivityIndicator:</Text>
      <View style={styles.row}>
        <ActivityIndicator size="small" color="#FF4D4F" />
        <ActivityIndicator size="large" color="#1890FF" />
      </View>

      {/* 2. Skeleton Loading có Animation (Từ code của bạn) */}
      <Text style={styles.label}>2) Animated Skeleton (Hiệu ứng nhịp thở):</Text>
      <View style={styles.skeletonContainer}>
        {/* Khối ảnh giả lập */}
        <Animated.View style={[styles.skeletonImage, { opacity: fadeAnim }]} />
        {/* Khối text giả lập */}
        <Animated.View style={[styles.skeletonText, { opacity: fadeAnim }]} />
        <Animated.View style={[styles.skeletonTextSmall, { opacity: fadeAnim }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 16 },
  header: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '600', color: '#666', marginTop: 10, marginBottom: 8 },
  row: { flexDirection: 'row', gap: 24, alignItems: 'center', marginBottom: 10 },
  
  // Styles cho Skeleton
  skeletonContainer: {
    marginTop: 8,
    backgroundColor: '#FAFAFA',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE'
  },
  skeletonImage: { width: '100%', height: 120, backgroundColor: '#E0E0E0', borderRadius: 8 },
  skeletonText: { width: '80%', height: 16, backgroundColor: '#E0E0E0', borderRadius: 4, marginTop: 12 },
  skeletonTextSmall: { width: '50%', height: 16, backgroundColor: '#E0E0E0', borderRadius: 4, marginTop: 8 },
});