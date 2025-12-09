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
        <div className="flex items-center">
          <Link href="/">
            <Logo className="h-16 cursor-pointer" variant="header" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/">
            <span className={`text-primary hover:text-accent font-medium py-2 cursor-pointer ${isActive('/') ? 'active-tab' : ''}`}>
              Home
            </span>
          </Link>
          <Link href="/gear">
            <span className={`text-primary hover:text-accent font-medium py-2 cursor-pointer ${isActive('/gear') ? 'active-tab' : ''}`}>
              Baby Gear
            </span>
          </Link>
          <Link href="/contact">
            <span className={`text-primary hover:text-accent font-medium py-2 cursor-pointer ${isActive('/contact') ? 'active-tab' : ''}`}>
              Contact Us
            </span>
          </Link>
          <Link href="/baby-essentials">
            <span className={`text-primary hover:text-accent font-medium py-2 cursor-pointer ${isActive('/baby-essentials') ? 'active-tab' : ''}`}>
              Baby Essentials
            </span>
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
            <span
              className="block py-2 text-primary hover:text-accent font-medium cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </span>
          </Link>
          <Link href="/gear">
            <span
              className="block py-2 text-primary hover:text-accent font-medium cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            >
              Our Gear
            </span>
          </Link>
          <Link href="/baby-essentials">
            <span
              className="block py-2 text-primary hover:text-accent font-medium cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            >
              Baby Essentials
            </span>
          </Link>
          <Link href="/contact">
            <span
              className="block py-2 text-primary hover:text-accent font-medium cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact Us
            </span>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;