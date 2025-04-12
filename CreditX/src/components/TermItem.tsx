import { ReactNode } from "react";
import { motion } from "framer-motion";

interface TermItemProps {
  term: string;
  value: ReactNode;
  icon?: ReactNode;
}

const TermItem = ({ term, value, icon }: TermItemProps) => {
  return (
    <motion.div 
      className="flex flex-col p-4 bg-black/30 rounded-lg backdrop-blur-sm border border-white/5 glass-premium"
      whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center mb-1 ">
        {icon && <div className="mr-2 text-primary">{icon}</div>}
        <p className="text-xs text-foreground/60">{term}</p>
      </div>
      <p className="font-medium text-lg">{value}</p>
    </motion.div>
  );
};

export default TermItem;