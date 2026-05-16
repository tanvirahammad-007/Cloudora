import { motion } from 'motion/react';
import { useSettings } from '../../context/SettingsContext';
import { Cloud, CloudRain, Wind } from 'lucide-react';

const windCurrents = [
  { top: '12%', left: '-12%', width: '44vw', rotate: '-8deg', delay: 0, duration: 18, className: 'via-sky-400/20 dark:via-cyan-300/12' },
  { top: '34%', left: '58%', width: '34vw', rotate: '10deg', delay: 3, duration: 22, className: 'via-emerald-300/18 dark:via-indigo-300/12' },
  { top: '72%', left: '8%', width: '52vw', rotate: '-5deg', delay: 6, duration: 24, className: 'via-amber-200/16 dark:via-violet-300/10' },
];

const cloudDrifts = [
  { Icon: Cloud, top: '18%', left: '8%', size: 86, delay: 0, duration: 28 },
  { Icon: Wind, top: '48%', left: '78%', size: 72, delay: 5, duration: 24 },
  { Icon: CloudRain, top: '76%', left: '62%', size: 64, delay: 9, duration: 30 },
];

const realisticClouds = [
  { top: '6%', left: '-8%', width: '34rem', height: '12rem', delay: 0, duration: 16, opacity: 0.96 },
  { top: '18%', left: '58%', width: '30rem', height: '10rem', delay: 3, duration: 15, opacity: 0.84 },
  { top: '46%', left: '10%', width: '38rem', height: '13rem', delay: 6, duration: 18, opacity: 0.8 },
  { top: '64%', left: '68%', width: '28rem', height: '9rem', delay: 2, duration: 16, opacity: 0.7 },
  { top: '78%', left: '-4%', width: '26rem', height: '8rem', delay: 8, duration: 17, opacity: 0.66 },
];

const lightModeStormClouds = [
  { top: '14%', left: '18%', width: '32rem', height: '10rem', delay: 1, duration: 17, opacity: 0.66 },
  { top: '58%', left: '42%', width: '36rem', height: '12rem', delay: 6, duration: 19, opacity: 0.58 },
  { top: '34%', left: '-6%', width: '30rem', height: '9rem', delay: 10, duration: 18, opacity: 0.52 },
];

const shimmerLines = [
  { top: '24%', left: '22%', width: '12rem', delay: 1 },
  { top: '58%', left: '4%', width: '9rem', delay: 4 },
  { top: '68%', left: '70%', width: '11rem', delay: 7 },
  { top: '86%', left: '34%', width: '14rem', delay: 10 },
];

export default function LivelyBackground() {
  const { settings } = useSettings();
  const isDark = settings.theme === 'dark';

  if (!settings.dynamicBackground) return null;

  return (
    <div className="fixed inset-0 z-0 isolate overflow-hidden pointer-events-none">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_left,rgba(14,165,233,0.1),transparent_38%),radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.08),transparent_34%)] dark:bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.1),transparent_36%),radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.08),transparent_34%)]" />

      {windCurrents.map((current) => (
        <motion.div
          key={`${current.top}-${current.left}`}
          animate={{
            x: ['-8%', '12%', '-8%'],
            opacity: [0.18, 0.42, 0.18],
          }}
          transition={{
            duration: current.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: current.delay,
          }}
          style={{
            top: current.top,
            left: current.left,
            width: current.width,
            transform: `rotate(${current.rotate})`,
          }}
          className={`absolute z-[1] h-24 bg-gradient-to-r from-transparent ${current.className} to-transparent blur-3xl`}
        />
      ))}

      {cloudDrifts.map(({ Icon, ...cloud }) => (
        <motion.div
          key={`${cloud.top}-${cloud.left}`}
          animate={{
            x: [0, 34, 0],
            y: [0, -16, 0],
            opacity: [0.12, 0.28, 0.12],
          }}
          transition={{
            duration: cloud.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: cloud.delay,
          }}
          style={{ top: cloud.top, left: cloud.left }}
          className="absolute z-[1] text-sky-700/45 dark:text-white/30"
        >
          <Icon size={cloud.size} strokeWidth={1} />
        </motion.div>
      ))}

      {realisticClouds.map((cloud) => (
        (() => {
          const cloudOpacity = isDark ? cloud.opacity * 0.3 : cloud.opacity;

          return (
            <motion.div
              key={`${cloud.top}-${cloud.left}`}
              animate={{
                x: [0, 230, 0],
                y: [0, -26, 0],
                opacity: [cloudOpacity * 0.82, cloudOpacity, cloudOpacity * 0.82],
              }}
              transition={{
                duration: cloud.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: cloud.delay,
              }}
              style={{ top: cloud.top, left: cloud.left, width: cloud.width, height: cloud.height }}
              className="absolute z-[3]"
            >
              <div className="absolute inset-x-[6%] bottom-[10%] h-[42%] rounded-full bg-slate-400/28 blur-2xl dark:bg-slate-950/12" />
              <div className="absolute left-[4%] top-[42%] h-[36%] w-[92%] rounded-full bg-white/95 blur-xl dark:bg-white/8" />
              <div className="absolute left-[10%] top-[22%] h-[54%] w-[26%] rounded-full bg-white blur-xl dark:bg-white/8" />
              <div className="absolute left-[28%] top-[4%] h-[72%] w-[30%] rounded-full bg-white blur-xl dark:bg-white/10" />
              <div className="absolute left-[50%] top-[16%] h-[58%] w-[28%] rounded-full bg-white/95 blur-xl dark:bg-white/8" />
              <div className="absolute left-[70%] top-[34%] h-[42%] w-[22%] rounded-full bg-white/90 blur-xl dark:bg-white/7" />
              <div className="absolute left-[20%] top-[34%] h-[32%] w-[58%] rounded-full bg-white/85 blur-2xl dark:bg-white/6" />
            </motion.div>
          );
        })()
      ))}

      {lightModeStormClouds.map((cloud) => (
        <motion.div
          key={`${cloud.top}-${cloud.left}-storm`}
          animate={{
            x: [0, 190, 0],
            y: [0, -18, 0],
            opacity: [cloud.opacity * 0.76, cloud.opacity, cloud.opacity * 0.76],
          }}
          transition={{
            duration: cloud.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: cloud.delay,
          }}
          style={{ top: cloud.top, left: cloud.left, width: cloud.width, height: cloud.height }}
          className="absolute z-[4] dark:hidden"
        >
          <div className="absolute inset-x-[5%] bottom-[8%] h-[44%] rounded-full bg-sky-900/24 blur-2xl" />
          <div className="absolute left-[3%] top-[42%] h-[36%] w-[94%] rounded-full bg-slate-950/42 blur-xl" />
          <div className="absolute left-[12%] top-[20%] h-[54%] w-[28%] rounded-full bg-sky-950/46 blur-xl" />
          <div className="absolute left-[32%] top-[2%] h-[72%] w-[30%] rounded-full bg-slate-950/48 blur-xl" />
          <div className="absolute left-[54%] top-[16%] h-[58%] w-[28%] rounded-full bg-blue-950/38 blur-xl" />
          <div className="absolute left-[72%] top-[34%] h-[42%] w-[22%] rounded-full bg-slate-950/36 blur-xl" />
          <div className="absolute left-[22%] top-[36%] h-[32%] w-[58%] rounded-full bg-black/30 blur-2xl" />
        </motion.div>
      ))}

      {shimmerLines.map((line) => (
        <motion.div
          key={`${line.top}-${line.left}`}
          animate={{ x: ['-20%', '120%'], opacity: [0, 0.32, 0] }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: line.delay,
          }}
          style={{ top: line.top, left: line.left, width: line.width }}
          className="absolute z-[1] h-px bg-gradient-to-r from-transparent via-sky-500/25 to-transparent dark:via-white/15"
        />
      ))}
    </div>
  );
}
