
import { useState, useEffect } from "react";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

const Footer = () => {
  const [priceGuideUrl, setPriceGuideUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchPriceGuide = async () => {
      try {
        // Try to get the metadata file from Firebase Storage
        const metadataRef = ref(storage, 'price-guide/metadata.json');
        const metadataUrl = await getDownloadURL(metadataRef);
        const response = await fetch(metadataUrl);
        
        if (response.ok) {
          const data = await response.json();
          setPriceGuideUrl(data.fileUrl);
        }
      } catch (error) {
        console.log("No price guide found or error fetching:", error);
      }
    };

    fetchPriceGuide();
  }, []);

  const handleTermsClick = () => {
    if (priceGuideUrl) {
      window.open(priceGuideUrl, '_blank');
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
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a></li>
              <li><a href="#gear" className="text-gray-300 hover:text-white transition-colors">Our Gear</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2 text-gray-300">
              <li>+27 72 125 7824</li>
              <li>hello@ballitobabygear.co.za</li>
              <li>Ballito, KwaZulu-Natal</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            © 2024 Ballito Baby Gear. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {priceGuideUrl && (
              <button 
                onClick={handleTermsClick}
                className="text-gray-300 hover:text-white text-sm transition-colors"
              >
                Terms & Conditions
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
