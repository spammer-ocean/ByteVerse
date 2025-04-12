import { motion } from "framer-motion";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ReportContent from "@/components/Report";
import AnimatedGradient from "@/components/AnimatedGradient";
import BackgroundEffect from "@/components/BackgroundEffect";
import { useLocation } from "react-router-dom";

const Report = () => {
  const location = useLocation();
  const state = location.state || {};

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
        <Sidebar title="Reports" />

        <div className="flex-1 pl-64">
          <Header />
          <ReportContent req_id={state.req_id} user={state.user}/>
        </div>
      </div>
    </AnimatedGradient>
  );
};

export default Report;