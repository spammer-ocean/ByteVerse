import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  PiggyBank,
  Building,
  Wallet,
  DollarSign,
  LineChart,
  Shield,
  CreditCard,
  IdCard,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { api } from "@/api";
import ButtonLoader from "@/components/Landing/ButtonLoader";
import LoadingModal from "@/components/Landing/LoadingModal";

const FinancialPlanningForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [formData, setFormData] = useState({
    retirement_planning: "",
    insurance: "",
    bank_accounts: "",
    monthly_savings: "",
    monthly_emis: "",
    investment_channels: "",
    existing_loans: "",
    pan_card_number: ""
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validation
      const requiredFields = [
        "retirement_planning",
        "bank_accounts",
        "monthly_savings",
        "monthly_emis",
        "pan_card_number"
      ];
      
      const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
      
      if (missingFields.length > 0) {
        throw new Error("Please fill in all required fields");
      }
      
      // Example API call
      const response = await api.post("http://localhost:4040/assistant/faForm", formData);
      console.log("Form data submitted:", response.data);
      
      toast({
        title: "Plan submitted",
        description: "Your financial planning information has been submitted successfully.",
      });
      
      // Set submission success state to true
      setSubmissionSuccess(true);
      
    } catch (error) {
      console.error("Error submitting form data:", error);
      toast({
        title: "Submission error",
        description: error instanceof Error ? error.message : "There was an error submitting your information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const redirectToChat = () => {
    // Navigate to chat interface with PAN card number as a parameter
    navigate(`/chat/${encodeURIComponent(formData.pan_card_number)}`);
  };

  useEffect(() => {
    document.body.classList.add("bg-background");
    document.body.style.backgroundImage =
      "radial-gradient(circle at 90% 10%, rgba(3, 105, 161, 0.15) 0%, transparent 40%)";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.minHeight = "100vh";

    return () => {
      document.body.classList.remove("bg-background");
      document.body.style.backgroundImage = "";
      document.body.style.backgroundAttachment = "";
      document.body.style.minHeight = "";
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c1218]">
      <LoadingModal open={loading} text="Processing information" />

      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col">
        <div className="mb-10">
          <Link
            to="/"
            className="inline-flex items-center text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
        </div>

        <div className="w-full max-w-3xl mx-auto glass-morphism rounded-xl p-8 md:p-10 animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gradient mb-2 font-sans">
              Financial Planning Profile
            </h1>
            <p className="text-white/70">
              Complete the form below to create your personalized financial planning profile
            </p>
          </div>

          {submissionSuccess ? (
            <div className="flex flex-col items-center justify-center space-y-6 py-10 animate-fade-in">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-white mb-3">Your Financial Profile Has Been Created!</h2>
                <p className="text-white/70 mb-6">
                  Talk to our AI financial advisor to get personalized recommendations based on your profile.
                </p>
              </div>
              
              <Button 
                onClick={redirectToChat}
                className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 py-6 px-8 rounded-md text-white flex items-center">
                <MessageCircle className="mr-2 h-5 w-5" />
                Start Financial Advisor Chat
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
              <div>
                <Label htmlFor="pan_card_number">PAN Card Number</Label>
                <div className="flex items-center">
                  <IdCard className="h-5 w-5 text-white/50 mr-2" />
                  <Input
                    id="pan_card_number"
                    name="pan_card_number"
                    value={formData.pan_card_number}
                    onChange={handleInputChange}
                    className="mt-1 bg-white/5 border-white/10 text-white"
                    placeholder="ABCDE1234F"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="retirement_planning">Retirement Planning Goals</Label>
                <div className="flex items-center">
                  <PiggyBank className="h-5 w-5 text-white/50 mr-2" />
                  <Input
                    id="retirement_planning"
                    name="retirement_planning"
                    value={formData.retirement_planning}
                    onChange={handleInputChange}
                    className="mt-1 bg-white/5 border-white/10 text-white"
                    placeholder="Target retirement age and monthly income needed"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bank_accounts">Bank Accounts</Label>
                <div className="flex items-center">
                  <Building className="h-5 w-5 text-white/50 mr-2" />
                  <Input
                    id="bank_accounts"
                    name="bank_accounts"
                    value={formData.bank_accounts}
                    onChange={handleInputChange}
                    className="mt-1 bg-white/5 border-white/10 text-white"
                    placeholder="Number of bank accounts and total balance"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="monthly_savings">Monthly Savings (₹)</Label>
                  <div className="flex items-center">
                    <Wallet className="h-5 w-5 text-white/50 mr-2" />
                    <Input
                      id="monthly_savings"
                      name="monthly_savings"
                      type="number"
                      value={formData.monthly_savings}
                      onChange={handleInputChange}
                      className="mt-1 bg-white/5 border-white/10 text-white"
                      placeholder="25000"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="monthly_emis">Monthly EMIs (₹)</Label>
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-white/50 mr-2" />
                    <Input
                      id="monthly_emis"
                      name="monthly_emis"
                      type="number"
                      value={formData.monthly_emis}
                      onChange={handleInputChange}
                      className="mt-1 bg-white/5 border-white/10 text-white"
                      placeholder="15000"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="investment_channels">Investment Channels</Label>
                <div className="flex items-center mb-2">
                  <LineChart className="h-5 w-5 text-white/50 mr-2" />
                  <span className="text-white/70 text-sm">List your current investment channels (stocks, mutual funds, real estate, etc.)</span>
                </div>
                <Textarea
                  id="investment_channels"
                  name="investment_channels"
                  value={formData.investment_channels}
                  onChange={handleInputChange}
                  className="bg-white/5 border-white/10 text-white min-h-[100px]"
                  placeholder="Mutual Funds: 40% (Large cap, Mid cap)&#10;Stocks: 20% (IT, Banking, Pharma)&#10;Fixed Deposits: 20%&#10;Real Estate: 20%"
                />
              </div>

              <div>
                <Label htmlFor="insurance">Insurance Coverage</Label>
                <div className="flex items-center mb-2">
                  <Shield className="h-5 w-5 text-white/50 mr-2" />
                  <span className="text-white/70 text-sm">Describe your current insurance coverage (health, life, etc.)</span>
                </div>
                <Textarea
                  id="insurance"
                  name="insurance"
                  value={formData.insurance}
                  onChange={handleInputChange}
                  className="bg-white/5 border-white/10 text-white min-h-[100px]"
                  placeholder="Health Insurance: Family floater of 10L&#10;Term Life Insurance: 1 Cr coverage&#10;Critical Illness: 25L coverage"
                />
              </div>

              <div>
                <Label htmlFor="existing_loans">Existing Loans</Label>
                <div className="flex items-center mb-2">
                  <CreditCard className="h-5 w-5 text-white/50 mr-2" />
                  <span className="text-white/70 text-sm">List all your current loans with outstanding amounts</span>
                </div>
                <Textarea
                  id="existing_loans"
                  name="existing_loans"
                  value={formData.existing_loans}
                  onChange={handleInputChange}
                  className="bg-white/5 border-white/10 text-white min-h-[100px]"
                  placeholder="Home Loan: 40L outstanding, 15 years remaining&#10;Car Loan: 5L outstanding, 3 years remaining&#10;Personal Loan: None"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 py-6 px-8 rounded-md text-white">
                  {loading ? <ButtonLoader /> : "Submit Financial Plan"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialPlanningForm;