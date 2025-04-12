
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  useEffect(() => {
    document.body.classList.add('bg-background');
    document.body.style.backgroundImage = 'radial-gradient(circle at 90% 10%, rgba(3, 105, 161, 0.15) 0%, transparent 40%)';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.minHeight = '100vh';
    
    return () => {
      document.body.classList.remove('bg-background');
      document.body.style.backgroundImage = '';
      document.body.style.backgroundAttachment = '';
      document.body.style.minHeight = '';
    };
  }, []);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col">
      <div className="mb-10">
        <Link to="/" className="inline-flex items-center text-white/70 hover:text-white transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>
      </div>
      
      <div className="w-full max-w-3xl mx-auto glass-morphism rounded-xl p-8 md:p-10 animate-fade-in">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-fintech-500/20 mb-6">
            <CheckCircle className="h-8 w-8 text-fintech-400" />
          </div>
          
          <h1 className="text-2xl  font-bold text-gradient mb-4">
            Loan Application Submitted
          </h1>
          
          <p className="text-white/70 mb-8 max-w-md mx-auto">
            Your loan application has been successfully submitted and is now being processed.
          </p>
          
          <div className="glass-morphism rounded-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <Clock className="h-5 w-5 text-fintech-400 mr-2" />
              <span className="text-white font-medium">Status: </span>
              <span className="ml-2 text-yellow-400 font-medium">Awaiting approval</span>
            </div>
            <p className="text-white/70 text-sm">
              Financial institutions will review your application and documents. 
              You will receive updates via email when there are changes to your application status.
            </p>
          </div>
          
          <Link to="/">
            <Button className="w-full sm:w-auto">Return to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
