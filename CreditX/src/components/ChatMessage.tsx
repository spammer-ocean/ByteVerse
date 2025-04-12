import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

export interface ChatMessageProps {
  content: string;
  isBot: boolean;
  timestamp?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  isBot,
  timestamp,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl max-w-[85%] mb-4",
        isBot ? "self-start" : "self-end ml-auto"
      )}
    >
      {isBot && (
        <Avatar className="h-8 w-8 bg-bureau-cibil/10 border border-bureau-cibil/20 backdrop-blur-sm flex justify-center items-center mt-4">
          <Bot className="h-4 w-4 text-bureau-cibil" />
        </Avatar>
      )}
      <div
        className={cn(
          "flex flex-col rounded-xl p-4 backdrop-blur-sm",
          isBot
            ? "bg-chat-bot border border-bureau-cibil/10 text-foreground"
            : "bg-bureau-cibil/80 text-white"
        )}
      >
        <div className="prose prose-sm max-w-none">
          <p
            className={cn(
              "text-sm whitespace-pre-wrap",
              isBot ? "text-foreground" : "text-white"
            )}
          >
            {content}
          </p>
        </div>
        {timestamp && (
          <span
            className={cn(
              "text-xs mt-2 self-end",
              isBot ? "text-foreground/60" : "text-white/80"
            )}
          >
            {timestamp}
          </span>
        )}
      </div>
      {!isBot && (
        <Avatar className="h-8 w-8 bg-bureau-cibil border border-white/10 backdrop-blur-sm flex justify-center items-center mt-4">
          <User className="h-4 w-4 text-white" />
        </Avatar>
      )}
    </motion.div>
  );
};

export default ChatMessage;