
import { BarChart2, PieChart, RefreshCw, Database, AlertCircle, CheckCircle } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const FeatureCard = ({ icon: Icon, title, description, delay }: { 
  icon: React.ElementType, 
  title: string, 
  description: string,
  delay: number
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div 
      ref={ref} 
      className={` font-sans glass-morphism rounded-xl p-6 transition-all duration-700 ease-out ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="font-sans w-12 h-12 rounded-full bg-fintech-500/20 flex items-center justify-center mb-5">
        <Icon className="w-6 h-6 text-fintech-400" />
      </div>
      <h3 className="font-sans text-xl font-medium text-white mb-3">{title}</h3>
      <p className="text-white/70 font-sans">{description}</p>
    </div>
  );
};

const Features = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="features" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-4">
            <span className="text-xs font-medium text-white/80 font-sans">Advanced Features</span>
          </div>
          <h2 
            ref={ref}
            className={`text-3xl md:text-4xl font-bold text-gradient mb-6 transition-all duration-700 ease-out font-sans ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            Unified Credit Intelligence
          </h2>
          <p className={`font-sans text-lg text-white/70 max-w-2xl mx-auto transition-all duration-700 ease-out ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`} style={{ transitionDelay: '100ms' }}>
            Our platform delivers comprehensive credit analytics with real-time processing and seamless bureau integration
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <FeatureCard 
            icon={BarChart2} 
            title="Normalized Scoring" 
            description="Advanced algorithm normalizes diverse credit bureau scores into a unified, comprehensive profile for better risk assessment."
            delay={150}
          />
          
          <FeatureCard 
            icon={RefreshCw} 
            title="Real-time Updates" 
            description="Webhook-driven infrastructure ensures credit information is always current with automated notifications of score changes."
            delay={300}
          />
          
          <FeatureCard 
            icon={AlertCircle} 
            title="Downtime Resilience" 
            description="Redis-powered caching system maintains service continuity even when credit bureaus experience outages."
            delay={450}
          />
          
          <FeatureCard 
            icon={PieChart} 
            title="Advanced Visualization" 
            description="Interactive dashboards provide clear visual representation of credit data, making complex information accessible."
            delay={600}
          />
          
          <FeatureCard 
            icon={Database} 
            title="RAG Query System" 
            description="AI-powered suggestion engine offers personalized lending recommendations based on comprehensive borrower data."
            delay={750}
          />
          
          <FeatureCard 
            icon={CheckCircle} 
            title="Repayment Prediction" 
            description="Machine learning models analyze borrower profiles to forecast loan repayment probability with high accuracy."
            delay={900}
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
