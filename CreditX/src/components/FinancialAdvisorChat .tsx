import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/api";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const FinancialAdvisorChat = () => {
  const { pancard } = useParams<{ pancard: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);



  // Scroll to the bottom of chat when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || !pancard) return;
    
    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    
    try {
      // Send user message to backend for AI processing
      const response = await api.post('http://localhost:4040/assistant/chat', {
        message: input,
        pan_card_number: pancard, // Using the URL parameter in the request
      });
      
      // Add AI response to chat
      const botMessage: Message = {
        id: messages.length + 2,
        text: response.data.message, // Using the message field from response
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-[#0c1218]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to dashboard
          </Link>
        </div>

        <div className="max-w-4xl mx-auto glass-morphism rounded-xl overflow-hidden">
          {/* Header */}
          <div className="bg-white/5 p-4 border-b border-white/10">
            <h2 className="text-xl font-semibold text-white">Financial Advisor Chat</h2>
            <p className="text-white/70 text-sm">
              {profileData ? `Profile: ${pancard}` : "Loading profile..."}
            </p>
          </div>

          {/* Chat area */}
          <div className="h-[60vh] overflow-y-auto p-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-4 flex ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  <div className="flex items-center mb-1">
                    {msg.sender === 'bot' ? (
                      <Bot className="h-4 w-4 mr-2 text-white/70" />
                    ) : (
                      <User className="h-4 w-4 mr-2 text-white/70" />
                    )}
                    <span className="text-xs text-white/70">
                      {msg.sender === 'bot' ? 'AI Advisor' : 'You'} • {formatTime(msg.timestamp)}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input area */}
          <div className="p-4 border-t border-white/10">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your finances..."
                className="flex-1 bg-white/5 border-white/10 text-white"
                disabled={loading}
              />
              <Button 
                type="submit" 
                disabled={loading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialAdvisorChat;