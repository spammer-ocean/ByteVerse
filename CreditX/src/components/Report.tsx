import { motion } from "framer-motion";
import {
  FileText,
  ChevronRight,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  DollarSign,
  Calendar,
  Building,
  Lock,
} from "lucide-react";
import CreditScoreIndicator from "@/components/CreditScoreIndicator";
import ReportSection from "@/components/ReportSection";
import TermItem from "@/components/TermItem";
import DecisionBadge from "@/components/DecisionBadge";
import { useEffect, useState } from "react";

const defaultReportData = {
  "Applicant Profile Summary":
    "F",

  "Creditworthiness Assessment":
    "F",

  "Identified Risks":
    "F",

  "Final Lending Decision": "F",

  "Justification for the Decision":
    "F",

  "Recommended Lending Terms": {
    "Maximum Loan Amount": "F",
    "Interest Rate Range": "F",
    "Tenure": "F",
    "Collateral Requirement": "F"
  },

  "Risk Mitigation Suggestions": "F",
};

// Default bureau credit scores
const defaultBureauScores = [
  { bureau: "CRIF Highmark", score: 760 },
  { bureau: "Equifax", score: 770 },
  { bureau: "Experian", score: 780 },
];

const Report = ({ req_id, user }) => {
  const [reportData, setReportData] = useState(defaultReportData);
  const [bureauScores, setBureauScores] = useState(defaultBureauScores);
  const [userData, setUserData] = useState({
    first_name: "F",
    last_name: "F",
    pan: "F",
    loan_type: "F",
    status: "F"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:4040/request/get?request_id=${req_id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        console.log("API Response:", data);
        
        if (data) {
          setUserData({
            first_name: user?.name?.split(' ')[0] || "F",
            last_name: user?.name?.split(' ').slice(1).join(' ') || "F",
            pan: user?.pancard || "F",
            loan_type: data.loan_type || "F",
            status: data.status || "F"
          });

          if (data.creditx_score) {
            const creditxScore = data.creditx_score;
            
            const newBureauScores = [];
            const scoreMatch = creditxScore["Creditworthiness Assessment"]?.match(/credit score is (\d+)/i);
            
            if (scoreMatch && scoreMatch[1]) {
              const score = parseInt(scoreMatch[1]);
              newBureauScores.push({ bureau: "CRIF Highmark", score: score - 10 });
              newBureauScores.push({ bureau: "Equifax", score: score });
              newBureauScores.push({ bureau: "Experian", score: score + 10 });
              setBureauScores(newBureauScores);
            }
            
            setReportData({
              "Applicant Profile Summary": creditxScore["Applicant Profile Summary"] || defaultReportData["Applicant Profile Summary"],
              "Creditworthiness Assessment": creditxScore["Creditworthiness Assessment"] || defaultReportData["Creditworthiness Assessment"],
              "Identified Risks": creditxScore["Identified Risks"] || defaultReportData["Identified Risks"],
              "Final Lending Decision": creditxScore["Final Lending Decision"] || defaultReportData["Final Lending Decision"],
              "Justification for the Decision": creditxScore["Justification for the Decision"] || defaultReportData["Justification for the Decision"],
              "Recommended Lending Terms": creditxScore["Recommended Lending Terms"] || defaultReportData["Recommended Lending Terms"],
              "Risk Mitigation Suggestions": creditxScore["Risk Mitigation Suggestions"] || defaultReportData["Risk Mitigation Suggestions"]
            });
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [req_id, user]);

  if (loading) {
    return (
      <main className="p-6 h-[calc(100vh-64px)] overflow-auto">
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse-slow flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-primary/20 animate-pulse mb-4"></div>
            <p className="text-foreground/60">Loading report data...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 h-[calc(100vh-64px)] overflow-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6 flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        <h1 className="text-2xl font-semibold">Credit Assessment Report</h1>
      </motion.div>

      <motion.div className="flex items-center gap-1 text-sm text-muted-foreground mb-8">
        <span>Reports</span>
        <ChevronRight className="h-4 w-4" />
        <span>Credit Assessment</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{userData.first_name} {userData.last_name}</span>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          className="glass-premium glass-section p-5 lg:col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-lg">
              {userData.first_name.charAt(0)}{userData.last_name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{userData.first_name} {userData.last_name}</h2>
              <p className="text-foreground/60 text-sm">
                PAN: {userData.pan} | {userData.loan_type}
              </p>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="text-foreground/80 space-y-1">
              <p>{reportData["Applicant Profile Summary"]}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="glass-premium relative flex flex-col p-5 backdrop-blur-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}>
          <div className="flex items-center mb-5">
            <div className="h-5 w-1.5 bg-status-pending rounded-full mr-3"></div>
            <h2 className="text-xl font-semibold">Final Decision</h2>
          </div>

          <div className="flex items-center justify-center py- mb-4">
            <DecisionBadge decision={reportData["Final Lending Decision"]} />
          </div>

          <div className="mt-auto border-t border-white/10 pt-4">
            <p className="text-sm text-white/70 font-medium mb-2">
              Decision Summary:
            </p>
            <p className="text-sm leading-relaxed">
              {reportData["Justification for the Decision"].substring(0, 500)}
              {reportData["Justification for the Decision"].length > 500 ? "..." : ""}
            </p>
          </div>
        </motion.div>
      </div>

      <ReportSection
        title="Credit Bureau Scores"
        delay={0.2}
        className="mb-6 glass-premium">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bureauScores.map((item) => (
            <CreditScoreIndicator
              key={item.bureau}
              bureau={item.bureau}
              score={item.score}
            />
          ))}
        </div>
      </ReportSection>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ReportSection title="Creditworthiness Assessment" delay={0.3}>
          <p className="text-sm leading-relaxed">
            {reportData["Creditworthiness Assessment"]}
          </p>
        </ReportSection>

        <ReportSection title="Identified Risks" delay={0.4}>
          <p className="text-sm leading-relaxed">
            {reportData["Identified Risks"]}
          </p>
          {reportData["Risk Mitigation Suggestions"] !== "None" && (
            <div className="mt-4 p-3 bg-status-rejected/10 border border-status-rejected/20 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-status-rejected shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-status-rejected mb-1">
                    High Risk Factors
                  </h4>
                  <ul className="list-disc pl-4 text-sm space-y-1">
                    <li>High-value property transactions</li>
                    <li>Sale of securities and mutual funds</li>
                    <li>Potential market fluctuations</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </ReportSection>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <ReportSection
          title="Recommended Lending Terms"
          delay={0.5}
          className="lg:col-span-2"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TermItem
              term="Maximum Loan Amount"
              value={reportData["Recommended Lending Terms"]["Maximum Loan Amount"]}
              icon={<DollarSign className="h-5 w-5" />}
            />
            <TermItem
              term="Interest Rate Range"
              value={reportData["Recommended Lending Terms"]["Interest Rate Range"]}
              icon={<CreditCard className="h-5 w-5" />}
            />
            <TermItem
              term="Tenure"
              value={reportData["Recommended Lending Terms"]["Tenure"]}
              icon={<Calendar className="h-5 w-5" />}
            />
            <TermItem
              term="Collateral Requirement"
              value={reportData["Recommended Lending Terms"]["Collateral Requirement"]}
              icon={<Building className="h-5 w-5" />}
            />
          </div>
        </ReportSection>

        <ReportSection title="Risk Mitigation" delay={0.6}>
          <div className="flex items-start gap-3 mb-4">
            <Lock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm">
              {reportData["Risk Mitigation Suggestions"]}
            </p>
          </div>

          {reportData["Risk Mitigation Suggestions"] !== "None" ? (
            <div className="p-3 bg-status-approved/10 border border-status-approved/20 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-status-approved shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-status-approved mb-1">
                    Recommended Actions
                  </h4>
                  <ul className="list-disc pl-4 text-sm space-y-1">
                    <li>Mandatory collateral</li>
                    <li>Guarantor requirement</li>
                    <li>EMI auto-debit mandates</li>
                    <li>Shorter tenure</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-status-approved/10 border border-status-approved/20 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-status-approved shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-status-approved mb-1">
                    No Risk Mitigation Needed
                  </h4>
                  <p className="text-sm">
                    Based on the applicant's strong profile, no special risk mitigation measures are required.
                  </p>
                </div>
              </div>
            </div>
          )}
        </ReportSection>
      </div>

      <ReportSection
        title="Justification for Decision"
        delay={0.7}
        className="mb-6"
        icon={<ClipboardList className="h-5 w-5 text-primary" />}>
        <div className="flex items-start gap-4">
          <p className="text-sm leading-relaxed">
            {reportData["Justification for the Decision"]}
          </p>
        </div>
      </ReportSection>
    </main>
  );
};

export default Report;