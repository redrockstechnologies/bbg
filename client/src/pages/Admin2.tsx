
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/context/AuthContext';
import LoginForm from '@/components/admin/LoginForm';
import { Button } from '@/components/ui/button';
import { 
  LogOut, 
  LayoutDashboard, 
  Package, 
  MessageSquare, 
  DollarSign, 
  Mail, 
  Users, 
  Settings,
  ArrowLeft
} from 'lucide-react';

// Import existing components
import GearManagement from '@/components/admin/GearManagement';
import TestimonialManagement from "@/components/admin/TestimonialManagement";
import DeliveryRatesManagement from "@/components/admin/DeliveryRatesManagement";
import ContactMessagesManagement from "@/components/admin/ContactMessagesManagement";

// New components we'll create
import Dashboard2 from '@/components/admin2/Dashboard2';
import Settings2 from '@/components/admin2/Settings2';
import Collaborations2 from '@/components/admin2/Collaborations2';

const Admin2 = () => {
  const { isAuthenticated, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<'dashboard' | 'inventory' | 'testimonials' | 'rates' | 'contact-messages' | 'collaborations' | 'settings'>('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'rates', label: 'Rates', icon: DollarSign },
    { id: 'contact-messages', label: 'Contact Messages', icon: Mail },
    { id: 'collaborations', label: 'Collaborations', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard2 />;
      case 'inventory':
        return <GearManagement />;
      case 'testimonials':
        return <TestimonialManagement />;
      case 'rates':
        return <DeliveryRatesManagement />;
      case 'contact-messages':
        return <ContactMessagesManagement />;
      case 'collaborations':
        return <Collaborations2 />;
      case 'settings':
        return <Settings2 />;
      default:
        return <Dashboard2 />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Portal 2.0 | Ballito Baby Gear</title>
        <meta name="description" content="New admin portal for Ballito Baby Gear. Manage baby gear items and testimonials." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {!isAuthenticated ? (
        <div className="container mx-auto px-4 py-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl mb-3 font-medium" style={{ fontFamily: 'Gelica, serif' }}>Admin Portal 2.0</h1>
            <div className="w-24 h-1 bg-accent mx-auto mt-4"></div>
          </div>
          <LoginForm />
        </div>
      ) : (
        <div className="flex h-screen bg-gray-50">
          {/* Sidebar */}
          <div className="w-64 bg-white shadow-lg flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-xl font-bold text-accent" style={{ fontFamily: 'Gelica, serif' }}>
                Ballito Baby Gear
              </h1>
              <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Figtree, sans-serif' }}>
                Admin Portal 2.0
              </p>
            </div>

            {/* User greeting */}
            <div className="p-4 bg-accent/5 border-b border-gray-200">
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Figtree, sans-serif' }}>
                Welcome back,
              </p>
              <p className="font-medium text-accent" style={{ fontFamily: 'Figtree, sans-serif' }}>
                Admin User
              </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveSection(item.id as any)}
                        className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                          activeSection === item.id
                            ? 'bg-accent text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        style={{ fontFamily: 'Figtree, sans-serif' }}
                      >
                        <Icon size={20} className="mr-3" />
                        {item.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 space-y-2">
              <Button 
                onClick={() => window.location.href = '/admin'}
                variant="outline"
                className="w-full justify-start"
                style={{ fontFamily: 'Figtree, sans-serif' }}
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to Old Portal
              </Button>
              <Button 
                onClick={logout}
                variant="outline"
                className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                style={{ fontFamily: 'Figtree, sans-serif' }}
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top bar */}
            <div className="bg-white shadow-sm border-b border-gray-200 p-4">
              <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Gelica, serif' }}>
                {menuItems.find(item => item.id === activeSection)?.label}
              </h2>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-auto p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Admin2;
