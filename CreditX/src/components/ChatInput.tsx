import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SendHorizontal, Paperclip } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-background/30 backdrop-blur-xl border-t border-white/10 p-4 rounded-t-xl"
    >
      <form 
        onSubmit={handleSubmit}
        className="flex items-center gap-2"
      >
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="rounded-full h-9 w-9 text-foreground/60 hover:text-foreground hover:bg-white/5"
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        <div className="relative flex-1">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about your finances..."
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 px-4 text-foreground focus:outline-none focus:ring-1 focus:ring-bureau-cibil/50"
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() || isLoading}
          className="rounded-full h-9 w-9 bg-bureau-cibil hover:bg-bureau-cibil/90 text-white"
        >
          <SendHorizontal className="h-5 w-5" />
        </Button>
      </form>
    </motion.div>
  );
};

export default ChatInput;