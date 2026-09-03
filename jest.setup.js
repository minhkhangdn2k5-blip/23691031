/* eslint-env jest */
jest.mock('react-native-reanimated', () => {
  const { View, Text, ScrollView } = require('react-native');
  return {
    __esModule: true,
    default: {
      View,
      Text,
      ScrollView,
      createAnimatedComponent: (Comp) => Comp,
    },
    View,
    Text,
    ScrollView,
    createAnimatedComponent: (Comp) => Comp,
    useSharedValue: (initial) => ({ value: initial }),
    useAnimatedStyle: (fn) => (typeof fn === 'function' ? fn() : fn),
    withTiming: (toValue) => toValue,
    withSpring: (toValue) => toValue,
    interpolate: (_val, _inRange, outRange) => outRange[0],
    Extrapolation: {
      CLAMP: 'clamp',
      EXTEND: 'extend',
      IDENTITY: 'identity',
    },
    useAnimatedScrollHandler: () => jest.fn(),
  };
});
