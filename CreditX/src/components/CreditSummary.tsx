
import { getScoreColor, getScoreRating } from "@/data/mockData";
import { CreditReport } from "@/types/credit";
import { InfoIcon } from "lucide-react";
import CreditScoreCircle from "./CreditScoreCircle";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface CreditSummaryProps {
  report: CreditReport;
}

export default function CreditSummary({ report }: CreditSummaryProps) {
  const scoreColor = getScoreColor(report.creditScore);
  const scoreRating = getScoreRating(report.creditScore);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Calculate some summary numbers
  const totalCurrentLoanAmount = report.currentLoans.reduce((sum, loan) => sum + loan.amount, 0);
  const totalSettledLoanAmount = report.settledLoans.reduce((sum, loan) => sum + loan.amount, 0);
  const totalDefaultCount = report.defaults.reduce((sum, def) => sum + def.count, 0);
  const totalMissedPayments = report.missedPayments.reduce((sum, payment) => sum + payment.count, 0);

  return (
    <div className="glass-card p-6 flex flex-col h-full animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center">
            <h2 className="text-2xl font-bold">{report.bureau} Credit Score</h2>
            <div className={`ml-3 px-2 py-0.5 text-xs font-medium rounded-full bg-${scoreColor}/20 text-${scoreColor}`}>
              {scoreRating}
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            Last updated: {formatDate(report.lastUpdated)}
          </p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="glass-dark border-0 max-w-xs">
              <p className="text-sm">
                This score represents your creditworthiness as evaluated by {report.bureau}. 
                Scores vary between bureaus due to different calculation models and data sources.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 mt-4">
        <div className="lg:col-span-1 flex justify-center items-center">
          <CreditScoreCircle report={report} />
        </div>
        
        <div className="lg:col-span-3 grid grid-cols-2 gap-4">
          <div className="col-span-2 glass rounded-xl p-4 animate-fade-in animate-delay-100">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Credit Overview</h3>
            <div className="flex justify-between">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Current Loans</p>
                <p className="text-xl font-bold">₹{(totalCurrentLoanAmount/100000).toFixed(1)}L</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Settled Loans</p>
                <p className="text-xl font-bold">₹{(totalSettledLoanAmount/100000).toFixed(1)}L</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Defaults</p>
                <p className="text-xl font-bold">{totalDefaultCount}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Missed Payments</p>
                <p className="text-xl font-bold">{totalMissedPayments}</p>
              </div>
            </div>
          </div>
          
          {/* Current Loans */}
          <div className="glass rounded-xl p-4 animate-fade-in animate-delay-200">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Current Loans</h3>
            <div className="space-y-2 max-h-32 overflow-y-auto scrollbar-thin">
              {report.currentLoans.map((loan, index) => (
                <div key={index} className="flex justify-between items-center p-2 rounded-lg bg-secondary/30">
                  <span className="text-xs">{loan.bank}</span>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium">₹{(loan.amount/100000).toFixed(1)}L</span>
                    <span className="text-xs text-muted-foreground">{loan.timePeriod} months</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Defaults and Missed Payments */}
          <div className="glass rounded-xl p-4 animate-fade-in animate-delay-300">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Payment Issues</h3>
            <div className="space-y-2 max-h-32 overflow-y-auto scrollbar-thin">
              {report.defaults.map((def, index) => (
                def.count > 0 && (
                  <div key={`def-${index}`} className="flex justify-between items-center p-2 rounded-lg bg-credit-poor/10">
                    <span className="text-xs">{def.bank}</span>
                    <span className="text-xs font-medium text-credit-poor">{def.count} defaults</span>
                  </div>
                )
              ))}
              {report.missedPayments.map((payment, index) => (
                payment.count > 0 && (
                  <div key={`miss-${index}`} className="flex justify-between items-center p-2 rounded-lg bg-credit-fair/10">
                    <span className="text-xs">{payment.bank}</span>
                    <span className="text-xs font-medium text-credit-fair">{payment.count} missed</span>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
