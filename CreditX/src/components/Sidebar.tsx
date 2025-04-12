import React from "react";
import { MessageCircle, FileText, Home, Users } from "lucide-react";
import { motion } from "framer-motion";

type SidebarItem = {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  href?: string;
};

export default function Sidebar({ title }: { title: string }) {
  const sidebarItems: SidebarItem[] = [
    { icon: Users, label: "Users", active: title === "Users", href: "/users" }, //for every user there is a different dashboard which will be routed via the user tile
    { icon: Home, label: "Dashboard", active: title === "Dashboard", href: "/users" },
    { icon: FileText, label: "Reports", active: title === "Reports", href: "/users" },
    { icon: MessageCircle, label: "Chat", active: title === "Chat", href: "/users" },
  ];
  return (
    <motion.aside
      className="glass-dark w-64 fixed left-0 top-0 h-screen p-4 flex flex-col z-20"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}>
      <motion.div
        className="mb-6 p-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          CreditX
        </h2>
      </motion.div>

      <nav className="flex-1 py-8">
        <motion.ul
          className="space-y-2"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.08,
                delayChildren: 0.5,
              },
            },
          }}>
          {sidebarItems.map((item, index) => (
            <motion.li
              key={item.label} 
              className={item.label=="Users" ? "mb-7" : ""}
              variants={{
                hidden: { x: -20, opacity: 0 },
                visible: {
                  x: 0,
                  opacity: 1,
                  transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                  },
                },
              }}>
                <motion.a
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  item.active ? "bg-primary text-white" : "hover:bg-secondary"
                }`}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}>
                <item.icon
                  className={`h-5 w-5 ${
                  item.active
                    ? ""
                    : "text-muted-foreground group-hover:text-foreground"
                  }`}
                />
                <span
                  className={`font-medium ${
                  item.active
                    ? ""
                    : "text-muted-foreground group-hover:text-foreground"
                  }`}>
                  {item.label}
                </span>
                {item.active && (
                  <motion.div
                  className="ml-auto h-2 w-2 rounded-full bg-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                  />
                )}
                </motion.a>
            </motion.li>
          ))}
        </motion.ul>
      </nav>
    </motion.aside>
  );
}
