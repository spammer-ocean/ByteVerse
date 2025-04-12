import { motion } from "framer-motion";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import AnimatedGradient from "@/components/AnimatedGradient";
import BackgroundEffect from "@/components/BackgroundEffect";
import ChatInterface from "@/components/ChatInterface";
import { useLocation } from "react-router-dom";

const Chat = () => {
      const location = useLocation();
      const state = location.state || {};

      console.log(state)
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
        <Sidebar title="Chat" />

        <div className="flex-1 pl-64">
          <Header />
          <main className="p-6 h-[calc(100vh-64px)]">
            <div className="h-full flex flex-col">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-4"
              >
                <h1 className="text-2xl font-semibold text-foreground">Financial Assistant</h1>
                <p className="text-sm text-foreground/60">Ask questions about your finances and get personalized advice</p>
              </motion.div>
              
              <div className="flex-1">
                <ChatInterface request_id={state.request_id}/>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AnimatedGradient>
  );
};

export default Chat;