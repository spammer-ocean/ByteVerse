import { CreditReport } from "@/types/credit";
import { Badge } from "@/components/ui/badge";
import { IdCard, User } from "lucide-react";
import { motion } from "framer-motion";
import { hoverScale, fadeIn } from "@/utils/animation-variants";

interface UserDetailsProps {
  report: CreditReport;
}

export default function UserDetails({ report }: UserDetailsProps) {
  return (
    <motion.div 
      className="glass-premium p-6 neo-card relative overflow-hidden"
      variants={fadeIn}
      whileHover="hover"
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="absolute -top-16 -right-16 w-32 h-32 bg-primary/10 rounded-full blur-2xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute -bottom-16 -left-16 w-32 h-32 bg-accent/10 rounded-full blur-2xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      <div className="flex items-center mb-6">
        <motion.div 
          className="p-2 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mr-3"
          whileHover={{ rotate: 10, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <User className="h-5 w-5 text-primary" />
        </motion.div>
        <h2 className="font-semibold text-lg gradient-text">User Details</h2>
      </div>
      
      <div className="flex flex-col space-y-4">
        <motion.div 
          className="flex flex-col"
          variants={fadeIn}
          custom={1}
        >
          <span className="text-xs text-muted-foreground mb-1">User Name</span>
          <motion.div 
            className="flex items-center py-2 pl-3 pr-4 rounded-lg neo-inset"
            variants={hoverScale}
            whileHover="hover"
          >
            <User className="h-4 w-4 mr-3 text-muted-foreground" />
            <span className="font-medium">{report.username}</span>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="flex flex-col"
          variants={fadeIn}
          custom={2}
        >
          <span className="text-xs text-muted-foreground mb-1">PAN Number</span>
          <motion.div 
            className="flex items-center py-2 pl-3 pr-4 rounded-lg neo-inset"
            variants={hoverScale}
            whileHover="hover"
          >
            <IdCard className="h-4 w-4 mr-3 text-muted-foreground" />
            <span className="font-medium tracking-wide">{report.panNumber}</span>
            <motion.div 
              className="ml-auto"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Badge className="bg-gradient-to-r from-primary/20 to-primary/10 text-primary hover:bg-primary/30 hover:text-primary border border-primary/20" variant="secondary">Verified</Badge>
            </motion.div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="flex flex-col"
          variants={fadeIn}
          custom={3}
        >
          <span className="text-xs text-muted-foreground mb-1">Score Range</span>
          <motion.div 
            className="flex items-center py-2 pl-3 pr-4 rounded-lg neo-inset"
            variants={hoverScale}
            whileHover="hover"
          >
            <motion.div 
              className="flex-1 h-2 bg-secondary/60 rounded-full overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)]"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            >
              <motion.div 
                className="h-full bg-gradient-to-r from-sky-900 via-sky-700 to-teal-800"
                style={{ borderRadius: "inherit" }}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 }}
              />
            </motion.div>
            <span className="ml-3 text-sm font-medium whitespace-nowrap">
              {report.scoreRange.min} - {report.scoreRange.max}
            </span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
