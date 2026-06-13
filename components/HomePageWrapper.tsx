"use client";

import { useState, useEffect } from 'react';
import { LockScreen } from './LockScreen';

export function HomePageWrapper({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  
  // Set to a fixed time: 5 minutes from when this was committed for Vercel testing
  // Equivalent to 2026-06-14 00:52:00 IST
  const [targetDate] = useState(() => new Date("2026-06-13T19:22:00Z"));

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
