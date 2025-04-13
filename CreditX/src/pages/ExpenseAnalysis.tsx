import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  File, 
  X, 
  AlertTriangle,
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import axios from 'axios';
import Header from '@/components/Header';
import LoadingModal from '@/components/Landing/LoadingModal';

interface Transaction {
  date: string;
  description: string;
  amount: number;
  transaction_type: string;
  amount_range: string;
  balance?: string;
}

interface AnalysisResult {
  message: string;
  transactions: Transaction[];
  spending_by_category: Record<string, number>;  // For backward compatibility
  spending_by_amount_range: Record<string, number>;
  spending_by_day: Record<string, number>;
  spending_by_week: Record<string, number>;
  spending_by_month: {
    total: Record<string, number>;
    by_range: Record<string, Record<string, number>>;
  };
  unusual_transactions: Transaction[];
  suggestions: string[];
  charts: Record<string, string>;
}

const ExpenseAnalysis = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [statementFile, setStatementFile] = useState<File | null>(null);
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activeChart, setActiveChart] = useState<string>('amount_range_pie');
  const statementInputRef = useRef<HTMLInputElement>(null);
  const additionalInputRef = useRef<HTMLInputElement>(null);

  // Handle statement file selection
  const handleStatementUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        setStatementFile(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or image file.",
          variant: "destructive"
        });
      }
    }
  };

  // Handle additional files selection
  const handleAdditionalUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(
        file => file.type === 'application/pdf' || file.type.startsWith('image/')
      );
      
      if (newFiles.length !== e.target.files.length) {
        toast({
          title: "Some files were skipped",
          description: "Only PDF and image files are accepted.",
          variant: "default"
        });
      }
      
      if (newFiles.length > 0) {
        setAdditionalFiles(prev => [...prev, ...newFiles]);
      }
    }
  };

  // Remove file
  const removeFile = (type: 'statement' | 'additional', index?: number) => {
    if (type === 'statement') {
      setStatementFile(null);
      if (statementInputRef.current) statementInputRef.current.value = '';
    } else if (type === 'additional' && typeof index === 'number') {
      setAdditionalFiles(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!statementFile) {
      toast({
        title: "No statement file",
        description: "Please upload a bank statement to analyze.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('statement_file', statementFile);
      
      if (additionalFiles.length > 0) {
        additionalFiles.forEach(file => {
          formData.append('additional_files', file);
        });
      }
      
      // Make API call to analyze statement
      const response = await axios.post('http://localhost:8002/api/analyze-statement', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      setAnalysisResult(response.data);
      
      toast({
        title: "Analysis complete",
        description: "Your bank statement has been analyzed successfully.",
      });
    } catch (error) {
      console.error("Error analyzing statement:", error);
      
      let errorMessage = "An error occurred while analyzing your statement.";
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      toast({
        title: "Analysis failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Plotly chart rendering
  React.useEffect(() => {
    const renderChart = () => {
      if (!analysisResult || !window.Plotly) return;
      
      const chartContainer = document.getElementById('chart-container');
      if (!chartContainer) return;
      
      let chartData;
      
      try {
        chartData = JSON.parse(analysisResult.charts[activeChart]);
        
        // Clear previous chart
        chartContainer.innerHTML = '';
        
        // Render new chart
        window.Plotly.newPlot(chartContainer, chartData.data, chartData.layout, {
          responsive: true,
          displayModeBar: false
        });
      } catch (error) {
        console.error("Error rendering chart:", error);
        chartContainer.innerHTML = '<div class="p-4 text-center text-muted-foreground">Failed to render chart</div>';
      }
    };
    
    // Add Plotly script
    if (!window.Plotly) {
      const script = document.createElement('script');
      script.src = 'https://cdn.plot.ly/plotly-2.24.1.min.js';
      script.async = true;
      
      script.onload = renderChart;
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      };
    } else {
      renderChart();
    }
  }, [analysisResult, activeChart]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="flex items-center text-muted-foreground mb-2"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fintech-700 to-fintech-900">
            Bank Statement Analysis
          </h1>
          <p className="text-muted-foreground mt-2">
            Upload your bank statement to analyze spending patterns and get personalized insights.
          </p>
        </div>

        {!analysisResult ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <Card className="glass">
              <CardHeader>
                <CardTitle>Upload Financial Documents</CardTitle>
                <CardDescription>
                  Upload your bank statement (required) and any additional receipts or bills (optional).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Bank Statement Upload */}
                  <div>
                    <Label htmlFor="statement-upload" className="block mb-2">
                      Bank Statement (Required)
                    </Label>
                    <div 
                      className={`border-2 border-dashed rounded-lg p-6 text-center 
                        ${statementFile ? 'border-fintech-600 bg-fintech-100/10' : 'border-border hover:border-fintech-500/50'} 
                        transition-colors cursor-pointer`}
                      onClick={() => statementInputRef.current?.click()}
                    >
                      {!statementFile ? (
                        <div className="flex flex-col items-center">
                          <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                          <p className="text-sm font-medium">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PDF or Image file (Max 10MB)
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-8 w-8 text-fintech-600" />
                            <div className="text-left">
                              <p className="text-sm font-medium truncate max-w-[200px]">
                                {statementFile.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {(statementFile.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile('statement');
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      <Input
                        id="statement-upload"
                        type="file"
                        accept=".pdf,image/*"
                        className="hidden"
                        onChange={handleStatementUpload}
                        ref={statementInputRef}
                      />
                    </div>
                  </div>

                  {/* Additional Documents Upload */}
                  <div>
                    <Label htmlFor="additional-upload" className="block mb-2">
                      Additional Documents (Optional)
                    </Label>
                    <div 
                      className="border-2 border-dashed rounded-lg p-6 text-center border-border hover:border-fintech-500/50 transition-colors cursor-pointer"
                      onClick={() => additionalInputRef.current?.click()}
                    >
                      <div className="flex flex-col items-center">
                        <File className="h-8 w-8 mb-2 text-muted-foreground" />
                        <p className="text-sm font-medium">
                          Upload receipts, bills or other documents
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PDF or Image files (Max 10MB each)
                        </p>
                      </div>
                      <Input
                        id="additional-upload"
                        type="file"
                        accept=".pdf,image/*"
                        multiple
                        className="hidden"
                        onChange={handleAdditionalUpload}
                        ref={additionalInputRef}
                      />
                    </div>

                    {/* Display additional files */}
                    {additionalFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-sm font-medium">Uploaded Files:</p>
                        <div className="max-h-36 overflow-y-auto pr-2">
                          {additionalFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between py-2 px-3 bg-card rounded-md">
                              <div className="flex items-center space-x-3">
                                <File className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm truncate max-w-[200px]">{file.name}</p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-destructive"
                                onClick={() => removeFile('additional', index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-fintech-700 to-fintech-900 hover:from-fintech-800 hover:to-fintech-950"
                    disabled={!statementFile || isLoading}
                  >
                    {isLoading ? "Analyzing..." : "Analyze Statement"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column - Visualizations */}
              <div className="lg:col-span-2 space-y-6">
                {/* Chart Section */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      <BarChart3 className="mr-2 h-5 w-5 text-fintech-600" />
                      Financial Overview
                    </CardTitle>
                    <CardDescription>
                      Visual analysis of your spending patterns
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Chart tabs */}
                    <Tabs defaultValue={activeChart} onValueChange={setActiveChart} className="w-full">
                      <TabsList className="mb-4 w-full grid grid-cols-4">
                        <TabsTrigger value="amount_range_pie">
                          <span className="hidden sm:inline">Amount Ranges</span>
                          <span className="sm:hidden">Ranges</span>
                        </TabsTrigger>
                        <TabsTrigger value="day_bar">
                          <span className="hidden sm:inline">Daily</span>
                          <span className="sm:hidden">Day</span>
                        </TabsTrigger>
                        <TabsTrigger value="week_line">
                          <span className="hidden sm:inline">Weekly</span>
                          <span className="sm:hidden">Week</span>
                        </TabsTrigger>
                        <TabsTrigger value="month_stack">
                          <span className="hidden sm:inline">Monthly</span>
                          <span className="sm:hidden">Month</span>
                        </TabsTrigger>
                      </TabsList>

                      <div id="chart-container" className="h-[300px] w-full" />
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Transactions Table */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center">
                      <DollarSign className="mr-2 h-5 w-5 text-fintech-600" />
                      Transactions
                    </CardTitle>
                    <CardDescription>
                      {analysisResult.transactions.length} transactions found in your statement
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-md">
                      <ScrollArea className="h-[400px]">
                        <Table>
                          <TableHeader className="sticky top-0 bg-card z-10">
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead>Amount Range</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Type</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {analysisResult.transactions.map((transaction, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  {transaction.date && new Date(transaction.date).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="max-w-[200px] truncate">
                                  {transaction.description || 'Transaction'}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="capitalize">
                                    {transaction.amount_range || (
                                      transaction.amount > 10000 ? 'Very Large' :
                                      transaction.amount > 2000 ? 'Large' :
                                      transaction.amount > 500 ? 'Medium' : 'Small'
                                    )}
                                  </Badge>
                                </TableCell>
                                <TableCell className={
                                  transaction.transaction_type === 'credit' 
                                    ? 'text-green-600' 
                                    : 'text-red-600'
                                }>
                                  {formatCurrency(transaction.amount)}
                                </TableCell>
                                <TableCell>
                                  <Badge className={
                                    transaction.transaction_type === 'credit'
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                                  }>
                                    {transaction.transaction_type || 'debit'}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right column - Insights and Suggestions */}
              <div className="space-y-6">
                {/* Amount Range Summary */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-fintech-800 dark:text-fintech-400">
                      <PieChart className="mr-2 h-5 w-5" />
                      Expense by Amount Range
                    </CardTitle>
                    <CardDescription>
                      Breakdown of your spending by transaction size
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(analysisResult.spending_by_amount_range || 
                                      analysisResult.spending_by_category || {})
                        .sort(([, a], [, b]) => b - a)
                        .map(([range, amount], index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full bg-fintech-${600 - index * 100}`}></div>
                              <span>{range}</span>
                            </div>
                            <span className="font-medium">{formatCurrency(amount)}</span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Unusual Transactions */}
                {analysisResult.unusual_transactions.length > 0 && (
                  <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                    <CardHeader>
                      <CardTitle className="flex items-center text-amber-800 dark:text-amber-400">
                        <AlertTriangle className="mr-2 h-5 w-5" />
                        Unusual Transactions
                      </CardTitle>
                      <CardDescription>
                        These transactions stand out from your typical spending patterns
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analysisResult.unusual_transactions.map((transaction, index) => (
                          <div key={index} className="p-3 bg-white dark:bg-background rounded-md shadow-sm border border-amber-200 dark:border-amber-800">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{formatCurrency(transaction.amount)}</p>
                                <p className="text-sm text-muted-foreground mt-1">{transaction.description || 'Transaction'}</p>
                              </div>
                              <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                                Unusual
                              </Badge>
                            </div>
                            <div className="mt-2 flex items-center text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3 mr-1" />
                              {transaction.date && new Date(transaction.date).toLocaleDateString()}
                            </div>
                            <p className="text-xs mt-2 text-amber-600 dark:text-amber-400">
                              {transaction.flag_reason || "Significantly higher than your average transaction"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {/* Spending Suggestions */}
                <Card className="border-fintech-200 dark:border-fintech-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-fintech-800 dark:text-fintech-400">
                      <TrendingUp className="mr-2 h-5 w-5" />
                      Spending Insights
                    </CardTitle>
                    <CardDescription>
                      Personalized suggestions to improve your financial habits
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analysisResult.suggestions.map((suggestion, index) => (
                        <div key={index} className="flex space-x-3">
                          <div className="h-8 w-8 rounded-full bg-fintech-100 dark:bg-fintech-950 flex items-center justify-center text-fintech-700 dark:text-fintech-300 shrink-0">
                            {index + 1}
                          </div>
                          <p className="text-sm mt-1.5">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Restart Analysis */}
                <Button 
                  className="w-full bg-gradient-to-r from-fintech-700 to-fintech-900 hover:from-fintech-800 hover:to-fintech-950"
                  onClick={() => {
                    setAnalysisResult(null);
                    setStatementFile(null);
                    setAdditionalFiles([]);
                    if (statementInputRef.current) statementInputRef.current.value = '';
                    if (additionalInputRef.current) additionalInputRef.current.value = '';
                  }}
                >
                  Analyze Another Statement
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Loading Modal */}
      {isLoading && (
        <LoadingModal 
          isOpen={isLoading}
          message="Analyzing your financial data. This may take a minute..."
        />
      )}
      <Toaster />
    </div>
  );
};

export default ExpenseAnalysis;