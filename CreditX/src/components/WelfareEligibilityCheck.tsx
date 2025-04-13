import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface EligibilityCheckProps {
  userId?: string;
  eligibilityCriteria: string;
}

// Mock user profile data (would usually come from Supabase)
const mockUserProfiles = {
  "user1": {
    name: "John Doe",
    age: 35,
    income: 350000,
    occupation: "Private Sector Employee",
    category: "General",
    residenceState: "Maharashtra",
    hasDisability: false,
    gender: "Male",
  },
  "user2": {
    name: "Jane Smith",
    age: 28,
    income: 180000,
    occupation: "Self-employed",
    category: "OBC",
    residenceState: "Kerala",
    hasDisability: true,
    gender: "Female",
  }
};

const WelfareEligibilityCheck: React.FC<EligibilityCheckProps> = ({ userId = "user1", eligibilityCriteria }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{eligible: boolean; reasons: string[]} | null>(null);
  
  // Mock function to check eligibility based on AI analysis
  const checkEligibility = () => {
    setLoading(true);
    
    // In a real implementation, you would send both the user profile and the eligibility criteria
    // to an AI service to determine eligibility
    setTimeout(() => {
      const userProfile = mockUserProfiles[userId as keyof typeof mockUserProfiles];
      
      // Mock eligibility check (in production, this would be AI-powered)
      const criteriaLowerCase = eligibilityCriteria.toLowerCase();
      let eligible = true;
      const reasons: string[] = [];
      
      // Simple rule-based checks based on the extracted criteria
      if (criteriaLowerCase.includes("below poverty line") && userProfile.income > 200000) {
        eligible = false;
        reasons.push("Income exceeds the BPL threshold");
      }
      
      if (criteriaLowerCase.includes("senior citizen") && userProfile.age < 60) {
        eligible = false;
        reasons.push(`Age requirement not met (need to be 60+, current age: ${userProfile.age})`);
      }
      
      if (criteriaLowerCase.includes("female") && userProfile.gender !== "Female") {
        eligible = false;
        reasons.push("Scheme is for females only");
      }
      
      if ((criteriaLowerCase.includes("sc") || criteriaLowerCase.includes("scheduled caste")) 
          && userProfile.category !== "SC") {
        eligible = false;
        reasons.push("Category requirement not met (SC category required)");
      }
      
      if ((criteriaLowerCase.includes("st") || criteriaLowerCase.includes("scheduled tribe")) 
          && userProfile.category !== "ST") {
        eligible = false;
        reasons.push("Category requirement not met (ST category required)");
      }
      
      // If no specific ineligibility was found but criteria exist
      if (reasons.length === 0 && !eligible) {
        reasons.push("General eligibility criteria not met");
      }
      
      // If eligible, provide a confirmation message
      if (eligible) {
        reasons.push("You appear to meet the basic eligibility criteria for this scheme");
      }
      
      setResult({ eligible, reasons });
      setLoading(false);
    }, 2000);
  };
  
  const userProfile = mockUserProfiles[userId as keyof typeof mockUserProfiles];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8"
    >
      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle>Check Your Personal Eligibility</CardTitle>
          <CardDescription>
            Using your profile information, we can analyze if you might be eligible for this scheme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="glass p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{userProfile.name}</p>
              </div>
              <div className="glass p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="font-medium">{userProfile.age} years</p>
              </div>
              <div className="glass p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">Income</p>
                <p className="font-medium">₹{userProfile.income.toLocaleString()} per annum</p>
              </div>
              <div className="glass p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-medium">{userProfile.category}</p>
              </div>
              <div className="glass p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="font-medium">{userProfile.gender}</p>
              </div>
              <div className="glass p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">State</p>
                <p className="font-medium">{userProfile.residenceState}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            This is a preliminary check and may not be comprehensive
          </p>
          <Button 
            onClick={checkEligibility} 
            disabled={loading || !eligibilityCriteria}
            className="bg-bureau-cibil hover:bg-bureau-cibil/90"
          >
            {loading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking</>
            ) : (
              <>Check Eligibility</>
            )}
          </Button>
        </CardFooter>
      </Card>

      {result && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="mt-6"
        >
          <Alert className={`border ${result.eligible ? 'border-status-approved bg-status-approved/10' : 'border-status-rejected bg-status-rejected/10'}`}>
            {result.eligible ? (
              <Check className="h-4 w-4 text-status-approved" />
            ) : (
              <X className="h-4 w-4 text-status-rejected" />
            )}
            <AlertTitle>
              {result.eligible ? "You may be eligible!" : "You may not be eligible"}
            </AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {result.reasons.map((reason, index) => (
                  <li key={index} className="text-sm">{reason}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </motion.div>
  );
};

export default WelfareEligibilityCheck; 