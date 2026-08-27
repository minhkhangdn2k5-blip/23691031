import React from 'react';
import { View, Text, Pressable, Alert, StyleSheet } from 'react-native';

export default function AlertDemo() {
  const showAlert = () => {
    Alert.alert('ShopAI', 'Đã thêm vào giỏ', [
      { text: 'Ở lại', style: 'cancel' },
      { text: 'Xem giỏ', onPress: () => console.log('Xem giỏ hàng') },
    ]);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.btn} onPress={showAlert}>
        <Text style={styles.btnText}>Bấm để mở Alert</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  btn: {
    backgroundColor: '#FF4D4F',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});