
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

type PriceGuide = {
  id: number;
  title: string;
  subtitle: string;
  fileUrl?: string;
  fileName?: string;
};

const PriceGuide = () => {
  const [priceGuide, setPriceGuide] = useState<PriceGuide | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPriceGuide = async () => {
      try {
        const response = await fetch("/api/price-guide");
        if (response.ok) {
          const data = await response.json();
          setPriceGuide(data);
        }
      } catch (error) {
        console.error("Error fetching price guide:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPriceGuide();
  }, []);

  const handleDownload = () => {
    if (priceGuide?.fileUrl) {
      window.open(priceGuide.fileUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <section className="mb-16 mt-20">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto mb-8"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!priceGuide) return null;

  return (
    <section className="mb-16 mt-20">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl mb-3 font-medium">{priceGuide.title}</h2>
        <div className="w-24 h-1 bg-accent mx-auto mb-6"></div>
        <p className="text-primary text-lg max-w-4xl mx-auto mb-8">
          <strong>{priceGuide.subtitle}</strong>
        </p>
        
        {priceGuide.fileUrl && (
          <Button
            onClick={handleDownload}
            className="bg-accent hover:bg-accent/90 text-white px-8 py-3 rounded-full text-lg font-medium transition-colors flex items-center mx-auto"
          >
            <Download size={20} className="mr-2" />
            Download Price Guide
          </Button>
        )}
        
        {!priceGuide.fileUrl && (
          <p className="text-gray-500 italic">Price guide will be available soon</p>
        )}
      </div>
    </section>
  );
};

export default PriceGuide;
