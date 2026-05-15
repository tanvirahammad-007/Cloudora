import MainDashboard from '../components/layout/MainDashboard';
import RightPanel from '../components/layout/RightPanel';
import { motion } from 'motion/react';

export default function DashboardPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex flex-col xl:flex-row gap-[var(--spacing-gap-md)] xl:gap-[var(--spacing-gap-lg)] mt-1 pb-24 xl:pb-0"
    >
      <div className="flex-1 w-full min-w-0">
        <MainDashboard />
      </div>
      <RightPanel className="hidden lg:flex w-full xl:w-[360px] h-auto xl:h-full lg:max-h-[1200px] xl:max-h-none" />
    </motion.div>
  );
}
