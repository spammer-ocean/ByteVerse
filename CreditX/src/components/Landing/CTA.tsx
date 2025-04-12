
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInView } from 'react-intersection-observer';

const CTA = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  return (
    <section ref={ref} className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-fintech-900/30 via-transparent to-transparent"></div>
      
      <div 
        className={`container mx-auto px-4 md:px-6 relative z-10 transition-all duration-1000 ease-out ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}
      >
        <div className="glass-morphism rounded-2xl p-8 md:p-12 overflow-hidden relative">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-fintech-700/20 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-fintech-800/30 blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left max-w-md">
              <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
                Ready to Transform Your Lending?
              </h2>
              <p className="text-lg text-white/70 mb-0">
                Join financial institutions using CreditX to make faster, smarter lending decisions.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" className="shadow-lg shadow-fintech-500/20 hover:shadow-fintech-500/40 min-w-[180px]">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="http://localhost:8080/">
                <Button variant="outline" size="lg" className="border-white/20 hover:bg-white/10 hover:border-white/40 min-w-[180px]">
                  For Institutions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
