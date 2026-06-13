import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PasswordScreenProps {
  onUnlock: () => void;
  correctPassword: string;
}

export function PasswordScreen({ onUnlock, correctPassword }: PasswordScreenProps) {
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase() === correctPassword.toLowerCase()) {
      setIsUnlocking(true);
      setTimeout(() => {
        onUnlock();
      }, 1000); // Wait for unlock animation to finish
    } else {
      setIsError(true);
      setTimeout(() => setIsError(false), 500); // Reset error state after shake
    }
  };

  return (
    <AnimatePresence>
      {!isUnlocking && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a1a1a] overflow-hidden"
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500 rounded-full blur-[120px]"
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.1, 0.15, 0.1]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-rose-500 rounded-full blur-[150px]"
            />
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
            className="relative z-10 w-full max-w-md px-8"
          >
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 shadow-2xl flex flex-col items-center text-center">
              
              {/* Lock Icon */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-24 h-24 bg-gradient-to-tr from-pink-500 to-rose-400 rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(236,72,153,0.3)] border-4 border-white/20"
              >
                <span className="text-4xl">🔒</span>
              </motion.div>

              <h2 className="text-3xl font-cursive text-white mb-2 tracking-wide">Authorized Access Only</h2>
              <p className="text-white/50 mb-8 font-medium">Enter the secret passcode to enter.</p>

              <form onSubmit={handleSubmit} className="w-full relative">
                <motion.div
                  animate={isError ? { x: [-10, 10, -10, 10, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className="relative"
                >
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Passcode..."
                    className={`w-full bg-black/40 border-2 ${isError ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'border-white/10 focus:border-pink-500'} rounded-2xl px-6 py-4 text-center text-white text-xl tracking-[0.3em] outline-none transition-colors backdrop-blur-md placeholder:tracking-normal placeholder:text-white/30`}
                    autoFocus
                  />
                </motion.div>
                
                <button
                  type="submit"
                  className="w-full mt-6 bg-white text-black font-bold py-4 rounded-2xl hover:bg-pink-100 transition-colors active:scale-95 text-lg shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                  Unlock
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
