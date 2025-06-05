
import { useState, useEffect } from "react";

const Footer = () => {
  const [priceGuideExists, setPriceGuideExists] = useState<boolean>(false);

  useEffect(() => {
    const fetchPriceGuide = async () => {
      try {
        const response = await fetch('/api/price-guide');
        if (response.ok) {
          const data = await response.json();
          setPriceGuideExists(data.exists);
        }
      } catch (error) {
        console.log("Error fetching price guide:", error);
      }
    };

    fetchPriceGuide();
  }, []);

  const handleTermsClick = () => {
    if (priceGuideExists) {
      window.open('/api/price-guide/download', '_blank');
    }
  };

  return (
    <footer className="bg-primary text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <img 
                src="/assets/BBG_Footer.png" 
                alt="Ballito Baby Gear" 
                className="h-12 w-auto mr-3"
              />
            </div>
            <p className="text-gray-300 mb-4">
              Making family holidays stress-free with quality baby gear rentals in Ballito and surrounding areas.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
              <li><a href="/gear" className="text-gray-300 hover:text-white transition-colors">Our Gear</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
              {priceGuideExists && (
                <li>
                  <button 
                    onClick={handleTermsClick}
                    className="text-gray-300 hover:text-white transition-colors text-left"
                  >
                    Price Guide
                  </button>
                </li>
              )}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-medium mb-4">Contact Info</h3>
            <div className="space-y-2 text-gray-300">
              <p>+27 72 125 7824</p>
              <p>hello@ballitobabygear.co.za</p>
              <p>Ballito & surrounding areas</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 Ballito Baby Gear. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
