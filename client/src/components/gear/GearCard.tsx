import { Button } from "@/components/ui/button";
import { useEnquiry } from "@/context/EnquiryContext";
import { useState } from "react";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { GearItem } from "./GearGrid";

interface GearCardProps {
  item: GearItem;
}

const GearCard = ({ item }: GearCardProps) => {
  const [isAdded, setIsAdded] = useState(false);
  const { addToEnquiry, isItemInEnquiry } = useEnquiry();
  const { toast } = useToast();
  
  const handleAddToEnquiry = () => {
    addToEnquiry(item);
    
    setIsAdded(true);
    toast({
      title: "Added to enquiry",
      description: `${item.ItemType} has been added to your enquiry.`,
      duration: 2000,
    });
    
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };
  
  const alreadyInEnquiry = isItemInEnquiry(item.id);
  
  return (
    <div className="gear-card bg-card rounded-lg shadow-lg overflow-hidden transition-all duration-300">
      <div className="p-4 flex flex-col items-center">
        <div className="w-40 h-40 rounded-full overflow-hidden mb-4" style={{ backgroundColor: '#FFFFFF' }}>
          <img 
            src={item.ImageUrl || "https://placehold.co/300x300?text=No+Image"} 
            alt={item.ItemType} 
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-xl mb-2">{item.ItemType}</h3>
        <div className="flex justify-center items-center w-full mb-2 gap-4">
          <div className="text-lg">Daily: <span className="font-bold">{item.DayCost}</span></div>
          <span className="mx-2 text-gray-400">|</span>
          <div className="text-lg">Weekly: <span className="font-bold">{item.WeekCost}</span></div>
        </div>
        <p className="text-sm text-center mb-4">{item.AdditionalDeets}</p>
        <Button 
          onClick={handleAddToEnquiry}
          disabled={alreadyInEnquiry}
          variant={alreadyInEnquiry ? "outline" : "default"}
          className={`w-full bg-accent hover:bg-accent/90 text-white py-2 px-6 rounded-full transition-colors ${
            alreadyInEnquiry ? "bg-primary" : ""
          }`}
        >
          {isAdded ? (
            <span className="flex items-center">
              <Check className="mr-2" size={16} />
              Added to Enquiry
            </span>
          ) : alreadyInEnquiry ? (
            "Already in Enquiry"
          ) : (
            "Add to Enquiry"
          )}
        </Button>
      </div>
    </div>
  );
};

export default GearCard;
