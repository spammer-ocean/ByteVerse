import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Userpage from "./pages/users";
import ReportPage from "./pages/report";
// import ChatInterface from "@/components/ChatInterface";
import Chat from "./pages/chat";
import UserDashboard from "./pages/UserDashboard";
import UserForm from "./pages/UserForm";
import Index from "./pages/Index";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/register" element={<UserForm userType="borrower" />} />
          {/* <Route path="/register/institution" element={<Dashboard/>} /> */}
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/UserDashboard" element={<UserDashboard />} />
          <Route path="/chat/:userId" element={<Chat />} />
          <Route path="/users" element={<Userpage />} />
          <Route path="/report/:userId" element={<ReportPage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
