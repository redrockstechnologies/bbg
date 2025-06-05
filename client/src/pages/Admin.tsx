
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import LoginForm from "@/components/admin/LoginForm";
import GearManagement from "@/components/admin/GearManagement";
import ContactMessagesManagement from "@/components/admin/ContactMessagesManagement";
import DeliveryRatesManagement from "@/components/admin/DeliveryRatesManagement";
import TestimonialManagement from "@/components/admin/TestimonialManagement";
import PriceGuideManagement from "@/components/admin/PriceGuideManagement";
import { ChevronDown, ChevronRight, Package, MessageSquare, Truck, Star, FileText } from "lucide-react";

const Admin = () => {
  const { user } = useAuth();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    gear: true,
    priceGuide: false,
    messages: false,
    delivery: false,
    testimonials: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h1 className="text-2xl mb-6 text-center">Admin Login</h1>
          <LoginForm />
        </div>
      </div>
    );
  }

  const sections = [
    {
      id: 'gear',
      title: 'Product Management',
      icon: Package,
      component: <GearManagement />
    },
    {
      id: 'priceGuide',
      title: 'Price Guide Management',
      icon: FileText,
      component: <PriceGuideManagement />
    },
    {
      id: 'messages',
      title: 'Contact Messages',
      icon: MessageSquare,
      component: <ContactMessagesManagement />
    },
    {
      id: 'delivery',
      title: 'Delivery Rates',
      icon: Truck,
      component: <DeliveryRatesManagement />
    },
    {
      id: 'testimonials',
      title: 'Testimonials',
      icon: Star,
      component: <TestimonialManagement />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back! Manage your Ballito Baby Gear content below.</p>
        </div>

        <div className="space-y-6">
          {sections.map((section) => {
            const Icon = section.icon;
            const isExpanded = expandedSections[section.id];
            
            return (
              <div key={section.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-6 py-4 bg-white hover:bg-gray-50 flex items-center justify-between transition-colors border-b border-gray-200"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="text-accent" size={24} />
                    <h2 className="text-xl font-medium">{section.title}</h2>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="text-gray-400" size={20} />
                  ) : (
                    <ChevronRight className="text-gray-400" size={20} />
                  )}
                </button>
                
                {isExpanded && (
                  <div className="p-6">
                    {section.component}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Admin;
