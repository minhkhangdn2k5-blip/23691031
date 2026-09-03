import { useState, useEffect } from 'react';

/**
 * Custom Hook useDebounce (Chương 4 - Mục 4.6)
 * Giúp debounce giá trị input để tránh spam hàm lọc/gọi API
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
