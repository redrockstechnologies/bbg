
import { Button } from "@/components/ui/button";
import { useEnquiry } from "@/context/EnquiryContext";
import { useState } from "react";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { BabyEssentialItem } from "./BabyEssentialsGrid";

interface BabyEssentialCardProps {
  item: BabyEssentialItem;
}

const BabyEssentialCard = ({ item }: BabyEssentialCardProps) => {
  const [isAdded, setIsAdded] = useState(false);
  const { addToEnquiry, removeFromEnquiry, isItemInEnquiry } = useEnquiry();
  const { toast } = useToast();
  
  const handleAddToEnquiry = () => {
    // Convert baby essential item to enquiry item format
    const enquiryItem = {
      id: item.id,
      title: item.name,
      description: `${item.brand} - ${item.description}`,
      imageUrl: item.imageUrl,
      dailyPrice: item.price,
      weeklyPrice: null,
      isActive: item.status
    };
    
    addToEnquiry(enquiryItem);
    
    setIsAdded(true);
    toast({
      title: "Added to enquiry",
      description: `${item.name} has been added to your enquiry.`,
      duration: 2000,
    });
    
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const handleRemoveFromEnquiry = () => {
    removeFromEnquiry(item.id);
  };
  
  const alreadyInEnquiry = isItemInEnquiry(item.id);
  
  return (
    <div className="gear-card bg-card rounded-lg shadow-lg overflow-hidden transition-all duration-300">
      <div className="p-4 flex flex-col items-center">
        <div className="w-40 h-40 rounded-full overflow-hidden mb-4" style={{ backgroundColor: '#FFFFFF' }}>
          <img 
            src={item.imageUrl || "https://placehold.co/300x300?text=No+Image"} 
            alt={item.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-xl mb-1">{item.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{item.brand}</p>
        <div className="flex justify-center items-center w-full mb-2">
          <div className="text-lg">Price: <span className="font-bold">R{item.price}</span></div>
        </div>
        <p className="text-sm text-center mb-2">{item.description}</p>
        {item.deliveryOptions && item.deliveryOptions.length > 0 && (
          <div className="text-xs text-gray-600 mb-4">
            <p className="font-semibold">Delivery Options:</p>
            {item.deliveryOptions.map((option, index) => (
              <p key={index}>{option.name}: R{option.price}</p>
            ))}
          </div>
        )}
        {alreadyInEnquiry ? (
          <div className="flex gap-2 w-full">
            <Button 
              disabled
              variant="outline"
              className="flex-grow bg-primary text-white rounded-full"
            >
              Already in Enquiry
            </Button>
            <Button 
              onClick={handleRemoveFromEnquiry}
              variant="destructive"
              size="icon"
              className="rounded-full"
            >
              ✕
            </Button>
          </div>
        ) : (
          <Button 
            onClick={handleAddToEnquiry}
            className="w-full bg-accent hover:bg-accent/90 text-white py-2 px-6 rounded-full transition-colors"
          >
            {isAdded ? (
              <span className="flex items-center">
                <Check className="mr-2" size={16} />
                Added to Enquiry
              </span>
            ) : (
              "Add to Enquiry"
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default BabyEssentialCard;
