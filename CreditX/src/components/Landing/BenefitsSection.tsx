
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { 
  Clock, Shield, TrendingUp, BarChart3, 
  PieChart, Brain, RefreshCw, DollarSign
} from 'lucide-react';

const BenefitCard = ({ 
  icon: Icon, 
  title, 
  description, 
  delay 
}: { 
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  return (
    <div 
      ref={ref} 
      className={`flex items-start space-x-4 transition-all duration-700 ease-out font-sans ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-lg glass-morphism flex items-center justify-center font-sans">
        <Icon className="w-6 h-6 text-fintech-400 font-sans" />
      </div>
      <div>
        <h3 className="text-lg font-medium text-white mb-1 font-sans">{title}</h3>
        <p className="text-white/70 text-sm font-sans">{description}</p>
      </div>
    </div>
  );
};

const BenefitsSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  return (
    <section id="benefits" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-4">
            <span className="text-xs font-medium text-white/80 font-sans">Institution Benefits</span>
          </div>
          <h2 
            ref={ref}
            className={`text-3xl md:text-4xl  font-bold text-gradient mb-6 transition-all duration-700 ease-out font-sans ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            Elevate Your Lending Operations
          </h2>
          <p className={`text-lg text-white/70 max-w-2xl mx-auto transition-all duration-700 ease-out font-sans ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`} style={{ transitionDelay: '100ms' }}>
            CreditX transforms how financial institutions assess and manage credit risk
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
          <div className="lg:col-span-2 h-full">
            <div className="h-full glass-morphism rounded-xl p-8 md:p-10 overflow-hidden relative group">
              <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-fintech-700/20 blur-3xl group-hover:bg-fintech-600/30 transition-all duration-700"></div>
              <h3 className="text-2xl font-medium text-white mb-4 relative z-10 font-sans ">Comprehensive Credit Intelligence</h3>
              <p className="text-white/70 mb-6 relative z-10 font-sans">
                Access a unified view of borrower creditworthiness that synthesizes data from multiple bureaus, 
                eliminating inconsistencies and providing a more accurate risk assessment foundation.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                <BenefitCard 
                  icon={BarChart3} 
                  title="Normalized Scoring" 
                  description="Standardized credit scores across multiple bureaus"
                  delay={150}
                />
                <BenefitCard 
                  icon={Shield} 
                  title="Resilient Systems" 
                  description="Continue operations during bureau downtime"
                  delay={300}
                />
              </div>
            </div>
          </div>
          
          <div className="h-full">
            <div className="h-full glass-morphism rounded-xl p-8 overflow-hidden relative group">
              <div className="absolute -right-20 -bottom-20 w-40 h-40 rounded-full bg-fintech-700/20 blur-3xl group-hover:bg-fintech-600/30 transition-all duration-700"></div>
              <h3 className="text-xl  font-medium text-white mb-4 relative z-10 font-sans">Enhanced Decision-Making</h3>
              <p className="text-white/70 mb-6 relative z-10 font-sans">
                Leverage advanced visualization tools and AI-powered insights to make more informed lending decisions.
              </p>
              <div className="space-y-6 relative z-10">
                <BenefitCard 
                  icon={PieChart} 
                  title="Visual Analytics" 
                  description="Interactive dashboards for credit data"
                  delay={450}
                />
                <BenefitCard 
                  icon={Brain} 
                  title="AI Recommendations" 
                  description="Intelligent lending suggestions"
                  delay={600}
                />
              </div>
            </div>
          </div>
          
          <div className="h-full">
            <div className="h-full glass-morphism rounded-xl p-8 overflow-hidden relative group">
              <div className="absolute -right-20 -bottom-20 w-40 h-40 rounded-full bg-fintech-700/20 blur-3xl group-hover:bg-fintech-600/30 transition-all duration-700"></div>
              <h3 className="text-xl  font-medium text-white mb-4 relative z-10 font-sans">Operational Excellence</h3>
              <p className="text-white/70 mb-6 relative z-10">
                Streamline lending operations with real-time updates and predictive repayment modeling.
              </p>
              <div className="space-y-6 relative z-10">
                <BenefitCard 
                  icon={RefreshCw} 
                  title="Real-time Updates" 
                  description="Instant notification of score changes"
                  delay={750}
                />
                <BenefitCard 
                  icon={TrendingUp} 
                  title="Repayment Prediction" 
                  description="Forecast borrower repayment probability"
                  delay={900}
                />
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-4">
            <div className="glass-morphism rounded-xl p-8 md:p-10 overflow-hidden relative group">
              <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-fintech-700/20 blur-3xl group-hover:bg-fintech-600/30 transition-all duration-700"></div>
              <h3 className="text-2xl  font-medium text-white mb-6 relative z-10 font-sans">Business Impact</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative z-10">
                <div className="text-center p-6 neo-blur rounded-lg">
                  <div className="text-4xl  font-bold text-gradient-blue mb-2">42%</div>
                  <p className="text-white/70 text-sm font-sans">Reduction in risk assessment time</p>
                </div>
                
                <div className="text-center p-6 neo-blur rounded-lg">
                  <div className="text-4xl font-display font-bold text-gradient-blue mb-2">28%</div>
                  <p className="text-white/70 text-sm">Decrease in default rates</p>
                </div>
                
                <div className="text-center p-6 neo-blur rounded-lg">
                  <div className="text-4xl font-display font-bold text-gradient-blue mb-2">99.9%</div>
                  <p className="text-white/70 text-sm">System uptime for credit decisions</p>
                </div>
                
                <div className="text-center p-6 neo-blur rounded-lg">
                  <div className="text-4xl font-display font-bold text-gradient-blue mb-2">3.5x</div>
                  <p className="text-white/70 text-sm">ROI for financial institutions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
