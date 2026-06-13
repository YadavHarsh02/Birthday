"use client";

import { useState, useEffect } from 'react';
import { LockScreen } from './LockScreen';
import { PasswordScreen } from './PasswordScreen';

export function HomePageWrapper({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Set to a fixed time: 5 minutes from when this was committed for Vercel testing
  // Equivalent to 2026-06-14 00:52:00 IST
  const [targetDate] = useState(() => new Date("2026-06-13T19:22:00Z"));

  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Check local storage so they don't have to re-enter password on refresh
    if (localStorage.getItem('birthday_auth') === 'true') {
      setIsAuthenticated(true);
    }

    const checkDate = () => {
      const now = new Date();
      setIsUnlocked(now >= targetDate);
    };
    checkDate();

    const interval = setInterval(checkDate, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isMounted) return null; // Avoid hydration mismatch

  const handleUnlock = () => {
    setIsAuthenticated(true);
    localStorage.setItem('birthday_auth', 'true');
  };

  // 1. Password Lock is the absolute first barrier
  if (!isAuthenticated) {
    // You can change "cottoncandy" to whatever password you want!
    return <PasswordScreen onUnlock={handleUnlock} correctPassword="029618" />;
  }

  // 2. Countdown Timer is the second barrier
  if (!isUnlocked) {
    return <LockScreen targetDate={targetDate} />;
  }

  // 3. Main Website
  return <>{children}</>;
}
