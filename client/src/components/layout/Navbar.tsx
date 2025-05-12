import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import Logo from "@/components/ui/logo";

const Navbar = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <a className="flex items-center">
            <Logo className="h-12 bg-primary p-1 rounded" />
          </a>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/">
            <a className={`text-primary hover:text-accent font-medium py-2 ${isActive('/') ? 'active-tab' : ''}`}>
              Home
            </a>
          </Link>
          <Link href="/gear">
            <a className={`text-primary hover:text-accent font-medium py-2 ${isActive('/gear') ? 'active-tab' : ''}`}>
              Our Gear
            </a>
          </Link>
          <Link href="/contact">
            <a className={`text-primary hover:text-accent font-medium py-2 ${isActive('/contact') ? 'active-tab' : ''}`}>
              Contact Us
            </a>
          </Link>
          <Link href="/admin">
            <a className={`text-primary hover:text-accent font-medium py-2 ${isActive('/admin') ? 'active-tab' : ''}`}>
              Admin
            </a>
          </Link>
        </div>
        
        {/* Mobile Navigation Toggle */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-primary">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white pb-4 px-4">
          <Link href="/">
            <a 
              className="block py-2 text-primary hover:text-accent font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </a>
          </Link>
          <Link href="/gear">
            <a 
              className="block py-2 text-primary hover:text-accent font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Our Gear
            </a>
          </Link>
          <Link href="/contact">
            <a 
              className="block py-2 text-primary hover:text-accent font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact Us
            </a>
          </Link>
          <Link href="/admin">
            <a 
              className="block py-2 text-primary hover:text-accent font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Admin
            </a>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
