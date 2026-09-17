import React, { Component, ReactNode } from 'react';
import { View, ActivityIndicator, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import LottieView from 'lottie-react-native';
import { COLORS } from '@constants/theme';

interface Props {
  source?: any;
  style?: StyleProp<ViewStyle>;
  autoPlay?: boolean;
  loop?: boolean;
}

interface State {
  hasError: boolean;
}

/**
 * Component hiển thị Micro-animations Lottie (Chương 3 - Mục 3.7)
 * Tích hợp cơ chế Fallback an toàn nếu máy ảo chưa build lại mã Native
 */
export class ShopLottie extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.warn('Lottie native note:', error.message);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <View style={[styles.fallback, this.props.style]}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      );
    }

    return (
      <LottieView
        source={this.props.source || require('@assets/lottie/loading.json')}
        autoPlay={this.props.autoPlay ?? true}
        loop={this.props.loop ?? true}
        style={this.props.style || styles.defaultLottie}
      />
    );
  }
}

const styles = StyleSheet.create({
  defaultLottie: {
    width: 70,
    height: 70,
  },
  fallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ShopLottie;
