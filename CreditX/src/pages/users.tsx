import { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  User,
  ArrowUpRight,
  UserCheck,
  RefreshCw,
  Users as UsersIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import Sidebar from "@/components/Sidebar";
import AnimatedGradient from "@/components/AnimatedGradient";
import BackgroundEffect from "@/components/BackgroundEffect";
import Header from "@/components/Header";
import { motion } from "framer-motion";

// Define the user type
interface User {
  id: string;
  name: string;
  pancard: string;
  status: "active" | "pending" | "inactive";
  lastActive: string;
  creditScore?: number;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Simulate data fetching
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "http://127.0.0.1:4040/user/get?org_id=a3c5a7d8-0ce4-480e-8c5f-eb66f52d91ba"
        );
        // console.log(response);
        // console.log("response.data:", response.data);
        const formattedUsers = response.data.map((user, index) => ({
          id: user.id,
          name: `${user.user_id.first_name} ${user.user_id.last_name}`.trim(),
          pancard: user.user_id.pan || "N/A",
          status: user.status,
          lastActive: user.loan_type, // Placeholder, update if available
        }));
        setUsers(formattedUsers);
        setFilteredUsers(formattedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error",
          description: "Failed to load user data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.pancard.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  // Navigate to user dashboard
  const handleUserClick = (pan: string, last: string) => {
    navigate(`/AdminDashboard`, {
      state: {
        pan_id: pan,
        loan_type: last,
      },
    });

    toast({
      title: "Navigation",
      description: `Opening dashboard for user`,
    });
  };

  const handleChat = (userId: string) => {
    navigate(`/chat/${userId}`, {
      state: {
        request_id: userId,
      },
    });

    toast({
      title: "Navigation",
      description: `Opening dashboard for user ID: ${userId}`,
    });
  };

  const handleReport = (userId: string, user) => {
    navigate(`/report/${userId}`, {
      state: {
        req_id: userId,
        user,
      },
    });

    toast({
      title: "Navigation",
      description: `Opening dashboard for user ID: ${userId}`,
    });
  };

  // Status badge color mapping
  const getStatusColor = (status: User["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 hover:bg-green-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30";
      case "inactive":
        return "bg-red-500/20 text-red-400 hover:bg-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 hover:bg-gray-500/30";
    }
  };

  // Credit score color mapping
  const getCreditScoreColor = (score?: number) => {
    if (!score) return "text-gray-400";
    if (score >= 750) return "text-green-400";
    if (score >= 650) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <AnimatedGradient>
      <div className="flex min-h-screen bg-background overflow-hidden">
        <BackgroundEffect />
        <div className="fixed inset-0 pointer-events-none">
          <motion.div
            className="absolute top-[10%] left-[5%] w-96 h-96 bg-primary/5 rounded-full blur-3xl"
            animate={{
              x: [0, 10, 0],
              y: [0, 15, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-[15%] right-[10%] w-80 h-80 bg-accent/5 rounded-full blur-3xl"
            animate={{
              x: [0, -15, 0],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.div
            className="absolute top-[40%] right-[20%] w-64 h-64 bg-bureau-cibil/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
        </div>

        <Sidebar title="Users" />

        <div className="flex-1 pl-64">
          <Header />
          <main className="p-6 h-[calc(100vh-64px)] overflow-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}>
              <header className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <UsersIcon className="h-6 w-6 text-primary" />
                    <h1 className="text-2xl font-semibold">User Management</h1>
                  </div>
                </div>
                <p className="text-sm text-foreground/60 mb-6">
                  View and manage all registered users and their details
                </p>

                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by name or PAN card..."
                    className="pl-10 bg-background border-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </header>

              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-dark rounded-lg py-20 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <RefreshCw className="h-10 w-10 text-primary animate-spin" />
                    <p className="text-foreground/60">Loading user data...</p>
                  </div>
                </motion.div>
              ) : filteredUsers.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-dark rounded-lg py-20 text-center">
                  <User className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Users Found</h3>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.05 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredUsers.map((user) => (
                    <HoverCard key={user.id}>
                      <HoverCardTrigger asChild>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="glass-dark rounded-lg p-5 cursor-pointer">
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                <UserCheck className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-medium text-lg leading-tight">
                                  {user.name}
                                </h3>
                                <p className="text-foreground/60 text-sm">
                                  ID: {user.id}
                                </p>
                              </div>
                            </div>
                            <Badge className={getStatusColor(user.status)}>
                              {user.status.charAt(0).toUpperCase() +
                                user.status.slice(1)}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-xs text-foreground/60 mb-1">
                                PAN Card
                              </p>
                              <p className="font-mono tracking-wide">
                                {user.pancard}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-foreground/60 mb-1">
                                Loan Type
                              </p>
                              <p>{user.lastActive}</p>
                            </div>
                          </div>

                          {user.creditScore && (
                            <div className="mt-4 pt-4 border-t border-white/5">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-foreground/60">
                                  Credit Score
                                </span>
                                <span
                                  className={`font-semibold text-lg ${getCreditScoreColor(
                                    user.creditScore
                                  )}`}>
                                  {user.creditScore}
                                </span>
                              </div>
                            </div>
                          )}

                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full mt-4 text-primary flex items-center justify-center gap-1.5 hover:bg-primary/10"
                            onClick={() =>
                              handleUserClick(user.pancard, user.lastActive)
                            }>
                            View Dashboard
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full mt-4 text-primary flex items-center justify-center gap-1.5 hover:bg-primary/10"
                            onClick={() => handleChat(user.id)}>
                            Open chat
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full mt-4 text-primary flex items-center justify-center gap-1.5 hover:bg-primary/10"
                            onClick={() => handleReport(user.id, user)}>
                            View Report
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Button>
                        </motion.div>
                      </HoverCardTrigger>

                      <HoverCardContent className="glass-dark w-80 border-white/5 p-0 animate-scale-in">
                        <div className="p-4 border-b border-white/5">
                          <div className="flex gap-3 items-center">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-lg">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <h4 className="font-semibold text-lg">
                                {user.name}
                              </h4>
                              <p className="text-sm text-foreground/60">
                                PAN: {user.pancard}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs text-foreground/60">
                                Status
                              </p>
                              <Badge
                                className={`mt-1 ${getStatusColor(
                                  user.status
                                )}`}>
                                {user.status.charAt(0).toUpperCase() +
                                  user.status.slice(1)}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-xs text-foreground/60">
                                Last Activity
                              </p>
                              <p className="text-sm mt-1">
                                {new Date(user.lastActive).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          {user.creditScore && (
                            <div>
                              <p className="text-xs text-foreground/60 mb-1">
                                Credit Score
                              </p>
                              <div className="flex items-center gap-2">
                                <div className="h-2 flex-1 bg-background rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${
                                      user.creditScore >= 750
                                        ? "bg-green-500"
                                        : user.creditScore >= 650
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                    }`}
                                    style={{
                                      width: `${
                                        (user.creditScore / 900) * 100
                                      }%`,
                                    }}></div>
                                </div>
                                <span
                                  className={`font-medium ${getCreditScoreColor(
                                    user.creditScore
                                  )}`}>
                                  {user.creditScore}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="p-3 bg-background/10 border-t border-white/5 flex justify-end">
                          <Button
                            size="sm"
                            className="bg-primary hover:bg-primary/90"
                            onClick={() =>
                              handleUserClick(user.id, user.lastActive)
                            }>
                            Open Dashboard
                          </Button>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </main>
        </div>
      </div>
    </AnimatedGradient>
  );
};

export default Users;
