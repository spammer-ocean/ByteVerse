
import { CreditReport } from "@/types/credit";
import { Coins, DollarSign, History } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, TooltipProps } from "recharts";

interface LoanSummaryProps {
  report: CreditReport;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

export default function LoanSummary({ report }: LoanSummaryProps) {
  // Calculate totals
  const totalCurrentLoans = report.currentLoans.reduce((acc, loan) => acc + loan.amount, 0);
  const totalSettledLoans = report.settledLoans.reduce((acc, loan) => acc + loan.amount, 0);
  const totalLoanAmount = totalCurrentLoans + totalSettledLoans;
  
  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) { // 1 crore or more
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) { // 1 lakh or more
      return `₹${(amount / 100000).toFixed(2)} L`;
    } else {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
  };
  
  // Prepare chart data
  const chartData: ChartData[] = [
    {
      name: "Current Loans",
      value: totalCurrentLoans,
      color: "#3b82f6" // blue
    },
    {
      name: "Settled Loans",
      value: totalSettledLoans,
      color: "#22c55e" // green
    }
  ];
  
  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as ChartData;
      return (
        <div className="glass-dark p-3 rounded-lg border border-white/10">
          <p className="text-sm font-semibold">{data.name}</p>
          <p className="text-sm">
            Amount: <span className="font-medium">{formatCurrency(data.value)}</span>
          </p>
          <p className="text-sm">
            Percentage: <span className="font-medium">
              {((data.value / totalLoanAmount) * 100).toFixed(1)}%
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6 h-full animate-fade-in animate-delay-200">
      <div className="flex items-center mb-6">
        <DollarSign className="h-5 w-5 mr-2 text-primary" />
        <h2 className="font-semibold text-lg">Loan Summary</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-5 flex flex-col justify-center">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm text-muted-foreground mb-1">Total Loan Amount</h3>
              <p className="text-2xl font-bold">{formatCurrency(totalLoanAmount)}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-sm">Current Loans</span>
                </div>
                <span className="text-sm font-medium">{formatCurrency(totalCurrentLoans)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Settled Loans</span>
                </div>
                <span className="text-sm font-medium">{formatCurrency(totalSettledLoans)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-7 h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                animationBegin={200}
                animationDuration={1000}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    className="transition-all duration-300 hover:opacity-80"
                    style={{ filter: "drop-shadow(0px 0px 6px rgba(0, 0, 0, 0.2))" }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="mt-6 space-y-2">
        <h3 className="text-sm font-medium">Recent Loan Activity</h3>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {[...report.currentLoans, ...report.settledLoans]
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 3)
            .map((loan, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
                <div className="flex items-center">
                  {loan.amount > 1000000 ? (
                    <Coins className="h-4 w-4 mr-2 text-muted-foreground" />
                  ) : (
                    <History className="h-4 w-4 mr-2 text-muted-foreground" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{loan.bank}</p>
                    <p className="text-xs text-muted-foreground">{loan.timePeriod} months</p>
                  </div>
                </div>
                <p className="text-sm font-medium">{formatCurrency(loan.amount)}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
