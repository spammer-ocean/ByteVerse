
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import BackgroundEffect from "@/components/BackgroundEffect";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 10 }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background overflow-hidden">
      <BackgroundEffect />
      <motion.div 
        className="relative"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl opacity-30 rounded-full transform rotate-12"></div>
        <motion.div 
          className="glass-card p-10 max-w-md text-center relative overflow-hidden backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div 
            className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent/10 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.div 
            className="mb-6 flex justify-center"
            variants={itemVariants}
          >
            <motion.div 
              className="rounded-full bg-destructive/10 p-4 shadow-[inset_0_0_10px_rgba(0,0,0,0.2)]"
              animate={{
                boxShadow: [
                  "inset 0 0 10px rgba(0,0,0,0.2)", 
                  "inset 0 0 20px rgba(239,68,68,0.3)", 
                  "inset 0 0 10px rgba(0,0,0,0.2)"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.div
                animate={{
                  rotate: [0, 5, 0, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 3
                }}
              >
                <AlertTriangle className="h-12 w-12 text-destructive drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              </motion.div>
            </motion.div>
          </motion.div>
          <motion.h1 
            className="text-6xl font-bold mb-4 bg-gradient-to-r from-destructive to-destructive/70 bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]"
            variants={itemVariants}
          >
            404
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground mb-8 relative"
            variants={itemVariants}
          >
            The page you're looking for doesn't exist or has been moved.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Button 
              asChild 
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)] transition-all duration-300 border border-white/10"
            >
              <motion.a 
                href="/" 
                className="px-8 py-2 relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className="relative z-10">Return to Dashboard</span>
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
              </motion.a>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
