import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import BureauSelector from "@/components/BureauSelector";
import AnimatedGradient from "@/components/AnimatedGradient";
import CreditSummary from "@/components/CreditSummary";
import UserDetails from "@/components/UserDetails";
import ComparisonChart from "@/components/ComparisonChart";
import LoanSummary from "@/components/LoanSummary";
import BackgroundEffect from "@/components/BackgroundEffect";
import { BureauType } from "@/types/credit";
import { mockCreditReports } from "@/data/mockData";
import { staggerContainer, fadeIn } from "@/utils/animation-variants";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";



const Index = () => {
  const location = useLocation();
  const state = location.state || {};
  const [creditData, setCreditData] = useState(mockCreditReports);
  const [loanType, setLoanType] = useState(state.loan_type || "personal");
  const [normal, setNormal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const pan = state.pan_id;
        // If pan doesn't exist, you might want to handle that case
        if (!pan) {
          console.error("No PAN ID provided");
          setIsLoading(false);
          return;
        }
  
        // Fetch all data in parallel for better performance
        const [cibilRes, equifaxRes, experianRes, crifRes] = await Promise.all([
          axios.get(`http://127.0.0.1:8000/cibil/?pan_id=${pan}`),
          axios.get(`http://127.0.0.1:8000/equifax/?pan_id=${pan}`),
          axios.get(`http://127.0.0.1:8000/experian/?pan_id=${pan}`),
          axios.get(`http://127.0.0.1:8000/crif_highmark/?pan_id=${pan}`)
        ]);
  
        // Extract scores
        const cibilScore = cibilRes.data.message.CREDIT_SCORE;
        const equifaxScore = equifaxRes.data.message.CREDIT_SCORE;
        const experianScore = experianRes.data.message.CREDIT_SCORE;
        const crifScore = crifRes.data.message.CREDIT_SCORE;
        
        // Calculate normalized score
        const normalizedScore = getNormalizedScore(
          cibilScore,
          crifScore,
          equifaxScore,
          experianScore,
          loanType
        );
        
        // Update normalized score state
        setNormal(normalizedScore);
        
        // Fetch summary data
        const summaryResponse = await axios.get(`http://localhost:8000/np`);
        console.log("Summary data:", summaryResponse.data);
        
        // Create a deep copy of the summary data
        const updatedCreditData = JSON.parse(JSON.stringify(summaryResponse.data.message));
        
        // Update the normalized score in the data
        if (updatedCreditData["Normalized Evaluation"]) {
          updatedCreditData["Normalized Evaluation"].creditScore = normalizedScore;
        }
        
        // Update state with the new data
        setCreditData(updatedCreditData);
      } catch (error) {
        console.error("Error fetching credit data:", error);
        
        // Fallback to mock data in case of error
        // const updatedMockData = JSON.parse(JSON.stringify(mockCreditReports));
        // if (updatedMockData["Normalized Evaluation"]) {
        //   updatedMockData["Normalized Evaluation"].creditScore = normal;
        // }
        // setCreditData(updatedMockData);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [state.pan_id, state.loan_type, loanType]); // Include dependencies

  function getNormalizedScore(cibil, crif, equifax, experian, loanType) {
    const weightConfig = {
        "personal": { cibil: 0.5, crif: 0.2, equifax: 0.2, experian: 0.1 },
        "business": { cibil: 0.3, crif: 0.4, equifax: 0.2, experian: 0.1 },
        "home": { cibil: 0.4, crif: 0.3, equifax: 0.2, experian: 0.1 },
        "car": { cibil: 0.35, crif: 0.25, equifax: 0.3, experian: 0.1 },
        "education": { cibil: 0.3, crif: 0.3, equifax: 0.25, experian: 0.15 }
    };

    if (!weightConfig[loanType]) {
        throw new Error("Invalid loan type provided.");
    }

    const weights = weightConfig[loanType];

    const normalizedScore = (cibil * weights.cibil) +(crif * weights.crif) + (equifax * weights.equifax) + (experian * weights.experian);

    return normalizedScore;
}

  const [selectedBureau, setSelectedBureau] =
    useState<BureauType>("Normalized Evaluation");

  const handleSelectBureau = (bureau: BureauType) => {
    setSelectedBureau(bureau);
  };

  const currentReport = creditData[selectedBureau];

  return (
    <AnimatedGradient>
    <div className="flex min-h-screen bg-background overflow-hidden">
      <BackgroundEffect />
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-[10%] left-[5%] w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{
            x: [0, 10, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-[15%] right-[10%] w-80 h-80 bg-accent/5 rounded-full blur-3xl"
          animate={{
            x: [0, -15, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute top-[40%] right-[20%] w-64 h-64 bg-bureau-cibil/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </div>
        <Sidebar title="Dashboard"/>

      <div className="flex-1 pl-64">
        <Header />

          <motion.main
            className="px-8 py-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible">
            <div className="grid grid-cols-12 gap-6">
              {/* Top row */}
              <motion.div
                className="col-span-12 lg:col-span-8"
                variants={fadeIn}>
                <CreditSummary report={currentReport} />
              </motion.div>

              <motion.div
                className="col-span-12 lg:col-span-4"
                variants={fadeIn}>
                <BureauSelector
                  bureauReports={creditData}
                  selectedBureau={selectedBureau}
                  onSelectBureau={handleSelectBureau}
                />
              </motion.div>

              {/* Middle row */}
              <motion.div
                className="col-span-12 lg:col-span-4"
                variants={fadeIn}>
                <UserDetails report={currentReport} />
              </motion.div>

              <motion.div
                className="col-span-12 lg:col-span-8"
                variants={fadeIn}>
                <ComparisonChart reports={creditData} />
              </motion.div>

              {/* Bottom row */}
              <motion.div className="col-span-12" variants={fadeIn}>
                <LoanSummary report={currentReport} />
              </motion.div>
            </div>
          </motion.main>
        </div>
      </div>
    </AnimatedGradient>
  );
};

export default Index;