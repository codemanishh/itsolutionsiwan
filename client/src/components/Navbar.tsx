import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useMobile } from "@/hooks/use-mobile";
import { Menu, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

interface User {
  id: number;
  username: string;
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMobile();
  const [location] = useLocation();
  
  // Check if user is already logged in
  const { data: user } = useQuery<User | null>({
    queryKey: ['/api/user'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/user', { credentials: 'include' });
        if (res.status === 401) return null;
        if (!res.ok) throw new Error('Failed to fetch user');
        return res.json();
      } catch (error) {
        console.error('Error fetching user:', error);
        return null;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
    gcTime: 0,
  });

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
            <Link href="/" className="text-neutral-darkest hover:text-primary font-medium">Home</Link>
            <Link href="/courses" className="text-neutral-darkest hover:text-primary font-medium">Courses</Link>
            <Link href="/verify" className="text-neutral-darkest hover:text-primary font-medium">Verify Certificate</Link>
            <Link href="/about" className="text-neutral-darkest hover:text-primary font-medium">About Us</Link>
            <Link href="/contact" className="text-neutral-darkest hover:text-primary font-medium">Contact</Link>
          </nav>
          
          <div className="flex items-center space-x-2">
            {/* Admin button/link */}
            {user ? (
              <Link href="/admin">
                <Button variant="outline" size="sm" className="hidden md:flex items-center">
                  <Lock className="mr-1 h-4 w-4" />
                  Admin Panel
                </Button>
              </Link>
            ) : (
              <Link href="/auth">
                <Button variant="outline" size="sm" className="hidden md:flex items-center">
                  <Lock className="mr-1 h-4 w-4" />
                  Admin Login
                </Button>
              </Link>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-neutral-darkest" 
              onClick={toggleMenu}
            >
              <Menu />
            </Button>
          </div>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-3">
              <Link href="/" className="text-neutral-darkest hover:text-primary font-medium" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link href="/courses" className="text-neutral-darkest hover:text-primary font-medium" onClick={() => setIsMenuOpen(false)}>Courses</Link>
              <Link href="/verify" className="text-neutral-darkest hover:text-primary font-medium" onClick={() => setIsMenuOpen(false)}>Verify Certificate</Link>
              <Link href="/about" className="text-neutral-darkest hover:text-primary font-medium" onClick={() => setIsMenuOpen(false)}>About Us</Link>
              <Link href="/contact" className="text-neutral-darkest hover:text-primary font-medium" onClick={() => setIsMenuOpen(false)}>Contact</Link>
              
              {/* Mobile admin link */}
              {user ? (
                <Link href="/admin" className="text-neutral-darkest hover:text-primary font-medium flex items-center" onClick={() => setIsMenuOpen(false)}>
                  <Lock className="mr-2 h-4 w-4" /> Admin Panel
                </Link>
              ) : (
                <Link href="/auth" className="text-neutral-darkest hover:text-primary font-medium flex items-center" onClick={() => setIsMenuOpen(false)}>
                  <Lock className="mr-2 h-4 w-4" /> Admin Login
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
