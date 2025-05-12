import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

// Type for gear item in enquiry
export type EnquiryItem = {
  id: string;
  ItemType: string;
  DayCost: string;
  WeekCost: string;
  AdditionalDeets?: string;
  ImageUrl?: string;
};

// Interface for the context value
interface EnquiryContextValue {
  enquiryItems: EnquiryItem[];
  addToEnquiry: (item: EnquiryItem) => void;
  removeFromEnquiry: (itemId: string) => void;
  clearEnquiry: () => void;
  isItemInEnquiry: (itemId: string) => boolean;
}

// Create the context
const EnquiryContext = createContext<EnquiryContextValue | null>(null);

// Provider component
interface EnquiryProviderProps {
  children: ReactNode;
}

export const EnquiryProvider = ({ children }: EnquiryProviderProps) => {
  const [enquiryItems, setEnquiryItems] = useState<EnquiryItem[]>([]);
  const { toast } = useToast();

  // Add item to enquiry
  const addToEnquiry = (item: EnquiryItem) => {
    if (isItemInEnquiry(item.id)) {
      toast({
        title: "Already in enquiry",
        description: `${item.ItemType} is already in your enquiry.`,
        duration: 3000,
      });
      return;
    }
    
    setEnquiryItems((prev) => [...prev, item]);
    
    toast({
      title: "Added to enquiry",
      description: `${item.ItemType} has been added to your enquiry.`,
      duration: 2000,
    });
  };

  // Remove item from enquiry
  const removeFromEnquiry = (itemId: string) => {
    setEnquiryItems((prev) => prev.filter((item) => item.id !== itemId));
    
    toast({
      title: "Removed from enquiry",
      description: "Item has been removed from your enquiry.",
      duration: 2000,
    });
  };

  // Clear all items from enquiry
  const clearEnquiry = () => {
    setEnquiryItems([]);
    
    toast({
      title: "Enquiry cleared",
      description: "All items have been removed from your enquiry.",
      duration: 2000,
    });
  };

  // Check if an item is already in the enquiry
  const isItemInEnquiry = (itemId: string) => {
    return enquiryItems.some((item) => item.id === itemId);
  };

  const value: EnquiryContextValue = {
    enquiryItems,
    addToEnquiry,
    removeFromEnquiry,
    clearEnquiry,
    isItemInEnquiry,
  };

  return (
    <EnquiryContext.Provider value={value}>
      {children}
    </EnquiryContext.Provider>
  );
};

// Custom hook to use the enquiry context
export const useEnquiry = () => {
  const context = useContext(EnquiryContext);
  if (!context) {
    throw new Error("useEnquiry must be used within an EnquiryProvider");
  }
  return context;
};
