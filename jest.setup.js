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

jest.mock('@react-native-async-storage/async-storage', () => {
  let store = {};
  return {
    __esModule: true,
    default: {
      setItem: jest.fn((key, value) => {
        store[key] = value;
        return Promise.resolve(null);
      }),
      getItem: jest.fn((key) => {
        return Promise.resolve(store[key] ?? null);
      }),
      removeItem: jest.fn((key) => {
        delete store[key];
        return Promise.resolve(null);
      }),
      clear: jest.fn(() => {
        store = {};
        return Promise.resolve(null);
      }),
      getAllKeys: jest.fn(() => Promise.resolve(Object.keys(store))),
      multiGet: jest.fn((keys) => Promise.resolve(keys.map((k) => [k, store[k] ?? null]))),
      multiSet: jest.fn((pairs) => {
        pairs.forEach(([k, v]) => { store[k] = v; });
        return Promise.resolve(null);
      }),
      multiRemove: jest.fn((keys) => {
        keys.forEach((k) => { delete store[k]; });
        return Promise.resolve(null);
      }),
    },
  };
});
