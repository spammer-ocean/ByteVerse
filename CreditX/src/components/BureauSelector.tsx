import { BureauType, CreditReport } from "@/types/credit";
import { Button } from "@/components/ui/button";
import { CreditCard, Info, RefreshCw } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

interface BureauSelectorProps {
  bureauReports: Record<BureauType, CreditReport>;
  selectedBureau: BureauType;
  onSelectBureau: (bureau: BureauType) => void;
}

export default function BureauSelector({
  bureauReports,
  selectedBureau,
  onSelectBureau,
}: BureauSelectorProps) {
  const [isRefreshing, setIsRefreshing] = useState<BureauType | null>(null);
  const { toast } = useToast();

  const handleRefresh = (bureau: BureauType) => {
    setIsRefreshing(bureau);

    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(null);
      toast({
        title: "Bureau Data Refreshed",
        description: `Successfully refreshed ${bureau} credit data.`,
        duration: 3000,
      });
    }, 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <motion.div
      className="glass-card p-6 h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-primary" />

          <h2 className="font-semibold text-lg">Select Credit Bureau</h2>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full">
                  <Info className="h-4 w-4" />
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent className="glass-dark border-0">
              <p className="max-w-xs text-sm">
                Credit scores vary between bureaus as they use different data
                sources and calculation methodologies.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <motion.div
        className="space-y-3"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}>
        {Object.values(bureauReports).map((report, index) => {
          const bureau = report.bureau;
          const isSelected = selectedBureau === bureau;
          const isCurrentlyRefreshing = isRefreshing === bureau;

          return (
            <motion.div
              key={bureau}
              className={`glass rounded-xl p-4 transition-all duration-300 ${
                isSelected
                  ? "border-2 border-primary bg-white/10"
                  : "border-2 border-gray-300"}
                ${
                bureau=='Normalized Evaluation' ? "mb-7 bg-gradient-to-r from-slate-800 to-blue-900" : ""
              }`}
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                    delay: index * 0.1,
                  },
                },
              }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.98 }}>
              <div className="flex items-center justify-between">
                <motion.button
                  onClick={() => onSelectBureau(bureau)}
                  className="flex items-center flex-1"
                  whileTap={{ scale: 0.98 }}>
                  <motion.div
                    className={`h-3 w-3 rounded-full mr-3`}
                    animate={
                      isSelected
                        ? {
                            scale: [1, 1.2, 1],
                            boxShadow: [
                              "0 0 0 rgba(255, 255, 255, 0)",
                              "0 0 10px rgba(255, 255, 255, 0.5)",
                              "0 0 0 rgba(255, 255, 255, 0)",
                            ],
                          }
                        : {}
                    }
                    transition={{
                      duration: 2,
                      repeat: isSelected ? Infinity : 0,
                      repeatDelay: 1,
                    }}
                  />
                  <div className="text-left">
                    <h3 className="font-medium">{bureau}</h3>
                    <p className="text-xs text-muted-foreground">
                      Updated: {formatDate(report.lastUpdated)}
                    </p>
                  </div>
                </motion.button>

                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRefresh(bureau);
                    }}
                    disabled={isCurrentlyRefreshing}>
                    <motion.div
                      animate={isCurrentlyRefreshing ? { rotate: 360 } : {}}
                      transition={{
                        duration: 1,
                        repeat: isCurrentlyRefreshing ? Infinity : 0,
                        ease: "linear",
                      }}>
                      <RefreshCw className="h-4 w-4" />
                    </motion.div>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
