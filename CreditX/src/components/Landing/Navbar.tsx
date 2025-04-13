import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Menu, X, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { text: "Features", href: "#features" },
    { text: "How It Works", href: "#how-it-works" },
    { text: "Benefits", href: "#benefits" },
    { text: "Expense Analysis", href: "/expense-analysis" },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300 ease-in-out',
        isScrolled ? 'bg-black/30 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between h-16 md:h-20">
        <Link 
          to="/" 
          className="text-xl md:text-2xl font-display font-bold text-white flex items-center"
        >
          <span className="text-gradient-blue mr-1 font-sans">Credit</span>
          <span className="text-white font-sans">X</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              to={link.href}
              className="text-sm text-white/80 hover:text-white transition-colors"
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (link.href.startsWith('#')) {
                  document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              {link.text === "Expense Analysis" && <BarChart3 className="w-4 h-4 inline mr-1" />}
              {link.text}
            </Link>
          ))}
          <Link to="/users" className="text-sm text-white/80 hover:text-white transition-colors">For Institutions</Link>
        </nav>

        <div className="hidden md:flex items-center space-x-3">
          <Link to="/register">
            <Button variant="outline" className="text-sm border-white/20 hover:bg-white/10 hover:border-white/40 transition-colors">
              Get Started
            </Button>
          </Link>
        </div>

        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-lg absolute w-full border-b border-white/10 animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.href}
                className="text-sm text-white/80 hover:text-white transition-colors py-2"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (link.href.startsWith('#')) {
                    document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {link.text === "Expense Analysis" && <BarChart3 className="w-4 h-4 inline mr-1" />}
                {link.text}
              </Link>
            ))}
            <Link 
              to="/register/institution" 
              className="text-sm text-white/80 hover:text-white transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              For Institutions
            </Link>
            <div className="pt-2 border-t border-white/10">
              <Link 
                to="/register" 
                className="block w-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
