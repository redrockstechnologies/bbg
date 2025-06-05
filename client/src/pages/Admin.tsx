
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import LoginForm from "@/components/admin/LoginForm";
import GearManagement from "@/components/admin/GearManagement";
import TestimonialManagement from "@/components/admin/TestimonialManagement";
import ContactMessagesManagement from "@/components/admin/ContactMessagesManagement";
import DeliveryRatesManagement from "@/components/admin/DeliveryRatesManagement";
import PriceGuideManagement from "@/components/admin/PriceGuideManagement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";

const Admin = () => {
  const { isAuthenticated } = useAuth();
  const [productSectionOpen, setProductSectionOpen] = useState(true);
  const [priceGuideSectionOpen, setPriceGuideSectionOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <LoginForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your baby gear rental business</p>
        </div>

        <div className="space-y-6">
          {/* Product Management Section */}
          <Card className="shadow-lg">
            <Collapsible open={productSectionOpen} onOpenChange={setProductSectionOpen}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <span>Product Management</span>
                    {productSectionOpen ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-8">
                  <GearManagement />
                  <TestimonialManagement />
                  <DeliveryRatesManagement />
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Price Guide Management Section */}
          <Card className="shadow-lg">
            <Collapsible open={priceGuideSectionOpen} onOpenChange={setPriceGuideSectionOpen}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <span>Price Guide Management</span>
                    {priceGuideSectionOpen ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <PriceGuideManagement />
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Contact Messages - Always visible */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Contact Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactMessagesManagement />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
