import { useState } from "react";
import { Link } from "wouter";
import { useMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMobile();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <svg 
              className="h-10 w-10 mr-2 text-primary" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M4 6h16v10H4z" />
              <path d="M20 18c0 1.1-1.9 2-4 2H8c-2.1 0-4-.9-4-2" />
              <path d="M9 10h1v4H9z" fill="white" />
              <path d="M14 10h1v4h-1z" fill="white" />
            </svg>
            <div>
              <h1 className="text-xl font-medium text-primary">IT SOLUTION</h1>
              <p className="text-xs text-neutral-dark">Computer Center</p>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <a href="#home" className="text-neutral-darkest hover:text-primary font-medium">Home</a>
            <a href="#courses" className="text-neutral-darkest hover:text-primary font-medium">Courses</a>
            <a href="#verify" className="text-neutral-darkest hover:text-primary font-medium">Verify Certificate</a>
            <a href="#about" className="text-neutral-darkest hover:text-primary font-medium">About Us</a>
            <a href="#contact" className="text-neutral-darkest hover:text-primary font-medium">Contact</a>
          </nav>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-neutral-darkest" 
            onClick={toggleMenu}
          >
            <Menu />
          </Button>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-3">
              <a href="#home" className="text-neutral-darkest hover:text-primary font-medium" onClick={() => setIsMenuOpen(false)}>Home</a>
              <a href="#courses" className="text-neutral-darkest hover:text-primary font-medium" onClick={() => setIsMenuOpen(false)}>Courses</a>
              <a href="#verify" className="text-neutral-darkest hover:text-primary font-medium" onClick={() => setIsMenuOpen(false)}>Verify Certificate</a>
              <a href="#about" className="text-neutral-darkest hover:text-primary font-medium" onClick={() => setIsMenuOpen(false)}>About Us</a>
              <a href="#contact" className="text-neutral-darkest hover:text-primary font-medium" onClick={() => setIsMenuOpen(false)}>Contact</a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
