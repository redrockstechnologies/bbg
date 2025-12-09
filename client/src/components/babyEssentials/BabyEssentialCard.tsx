
import { Button } from "@/components/ui/button";
import { useEnquiry } from "@/context/EnquiryContext";
import { useState } from "react";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { BabyEssentialItem } from "./BabyEssentialsGrid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface BabyEssentialCardProps {
  item: BabyEssentialItem;
}

const BabyEssentialCard = ({ item }: BabyEssentialCardProps) => {
  const [isAdded, setIsAdded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<string>("");
  const { addToEnquiry, removeFromEnquiry, isItemInEnquiry } = useEnquiry();
  const { toast } = useToast();
  
  const handleOpenModal = () => {
    if (item.deliveryOptions && item.deliveryOptions.length > 0) {
      setSelectedDelivery(item.deliveryOptions[0].name);
    }
    setIsModalOpen(true);
  };

  const handleConfirmEnquiry = () => {
    const selectedOption = item.deliveryOptions.find(
      (option) => option.name === selectedDelivery
    );

    if (!selectedOption) {
      toast({
        title: "Error",
        description: "Please select a delivery option.",
        duration: 2000,
      });
      return;
    }

    // Convert baby essential item to enquiry item format with delivery option
    const enquiryItem = {
      id: `${item.id}-${selectedDelivery}`,
      title: `${item.name} (${selectedOption.name})`,
      description: `${item.brand} - ${item.description}`,
      imageUrl: item.imageUrl,
      dailyPrice: item.price + selectedOption.price,
      weeklyPrice: null,
      isActive: item.status
    };
    
    addToEnquiry(enquiryItem);
    
    setIsAdded(true);
    setIsModalOpen(false);
    toast({
      title: "Added to enquiry",
      description: `${item.name} with ${selectedOption.name} has been added to your enquiry.`,
      duration: 2000,
    });
    
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const handleRemoveFromEnquiry = () => {
    // Remove all variants of this item from enquiry
    const itemVariants = item.deliveryOptions.map(option => `${item.id}-${option.name}`);
    itemVariants.forEach(variantId => {
      if (isItemInEnquiry(variantId)) {
        removeFromEnquiry(variantId);
      }
    });
  };
  
  const alreadyInEnquiry = item.deliveryOptions.some(option => 
    isItemInEnquiry(`${item.id}-${option.name}`)
  );
  
  return (
    <>
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
          <p className="text-sm text-center mb-4">{item.description}</p>
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
              onClick={handleOpenModal}
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Delivery Option</DialogTitle>
            <DialogDescription>
              Choose how you'd like to receive {item.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <RadioGroup value={selectedDelivery} onValueChange={setSelectedDelivery}>
              {item.deliveryOptions.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={option.name} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{option.name}</span>
                      <span className="text-sm text-gray-600">+R{option.price}</span>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Total Price:</span>
                <span className="text-lg font-bold text-accent">
                  R{item.price + (item.deliveryOptions.find(o => o.name === selectedDelivery)?.price || 0)}
                </span>
              </div>
              <Button 
                onClick={handleConfirmEnquiry}
                className="w-full bg-accent hover:bg-accent/90 text-white rounded-full"
              >
                Confirm & Add to Enquiry
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BabyEssentialCard;
