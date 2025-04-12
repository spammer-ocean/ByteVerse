import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, X } from "lucide-react";

type DecisionType = "approve" | "approve with conditions" | "decline";

interface DecisionBadgeProps {
  decision: string;
}

const DecisionBadge = ({ decision }: DecisionBadgeProps) => {
  const getDecisionType = (): DecisionType => {
    const lowerCase = decision.toLowerCase();
    if (lowerCase.includes("decline") || lowerCase.includes("reject")) return "decline";
    if (lowerCase.includes("condition")) return "approve with conditions";
    return "approve";
  };

  const getColorClass = (type: DecisionType) => {
    switch (type) {
      case "approve":
        return "bg-status-approved/10 text-status-approved border-status-approved/30";
      case "approve with conditions":
        return "bg-status-pending/10 text-status-pending border-status-pending/30";
      case "decline":
        return "bg-status-rejected/10 text-status-rejected border-status-rejected/30";
    }
  };

  const getIcon = (type: DecisionType) => {
    switch (type) {
      case "approve":
        return <CheckCircle className="w-4 h-4 mr-2" />;
      case "approve with conditions":
        return <AlertTriangle className="w-4 h-4 mr-2" />;
      case "decline":
        return <X className="w-4 h-4 mr-2" />;
    }
  };

  const decisionType = getDecisionType();
  const colorClass = getColorClass(decisionType);

  return (
    <motion.div
      className={`inline-flex items-center px-8 py-2 rounded-full border-2 ${colorClass} text-lg font-semibold shadow-lg`}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      {getIcon(decisionType)}
      {decision}
    </motion.div>
  );
};

export default DecisionBadge;