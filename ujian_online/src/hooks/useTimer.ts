import { useState, useEffect, useCallback } from 'react';

interface UseTimerOptions {
  durasiMenit: number;
  onTimeUp: () => void;
}

export function useTimer({ durasiMenit, onTimeUp }: UseTimerOptions) {
  const [sisaWaktu, setSisaWaktu] = useState(durasiMenit * 60);

  useEffect(() => {
    if (sisaWaktu <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setSisaWaktu((prev) => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sisaWaktu, onTimeUp]);

  const formatWaktu = useCallback((detik: number) => {
    const jam = Math.floor(detik / 3600);
    const menit = Math.floor((detik % 3600) / 60);
    const sisa = detik % 60;

    if (jam > 0) {
      return `${jam}:${menit.toString().padStart(2, '0')}:${sisa.toString().padStart(2, '0')}`;
    }
    return `${menit}:${sisa.toString().padStart(2, '0')}`;
  }, []);

  return {
    sisaWaktu,
    formatWaktu: formatWaktu(sisaWaktu),
    isWarning: sisaWaktu <= 300, // 5 menit
    isDanger: sisaWaktu <= 60, // 1 menit
  };
}
