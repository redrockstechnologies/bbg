import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/context/AuthContext';
import LoginForm from '@/components/admin/LoginForm';
import GearManagement from '@/components/admin/GearManagement';
import TestimonialManagement from '@/components/admin/TestimonialManagement';
import ImagesManagement from '@/components/admin/ImagesManagement';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const Admin = () => {
  const { isAuthenticated, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<'gear' | 'testimonials' | 'images'>('gear');

  return (
    <>
      <Helmet>
        <title>Admin Portal | Ballito Baby Gear</title>
        <meta name="description" content="Admin portal for Ballito Baby Gear. Manage baby gear items and testimonials." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl mb-3 font-medium">Admin Portal</h1>
          <div className="w-24 h-1 bg-accent mx-auto mt-4"></div>
        </div>
        
        {!isAuthenticated ? (
          // Login Form
          <LoginForm />
        ) : (
          // Admin Dashboard
          <div id="admin-dashboard">
            <div className="mb-8 flex justify-between items-center">
              <h2 className="text-2xl">Dashboard</h2>
              <Button 
                onClick={logout}
                variant="outline"
                className="bg-gray-300 hover:bg-gray-400 text-primary py-2 px-4 rounded-full transition-colors flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </Button>
            </div>

            {/* Submenu */}
            <div className="flex space-x-4 mb-8 justify-center">
              <button
                className={`px-6 py-2 rounded-full font-medium transition-colors ${activeSection === 'gear' ? 'bg-accent text-white' : 'bg-gray-200 text-primary'}`}
                onClick={() => setActiveSection('gear')}
              >
                Gear Items
              </button>
              <button
                className={`px-6 py-2 rounded-full font-medium transition-colors ${activeSection === 'testimonials' ? 'bg-accent text-white' : 'bg-gray-200 text-primary'}`}
                onClick={() => setActiveSection('testimonials')}
              >
                Testimonials
              </button>
              <button
                className={`px-6 py-2 rounded-full font-medium transition-colors ${activeSection === 'images' ? 'bg-accent text-white' : 'bg-gray-200 text-primary'}`}
                onClick={() => setActiveSection('images')}
              >
                Images
              </button>
            </div>

            {/* Section Content */}
            {activeSection === 'gear' && <GearManagement />}
            {activeSection === 'testimonials' && <TestimonialManagement />}
            {activeSection === 'images' && <ImagesManagement />}
          </div>
        )}
      </div>
    </>
  );
};

export default Admin;
