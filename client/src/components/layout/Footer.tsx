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
                  <a className="hover:text-accent transition-colors">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/gear">
                  <a className="hover:text-accent transition-colors">Our Gear</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="hover:text-accent transition-colors">Contact Us</a>
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">Terms & Conditions</a>
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
              <a href="#" className="text-white hover:text-accent transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-white hover:text-accent transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-white hover:text-accent transition-colors">
                <FaWhatsapp size={24} />
              </a>
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
