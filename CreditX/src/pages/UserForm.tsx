import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  User,
  FileText,
  BriefcaseBusiness,
  Home,
  Car,
  GraduationCap,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { api } from "@/api";
import axios from "axios";
import ButtonLoader from "@/components/Landing/ButtonLoader";
import LoadingModal from "@/components/Landing/LoadingModal";

const loanTypes = [
  { value: "personal", label: "Personal Loan", icon: User },
  { value: "business", label: "Business Loan", icon: BriefcaseBusiness },
  { value: "home", label: "Home Loan", icon: Home },
  { value: "car", label: "Car Loan", icon: Car },
  { value: "education", label: "Education Loan", icon: GraduationCap },
];

type UserFormProps = {
  userType: "borrower" | "institution";
};

type FormSection = "personal" | "documents" | "loan";

const UserForm = ({ userType }: UserFormProps) => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState<FormSection>("personal");
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    panCardNumber: "",
    bankStatement: null as File | null,
    aisDocument: null as File | null,
    loanType: "",
    loanDescription: "",
    loanAmount: "",
    loanPeriod: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validatePersonalSection = () => {
    const { firstName, lastName, email } = formData;
    return firstName && lastName && email;
  };

  const validateDocumentsSection = () => {
    const { panCardNumber, bankStatement, aisDocument } = formData;
    return panCardNumber && bankStatement && aisDocument;
  };

  const validateLoanSection = () => {
    const { loanType, loanDescription, loanAmount, loanPeriod } = formData;
    return loanType && loanDescription && loanAmount && loanPeriod;
  };

  const handleNext = () => {
    if (currentSection === "personal" && validatePersonalSection()) {
      setCurrentSection("documents");
    } else if (currentSection === "documents" && validateDocumentsSection()) {
      setCurrentSection("loan");
    } else {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields to continue.",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    if (currentSection === "documents") {
      setCurrentSection("personal");
    } else if (currentSection === "loan") {
      setCurrentSection("documents");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateLoanSection()) {
      setLoading(true);
      try {
        const formDataToSend = new FormData();
        formDataToSend.append("first_name", formData.firstName);
        formDataToSend.append("middle_name", formData.middleName);
        formDataToSend.append("last_name", formData.lastName);
        formDataToSend.append("loan_type", formData.loanType);
        formDataToSend.append("loan_description", formData.loanDescription);
        formDataToSend.append("pan_id", formData.panCardNumber);
        formDataToSend.append("ais", formData.aisDocument);
        formDataToSend.append("bank_statement", formData.bankStatement);
        formDataToSend.append("org_id", "a3c5a7d8-0ce4-480e-8c5f-eb66f52d91ba");
        formDataToSend.append(
          "user_id",
          "2a28b7da-9ddf-4197-ba12-e92ff01ad89d"
        );
        formDataToSend.append("loan_amount", formData.loanAmount);

        const response = await api.post("/loan/submit", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("Form data submitted:", response.data);

        toast({
          title: "Application submitted",
          description: "Your loan application has been submitted successfully.",
        });

        // Redirect to dashboard
        navigate("/dashboard");
      } catch (error) {
        console.error("Error submitting form data:", error);
        toast({
          title: "Submission error",
          description:
            "There was an error submitting your application. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    } else {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields to submit.",
        variant: "destructive",
      });
    }
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
      <LoadingModal open={loading} text="Processing application" />

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
              {userType === "borrower"
                ? "Apply for a Loan"
                : "Financial Institution Registration"}
            </h1>
            <p className="text-white/70">
              {userType === "borrower"
                ? "Complete the form below to apply for a loan through our platform"
                : "Register your financial institution to access our unified credit intelligence platform"}
            </p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div
                className={`flex-1 text-center pb-2 border-b-2 ${
                  currentSection === "personal"
                    ? "border-fintech-500 text-white"
                    : "border-white/20 text-white/50"
                } transition-colors`}>
                Personal Info
              </div>
              <div
                className={`flex-1 text-center pb-2 border-b-2 ${
                  currentSection === "documents"
                    ? "border-fintech-500 text-white"
                    : "border-white/20 text-white/50"
                } transition-colors`}>
                Documents
              </div>
              <div
                className={`flex-1 text-center pb-2 border-b-2 ${
                  currentSection === "loan"
                    ? "border-fintech-500 text-white"
                    : "border-white/20 text-white/50"
                } transition-colors`}>
                Loan Details
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {currentSection === "personal" && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="mt-1 bg-white/5 border-white/10 text-white"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="middleName">Middle Name (Optional)</Label>
                    <Input
                      id="middleName"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleInputChange}
                      className="mt-1 bg-white/5 border-white/10 text-white"
                      placeholder="Robert"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="mt-1 bg-white/5 border-white/10 text-white"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 bg-white/5 border-white/10 text-white"
                    placeholder="john.doe@example.com"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleNext} type="button">
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {currentSection === "documents" && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <Label htmlFor="panCardNumber">PAN Card Number</Label>
                  <Input
                    id="panCardNumber"
                    name="panCardNumber"
                    value={formData.panCardNumber}
                    onChange={handleInputChange}
                    className="mt-1 bg-white/5 border-white/10 text-white"
                    placeholder="ABCDE1234F"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="bankStatement">Bank Statement (PDF)</Label>
                  <div className="mt-1 flex items-center justify-center w-full">
                    <label
                      htmlFor="bankStatement"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {formData.bankStatement ? (
                          <>
                            <FileText className="w-8 h-8 mb-2 text-fintech-400" />
                            <p className="text-sm text-fintech-400">
                              {formData.bankStatement.name}
                            </p>
                          </>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 mb-2 text-white/70" />
                            <p className="mb-1 text-sm text-white/70">
                              Click to upload bank statement
                            </p>
                            <p className="text-xs text-white/50">
                              PDF up to 10MB
                            </p>
                          </>
                        )}
                      </div>
                      <Input
                        id="bankStatement"
                        name="bankStatement"
                        type="file"
                        className="hidden"
                        accept=".pdf"
                        onChange={handleFileChange}
                        required
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="aisDocument">
                    Annual Information Statement (AIS) (PDF)
                  </Label>
                  <div className="mt-1 flex items-center justify-center w-full">
                    <label
                      htmlFor="aisDocument"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {formData.aisDocument ? (
                          <>
                            <FileText className="w-8 h-8 mb-2 text-fintech-400" />
                            <p className="text-sm text-fintech-400">
                              {formData.aisDocument.name}
                            </p>
                          </>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 mb-2 text-white/70" />
                            <p className="mb-1 text-sm text-white/70">
                              Click to upload AIS document
                            </p>
                            <p className="text-xs text-white/50">
                              PDF up to 10MB
                            </p>
                          </>
                        )}
                      </div>
                      <Input
                        id="aisDocument"
                        name="aisDocument"
                        type="file"
                        className="hidden"
                        accept=".pdf"
                        onChange={handleFileChange}
                        required
                      />
                    </label>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBack} type="button">
                    Back
                  </Button>
                  <Button onClick={handleNext} type="button">
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {currentSection === "loan" && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <Label htmlFor="loanType">Loan Type</Label>
                  <Select
                    onValueChange={(value) =>
                      handleSelectChange(value, "loanType")
                    }
                    value={formData.loanType}>
                    <SelectTrigger className="w-full mt-1 bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select loan type" />
                    </SelectTrigger>
                    <SelectContent>
                      {loanTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center">
                            <type.icon className="mr-2 h-4 w-4" />
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="loanDescription">Loan Description</Label>
                  <Textarea
                    id="loanDescription"
                    name="loanDescription"
                    value={formData.loanDescription}
                    onChange={handleInputChange}
                    className="mt-1 bg-white/5 border-white/10 text-white min-h-[100px]"
                    placeholder="Please describe the purpose of this loan"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="loanAmount">Loan Amount (₹)</Label>
                    <Input
                      id="loanAmount"
                      name="loanAmount"
                      type="number"
                      value={formData.loanAmount}
                      onChange={handleInputChange}
                      className="mt-1 bg-white/5 border-white/10 text-white"
                      placeholder="500000"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="loanPeriod">Loan Period (Months)</Label>
                    <Input
                      id="loanPeriod"
                      name="loanPeriod"
                      type="number"
                      value={formData.loanPeriod}
                      onChange={handleInputChange}
                      className="mt-1 bg-white/5 border-white/10 text-white"
                      placeholder="36"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBack} type="button">
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 py-6 px-8 rounded-md text-white">
                    {loading ? <ButtonLoader /> : "Submit Application"}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
