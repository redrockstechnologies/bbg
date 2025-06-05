import React, { useState } from 'react';
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
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const Admin = () => {
  const { isAuthenticated, logout } = useAuth();
  const [openSections, setOpenSections] = useState({
    products: false,
    priceGuide: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!isAuthenticated) {
    return (
      <>
        <Helmet>
          <title>Admin Portal | Ballito Baby Gear</title>
          <meta name="description" content="Admin portal for Ballito Baby Gear. Manage baby gear items and testimonials." />
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Portal | Ballito Baby Gear</title>
        <meta name="description" content="Admin portal for Ballito Baby Gear. Manage baby gear items and testimonials." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>
            <Button
              onClick={logout}
              variant="outline"
              className="bg-gray-300 hover:bg-gray-400 text-primary py-2 px-4 rounded-full transition-colors flex items-center gap-2"
            >
              <LogOut size={16} />
              Logout
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Product Management Section */}
            <div className="lg:col-span-2">
              <Collapsible open={openSections.products} onOpenChange={() => toggleSection('products')}>
                <CollapsibleTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xl font-semibold">Product Management</CardTitle>
                      {openSections.products ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                    </CardHeader>
                  </Card>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-6 mt-4">
                  <GearManagement />
                  <TestimonialManagement />
                  <DeliveryRatesManagement />
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* Price Guide Management Section */}
            <div className="lg:col-span-2">
              <Collapsible open={openSections.priceGuide} onOpenChange={() => toggleSection('priceGuide')}>
                <CollapsibleTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xl font-semibold">Price Guide Management</CardTitle>
                      {openSections.priceGuide ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                    </CardHeader>
                  </Card>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-6 mt-4">
                  <PriceGuideManagement />
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* Contact Messages - Always visible */}
            <div className="lg:col-span-2">
              <ContactMessagesManagement />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;