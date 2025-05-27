import { Link } from "wouter";
import { Phone, Mail, MapPin } from "lucide-react";
import Logo from "@/components/ui/logo";

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <Logo className="h-12 mb-4" variant="footer" />
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
                <span>+27 72 125 7824</span>
              </li>
              <li className="flex items-center">
                <Mail className="text-accent mr-2" size={16} />
                <span>hello.jmbabysitting@gmail.com</span>
              </li>
              <li className="flex items-center">
                <MapPin className="text-accent mr-2" size={16} />
                <span>Ballito, KwaZulu-Natal</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
