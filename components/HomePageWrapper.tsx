"use client";

import { useState, useEffect } from 'react';
import { LockScreen } from './LockScreen';

export function HomePageWrapper({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  
  // Set target date to a past date for development so the lock screen is bypassed!
  // You can change this to `new Date(2026, 5, 18, 0, 0, 0)` when you are ready to launch.
  const [targetDate] = useState(() => new Date("2020-01-01T00:00:00"));

  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkDate = () => {
      const now = new Date();
      setIsUnlocked(now >= targetDate);
    };
    checkDate();
    
    const interval = setInterval(checkDate, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isMounted) return null; // Avoid hydration mismatch

  if (!isUnlocked) {
    return <LockScreen targetDate={targetDate} />;
  }

  return <>{children}</>;
}
