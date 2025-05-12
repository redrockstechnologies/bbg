import React from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/context/AuthContext';
import LoginForm from '@/components/admin/LoginForm';
import GearManagement from '@/components/admin/GearManagement';
import TestimonialManagement from '@/components/admin/TestimonialManagement';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const Admin = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <>
      <Helmet>
        <title>Admin Portal | Ballito Baby Gear</title>
        <meta name="description" content="Admin portal for Ballito Baby Gear. Manage baby gear items and testimonials." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl mb-3">Admin Portal</h1>
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
            
            {/* Gear Management */}
            <GearManagement />
            
            {/* Testimonials Management */}
            <TestimonialManagement />
          </div>
        )}
      </div>
    </>
  );
};

export default Admin;
