import { BureauType, CreditReport } from "@/types/credit";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { ChartBarIcon } from "lucide-react";
import { useState } from "react";

interface ComparisonChartProps {
  reports: Record<BureauType, CreditReport>;
}

interface ChartData {
  bureau: BureauType;
  score: number;
}

export default function ComparisonChart({ reports }: ComparisonChartProps) {
  const [activeBar, setActiveBar] = useState<string | null>(null);

  const chartData: ChartData[] = Object.values(reports).map((report) => ({
    bureau: report.bureau,
    score: report.creditScore,
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as ChartData;
      return (
        <div className="glass-dark p-3 rounded-lg border border-white/10">
          <p className="text-sm font-semibold">{data.bureau}</p>
          <p className="text-sm">
            Score: <span className="font-medium">{data.score}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6 h-full animate-fade-in animate-delay-400">
      <div className="flex items-center mb-6">
        <ChartBarIcon className="h-5 w-5 mr-2 text-primary" />
        <h2 className="font-semibold text-lg">Bureau Comparison</h2>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
            barGap={12}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(255, 255, 255, 0.1)"
            />
            <XAxis
              dataKey="bureau"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />
            <YAxis
              domain={[300, 900]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ opacity: 0.15 }} />
            <Bar
              dataKey="score"
              radius={[10, 10, 0, 0]}
              maxBarSize={70}
              onMouseEnter={(data) => setActiveBar(data.bureau)}
              onMouseLeave={() => setActiveBar(null)}
            >
              {chartData.map((entry) => (
                <Bar
                  key={`bar-${entry.bureau}`}
                  dataKey="score"
                  fill={`url(#color-${entry.bureau})`} // Properly applying gradient fill
                />
              ))}
            </Bar>

            {/* Define gradient fills for each bar */}
            <defs>
              {chartData.map((entry) => (
                <linearGradient
                  key={`grad-${entry.bureau}`}
                  id={`color-${entry.bureau}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor={
                      entry.bureau === "CIBIL"
                        ? "#3b82f6" // Light Blue for CIBIL
                        : entry.bureau === "Experian"
                        ? "#22c55e" // Green for Experian
                        : entry.bureau === "Equifax"
                        ? "#8b5cf6" // Purple for Equifax
                        : "#f59e0b" // Orange for others
                    }
                    stopOpacity={0.9}
                  />
                  <stop
                    offset="100%"
                    stopColor={
                      entry.bureau === "CIBIL"
                        ? "#1e40af" // Darker Blue for CIBIL
                        : entry.bureau === "Experian"
                        ? "#166534" // Darker Green for Experian
                        : entry.bureau === "Equifax"
                        ? "#5b21b6" // Darker Purple for Equifax
                        : "#b45309" // Darker Orange for others
                    }
                    stopOpacity={0.3}
                  />
                </linearGradient>
              ))}
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-center text-sm mt-3 text-muted-foreground">
        Credit scores may vary between bureaus due to different data sources and calculation methodologies.
      </div>
    </div>
  );
}
