import { useState, useEffect } from 'react';

/**
 * Custom Hook useCountdown (Chương 3 - Sprint 3)
 * Đếm ngược thời gian từ initialSeconds về 0.
 * Trả về { timeLeft, isFinished, seconds, formattedTime, isExpired }
 */
export function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState<number>(initialSeconds);

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (seconds <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const minutes = Math.floor(seconds / 60);
  const remainingSecs = seconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
  const isFinished = seconds <= 0;

  return {
    timeLeft: seconds,
    isFinished,
    seconds,
    formattedTime,
    isExpired: isFinished,
  };
}

export default useCountdown;
