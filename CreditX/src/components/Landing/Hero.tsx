
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Shield, Clock, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const circleRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!circleRef.current) return;
      
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      // Subtle movement for better aesthetics
      const moveX = (x - 0.5) * 20;
      const moveY = (y - 0.5) * 20;
      
      circleRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden pt-20 pb-20 flex items-center">
      {/* Background effects */}
      <div className="absolute inset-0 z-0">
        <div ref={circleRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-fintech-700/30 via-fintech-600/20 to-transparent blur-3xl opacity-30 transition-all duration-300 ease-out"></div>
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-fintech-800/20 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-fintech-900/20 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl  font-bold font-sans text-gradient mb-6 animate-fade-in" style={{animationDelay: '100ms'}}>
            A Single Source of <br className="hidden md:block" /> Credit Truth
          </h1>
          
          <p className="text-lg md:text-xl text-white/70 max-w-3xl font-sans mb-8 animate-fade-in" style={{animationDelay: '200ms'}}>
            CreditX unifies and normalizes credit data from multiple bureaus, 
            giving financial institutions a comprehensive view for smarter lending decisions.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 animate-fade-in" style={{animationDelay: '300ms'}}>
            <Link to="/register">
              <Button size="lg" className="rounded-full shadow-lg shadow-fintech-500/20 hover:shadow-fintech-500/40 transition-all px-6 py-6">
                Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/users">
              <Button variant="outline" size="lg" className="rounded-full border-white/20 hover:bg-white/5 hover:border-white/40 transition-all px-6 py-6">
                For Financial Institutions
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 w-full">
            <div className="glass-morphism rounded-xl p-6 text-center animate-slide-in-bottom" style={{animationDelay: '400ms'}}>
              <div className="w-12 h-12 rounded-full bg-fintech-500/20 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-fintech-400" />
              </div>
              <h3 className="text-white font-sans mb-1">Normalized Scoring</h3>
              <p className="text-white/60 text-sm font-sans">Unified credit profiles across bureaus</p>
            </div>
            
            <div className="glass-morphism rounded-xl p-6 text-center animate-slide-in-bottom" style={{animationDelay: '500ms'}}>
              <div className="w-12 h-12 rounded-full bg-fintech-500/20 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-fintech-400" />
              </div>
              <h3 className="text-white font-medium mb-1">100% Uptime</h3>
              <p className="text-white/60 text-sm">Resilient to bureau downtime</p>
            </div>
            
            <div className="glass-morphism rounded-xl p-6 text-center animate-slide-in-bottom" style={{animationDelay: '600ms'}}>
              <div className="w-12 h-12 rounded-full bg-fintech-500/20 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-fintech-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Real-time Updates</h3>
              <p className="text-white/60 text-sm">Instant score adjustments</p>
            </div>
            
            <div className="glass-morphism rounded-xl p-6 text-center animate-slide-in-bottom" style={{animationDelay: '700ms'}}>
              <div className="w-12 h-12 rounded-full bg-fintech-500/20 flex items-center justify-center mx-auto mb-4">
                <Activity className="w-6 h-6 text-fintech-400" />
              </div>
              <h3 className="text-white font-medium mb-1">AI Insights</h3>
              <p className="text-white/60 text-sm">Smart lending recommendations</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
