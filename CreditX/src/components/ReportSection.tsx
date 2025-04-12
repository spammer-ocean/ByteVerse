import { ReactNode } from "react";
import { motion } from "framer-motion";

interface ReportSectionProps {
  title: string;
  children: ReactNode;
  delay?: number;
  className?: string;
  icon?: ReactNode;
}

const ReportSection = ({ title, children, delay = 0, className = "", icon }: ReportSectionProps) => {
  return (
    <motion.div
      className={`bg-black/30 backdrop-blur-sm border border-white/5 rounded-lg p-5 ${className} glass-premium`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex items-center mb-4">
        <div className="h-5 w-1 bg-primary rounded-full mr-3"></div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {icon && <div className="ml-2">{icon}</div>}
      </div>
      <div className="text-foreground/80 space-y-4">
        {children}
      </div>
    </motion.div>
  );
};

export default ReportSection;