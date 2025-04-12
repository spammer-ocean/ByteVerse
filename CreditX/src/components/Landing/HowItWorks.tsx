
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';

const ProcessStep = ({ number, title, description, isLast = false, delay }: {
  number: number,
  title: string,
  description: string,
  isLast?: boolean,
  delay: number
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  return (
    <div ref={ref} className="flex">
      <div className="flex flex-col items-center mr-6">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-700 ease-out font-sans ${
          inView ? 'bg-fintech-500 opacity-100 scale-100' : 'bg-fintech-800 opacity-0 scale-50'
        }`} style={{ transitionDelay: `${delay}ms` }}>
          <span className="text-sm font-medium text-black font-sans">{number}</span>
        </div>
        {!isLast && (
          <div className={`w-0.5 grow bg-fintech-800 mt-2 transition-all duration-1000 ease-out font-sans ${
            inView ? 'opacity-100 h-full' : 'opacity-0 h-0'
          }`} style={{ transitionDelay: `${delay + 200}ms` }}></div>
        )}
      </div>
      <div className={`pb-10 transition-all duration-700 ease-out font-sans ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`} style={{ transitionDelay: `${delay}ms` }}>
        <h3 className="text-xl  font-medium text-white mb-2 font-sans">{title}</h3>
        <p className="text-white/70">{description}</p>
      </div>
    </div>
  );
};

const HowItWorks = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  return (
    <section id="how-it-works" className="py-20 relative overflow-hidden">
      <div className="font-sans absolute inset-0 bg-gradient-to-b from-transparent via-fintech-900/10 to-transparent"></div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-4">
            <span className="text-xs font-medium text-white/80">Process</span>
          </div>
          <h2 
            ref={ref}
            className={`font-sans text-3xl md:text-4xl  font-bold text-gradient mb-6 transition-all duration-700 ease-out ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            How CreditX Symphony Works
          </h2>
          <p className={`font-sans text-lg text-white/70 max-w-2xl mx-auto transition-all duration-700 ease-out ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`} style={{ transitionDelay: '100ms' }}>
            Our platform seamlessly integrates with multiple credit bureaus to provide unified intelligence
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <ProcessStep 
            number={1} 
            title="Data Collection" 
            description="Borrowers submit financial documents, including bank statements, income tax returns, and personal information through our secure portal."
            delay={100}
          />
          
          <ProcessStep 
            number={2} 
            title="Multi-Bureau Integration" 
            description="Our system simultaneously connects with multiple credit bureaus via API, retrieving comprehensive credit reports and scores."
            delay={300}
          />
          
          <ProcessStep 
            number={3} 
            title="Normalization Algorithm" 
            description="Proprietary algorithms standardize diverse credit scores into a unified index, adjusting for each bureau's scoring methodology."
            delay={500}
          />
          
          <ProcessStep 
            number={4} 
            title="Loan-Specific Analysis" 
            description="The platform tailors credit evaluations to the specific loan type requested, prioritizing relevant credit factors."
            delay={700}
          />
          
          <ProcessStep 
            number={5} 
            title="Institution Decision Support" 
            description="Financial institutions receive a comprehensive dashboard with normalized scores, visualizations, and AI-powered insights."
            delay={900}
          />
          
          <ProcessStep 
            number={6} 
            title="Real-time Monitoring" 
            description="After decision-making, our system maintains vigilance, providing real-time updates for any changes in the borrower's credit profile."
            isLast={true}
            delay={1100}
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
