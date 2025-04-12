import { motion } from "framer-motion";

interface CreditScoreIndicatorProps {
  score: number;
  bureau: string;
  className?: string;
}

const CreditScoreIndicator = ({ score, bureau, className = "" }: CreditScoreIndicatorProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 750) return "text-status-approved";
    if (score >= 650) return "text-status-pending";
    return "text-status-rejected";
  };

  const getBureauColor = (bureau: string) => {
    switch (bureau.toLowerCase()) {
      case "cibil":
      case "crif highmark":
        return "bg-bureau-cibil/20 text-bureau-cibil";
      case "equifax":
        return "bg-bureau-equifax/20 text-bureau-equifax";
      case "experian":
        return "bg-bureau-experian/20 text-bureau-experian";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  const scorePercentage = (score / 900) * 100;

  return (
    <motion.div 
      className={`flex flex-col p-4 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center mb-1">
        <span className={`text-xs font-medium ${getBureauColor(bureau)} px-2 py-0.5 rounded-full`}>
          {bureau}
        </span>
        <span className={`text-lg font-bold ${getScoreColor(score)}`}>
          {score}
        </span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          className={score >= 750 ? "bg-status-approved" : score >= 650 ? "bg-status-pending" : "bg-status-rejected"}
          style={{ height: "100%", width: "0%" }}
          animate={{ width: `${scorePercentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        />
      </div>
    </motion.div>
  );
};

export default CreditScoreIndicator;