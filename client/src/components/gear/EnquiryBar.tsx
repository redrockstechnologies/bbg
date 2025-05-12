import { useEnquiry } from "@/context/EnquiryContext";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useLocation } from "wouter";

const EnquiryBar = () => {
  const { enquiryItems, clearEnquiry } = useEnquiry();
  const [isExpanded, setIsExpanded] = useState(false);
  const [, navigate] = useLocation();
  
  const enquiryCount = enquiryItems.length;
  
  // Only show the enquiry bar if there are items in the enquiry
  const isVisible = enquiryCount > 0;
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  const handleProceedToContact = () => {
    navigate("/contact");
  };
  
  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <span className="font-medium">Your Enquiry:</span>
            <span className="ml-2">{enquiryCount} item{enquiryCount !== 1 ? "s" : ""}</span>
          </div>
          <div className="flex space-x-4">
            <Button 
              onClick={toggleExpand}
              variant="outline"
              className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-full transition-colors"
            >
              {isExpanded ? (
                <span className="flex items-center">
                  <ChevronDown size={16} className="mr-1" />
                  Hide Details
                </span>
              ) : (
                <span className="flex items-center">
                  <ChevronUp size={16} className="mr-1" />
                  View Details
                </span>
              )}
            </Button>
            <Button 
              onClick={handleProceedToContact}
              className="bg-accent hover:bg-accent/90 text-white py-2 px-4 rounded-full transition-colors"
            >
              Proceed to Contact
            </Button>
          </div>
        </div>
        
        {/* Expanded details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="font-medium mb-3">Enquiry Items:</h4>
            <div className="max-h-48 overflow-y-auto">
              {enquiryItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center mb-2 pb-2 border-b border-gray-100">
                  <span>{item.ItemType}</span>
                  <div className="flex space-x-4">
                    <span>Daily: {item.DayCost}</span>
                    <span>Weekly: {item.WeekCost}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-right">
              <Button 
                onClick={clearEnquiry}
                variant="destructive"
                className="text-sm"
              >
                Clear All
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnquiryBar;
