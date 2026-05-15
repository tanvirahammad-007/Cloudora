import React from 'react';
import { motion } from 'motion/react';
import { useSettings } from '../../context/SettingsContext';

export default function LivelyBackground() {
  const { settings } = useSettings();

  if (!settings.dynamicBackground) return null;

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* Primary Blob */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-indigo-500/10 blur-[120px]"
      />

      {/* Secondary Blob */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -40, 0],
          y: [0, 50, 0],
          rotate: [0, -120, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-[-10%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-pink-500/10 blur-[100px]"
      />

      {/* Tertiary Blob */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 30, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
        className="absolute top-[30%] right-[15%] w-[25vw] h-[25vw] rounded-full bg-amber-500/10 blur-[90px]"
      />

      {/* Extra Lively Elements (small floating circles) */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          className="absolute w-2 h-2 rounded-full bg-white/20 blur-[2px]"
        />
      ))}
    </div>
  );
}
