import { Link } from "wouter";
import { Facebook, Instagram, Phone, Mail, MapPin, Send } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import Logo from "@/components/ui/logo";

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Logo className="h-12 mb-4" />
            <p className="text-sm">
              Experience effortless holidays with your little ones. Ballito Baby Gear provides premium baby equipment rentals for families on vacation.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <span className="hover:text-accent transition-colors cursor-pointer">Home</span>
                </Link>
              </li>
              <li>
                <Link href="/gear">
                  <span className="hover:text-accent transition-colors cursor-pointer">Our Gear</span>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <span className="hover:text-accent transition-colors cursor-pointer">Contact Us</span>
                </Link>
              </li>
              <li>
                <span className="hover:text-accent transition-colors cursor-pointer">Terms & Conditions</span>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Phone className="text-accent mr-2" size={16} />
                <span>+27 82 123 4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="text-accent mr-2" size={16} />
                <span>hello@ballitobabygear.co.za</span>
              </li>
              <li className="flex items-center">
                <MapPin className="text-accent mr-2" size={16} />
                <span>Ballito, KwaZulu-Natal</span>
              </li>
            </ul>
          </div>
          
          {/* Follow Us and Newsletter */}
          <div>
            <h3 className="text-lg mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <span className="text-white hover:text-accent transition-colors cursor-pointer">
                <Facebook size={24} />
              </span>
              <span className="text-white hover:text-accent transition-colors cursor-pointer">
                <Instagram size={24} />
              </span>
              <span className="text-white hover:text-accent transition-colors cursor-pointer">
                <FaWhatsapp size={24} />
              </span>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg mb-4">Newsletter</h3>
              <form className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="p-2 rounded-l-lg w-full outline-none text-primary"
                />
                <button 
                  type="submit" 
                  className="bg-accent hover:bg-accent/90 text-white p-2 rounded-r-lg transition-colors"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-white/20 mt-8 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Ballito Baby Gear. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
