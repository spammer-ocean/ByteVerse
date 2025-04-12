
import { Bell, ChevronDown, Search, User } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="glass-dark sticky top-0 z-10 flex h-16 items-center justify-between px-6 backdrop-blur-lg animate-fade-in">
      

      <div className="flex-1 mx-7">
        <div
          className={`relative flex items-center transition-all duration-300 ${
            searchFocused ? "w-96" : "w-80"
          }`}
        >
          <Search
            className={`absolute left-3 right-3 h-4 w-5 text-muted-foreground transition-all duration-300 ${
              searchFocused ? "text-primary" : ""
            }`}
          />
          <input
            type="search"
            placeholder="Search..."
            className="h-10 w-full rounded-full bg-secondary/80 pl-10 pr-4 text-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button
          size="icon"
          variant="ghost"
          className="relative rounded-full hover:bg-secondary"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 rounded-full hover:bg-secondary"
            >
              <Avatar className="h-8 w-8 border border-primary/30">
                <AvatarImage src="https://github.com/shadcn.png" alt="Admin" />
                <AvatarFallback className="text-xs">AU</AvatarFallback>
              </Avatar>
              <div className="flex items-center">
                <div className="text-sm font-medium">Admin User</div>
                <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 glass-dark">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
