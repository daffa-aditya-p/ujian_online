import { useEffect, useRef, useCallback } from 'react';
import { siswaApi } from '../api';

interface SecurityMonitorOptions {
  ujianId: number;
  onViolation: (type: string, message: string) => void;
  onForceSubmit: () => void;
  maxViolations?: number;
}

export function useSecurityMonitor({ ujianId, onViolation, onForceSubmit, maxViolations = 3 }: SecurityMonitorOptions) {
  const violationCount = useRef(0);
  const isFullscreen = useRef(false);
  const devtoolsOpen = useRef(false);
  const lastActiveTime = useRef(Date.now());

  const logViolation = useCallback(async (type: string, message: string) => {
    violationCount.current++;
    onViolation(type, message);
    
    try {
      await siswaApi.logSecurity(ujianId, type, message);
    } catch (e) {
      console.error('Failed to log security event:', e);
    }

    if (violationCount.current >= maxViolations) {
      onForceSubmit();
    }
  }, [ujianId, onViolation, onForceSubmit, maxViolations]);

  // 1. Fullscreen monitoring
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      if (isFullscreen.current && !isNowFullscreen) {
        logViolation('fullscreen_exit', 'Keluar dari mode fullscreen');
      }
      isFullscreen.current = isNowFullscreen;
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [logViolation]);

  // 2. Tab switch / visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logViolation('tab_switch', 'Berpindah tab/window');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [logViolation]);

  // 3. Window blur/focus
  useEffect(() => {
    const handleBlur = () => {
      logViolation('window_blur', 'Window kehilangan fokus');
    };

    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [logViolation]);

  // 4. DevTools detection
  useEffect(() => {
    const checkDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if ((widthThreshold || heightThreshold) && !devtoolsOpen.current) {
        devtoolsOpen.current = true;
        logViolation('devtools_open', 'DevTools terdeteksi terbuka');
      } else if (!widthThreshold && !heightThreshold) {
        devtoolsOpen.current = false;
      }
    };

    const interval = setInterval(checkDevTools, 1000);
    return () => clearInterval(interval);
  }, [logViolation]);

  // 5. Keyboard shortcut blocking
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block dangerous shortcuts
      const blockedKeys = ['F12', 'F5', 'F11'];
      const blockedCombos = [
        { ctrl: true, shift: true, key: 'I' }, // DevTools
        { ctrl: true, shift: true, key: 'J' }, // DevTools
        { ctrl: true, shift: true, key: 'C' }, // Inspect
        { ctrl: true, key: 'U' }, // View source
        { ctrl: true, key: 'S' }, // Save
        { ctrl: true, key: 'P' }, // Print
        { alt: true, key: 'Tab' }, // Switch app
        { ctrl: true, key: 'Tab' }, // Switch tab
        { ctrl: true, key: 'W' }, // Close tab
        { ctrl: true, key: 'T' }, // New tab
        { ctrl: true, key: 'N' }, // New window
      ];

      if (blockedKeys.includes(e.key)) {
        e.preventDefault();
        logViolation('keyboard_shortcut', `Tombol ${e.key} diblokir`);
        return;
      }

      for (const combo of blockedCombos) {
        const ctrlMatch = combo.ctrl ? (e.ctrlKey || e.metaKey) : true;
        const shiftMatch = combo.shift ? e.shiftKey : !e.shiftKey;
        const altMatch = combo.alt ? e.altKey : !e.altKey;
        const keyMatch = e.key.toUpperCase() === combo.key.toUpperCase();

        if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
          e.preventDefault();
          logViolation('keyboard_shortcut', `Kombinasi tombol diblokir: ${e.key}`);
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [logViolation]);

  // 6. Copy/Paste blocking
  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      logViolation('copy_attempt', 'Percobaan copy diblokir');
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      logViolation('paste_attempt', 'Percobaan paste diblokir');
    };

    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      logViolation('copy_attempt', 'Percobaan cut diblokir');
    };

    document.addEventListener('copy', handleCopy, true);
    document.addEventListener('paste', handlePaste, true);
    document.addEventListener('cut', handleCut, true);

    return () => {
      document.removeEventListener('copy', handleCopy, true);
      document.removeEventListener('paste', handlePaste, true);
      document.removeEventListener('cut', handleCut, true);
    };
  }, [logViolation]);

  // 7. Right-click blocking
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      logViolation('keyboard_shortcut', 'Klik kanan diblokir');
    };

    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, [logViolation]);

  // 8. Inactivity detection
  useEffect(() => {
    const handleActivity = () => {
      lastActiveTime.current = Date.now();
    };

    const checkInactivity = () => {
      const inactiveTime = Date.now() - lastActiveTime.current;
      if (inactiveTime > 60000) { // 1 minute
        logViolation('window_minimize', 'Tidak ada aktivitas > 1 menit');
        lastActiveTime.current = Date.now();
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keypress', handleActivity);
    window.addEventListener('click', handleActivity);

    const interval = setInterval(checkInactivity, 30000);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('click', handleActivity);
      clearInterval(interval);
    };
  }, [logViolation]);

  // Enter fullscreen
  const enterFullscreen = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen();
      isFullscreen.current = true;
    } catch (e) {
      console.error('Failed to enter fullscreen:', e);
    }
  }, []);

  // Exit fullscreen
  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (e) {
      console.error('Failed to exit fullscreen:', e);
    }
  }, []);

  return {
    violationCount: violationCount.current,
    enterFullscreen,
    exitFullscreen,
    isFullscreen: isFullscreen.current,
  };
}
