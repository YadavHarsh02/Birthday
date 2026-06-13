import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownTimerProps {
  targetDate: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();
      let timeLeft = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };

      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return timeLeft;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!isMounted) {
    return <div className="flex gap-4 opacity-0">Loading...</div>; // Avoid hydration mismatch
  }

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="flex gap-4 sm:gap-6 md:gap-8 justify-center">
      <TimeUnit value={formatNumber(timeLeft.days)} label="DAYS" />
      <span className="text-3xl md:text-5xl text-white/50 font-bold self-start mt-2">:</span>
      <TimeUnit value={formatNumber(timeLeft.hours)} label="HOURS" />
      <span className="text-3xl md:text-5xl text-white/50 font-bold self-start mt-2">:</span>
      <TimeUnit value={formatNumber(timeLeft.minutes)} label="MINUTES" />
      <span className="text-3xl md:text-5xl text-white/50 font-bold self-start mt-2">:</span>
      <TimeUnit value={formatNumber(timeLeft.seconds)} label="SECONDS" />
    </div>
  );
}

const TimeUnit = ({ value, label }: { value: string; label: string }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/20 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(255,192,203,0.3)]">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: 20, opacity: 0, filter: 'blur(4px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={{ y: -20, opacity: 0, filter: 'blur(4px)' }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-wider font-mono"
            style={{ textShadow: '0 0 10px rgba(255,255,255,0.5)' }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-white/70 tracking-[0.2em]">{label}</span>
    </div>
  );
};
