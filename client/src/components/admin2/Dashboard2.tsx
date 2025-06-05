
import React, { useEffect, useState } from 'react';
import { Package, MessageSquare, Mail, TrendingUp } from 'lucide-react';

interface DashboardStats {
  gearItems: number;
  testimonials: number;
  contactMessages: number;
  unreadMessages: number;
}

const Dashboard2 = () => {
  const [stats, setStats] = useState<DashboardStats>({
    gearItems: 0,
    testimonials: 0,
    contactMessages: 0,
    unreadMessages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [gearResponse, testimonialsResponse, contactResponse] = await Promise.all([
          fetch('/api/gear'),
          fetch('/api/testimonials'),
          fetch('/api/contact')
        ]);

        const gearData = await gearResponse.json();
        const testimonialsData = await testimonialsResponse.json();
        const contactData = await contactResponse.json();

        const unreadCount = contactData.filter((msg: any) => !msg.archived).length;

        setStats({
          gearItems: gearData.length,
          testimonials: testimonialsData.length,
          contactMessages: contactData.length,
          unreadMessages: unreadCount
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Inventory Items',
      value: stats.gearItems,
      icon: Package,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Testimonials',
      value: stats.testimonials,
      icon: MessageSquare,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Messages',
      value: stats.contactMessages,
      icon: Mail,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Unread Messages',
      value: stats.unreadMessages,
      icon: TrendingUp,
      color: 'bg-accent',
      bgColor: 'bg-pink-50',
      textColor: 'text-accent'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome message */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Gelica, serif' }}>
          Welcome to your Dashboard
        </h3>
        <p className="text-gray-600" style={{ fontFamily: 'Figtree, sans-serif' }}>
          Here's an overview of your Ballito Baby Gear business metrics.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: 'Figtree, sans-serif' }}>
                    {card.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-800" style={{ fontFamily: 'Gelica, serif' }}>
                    {card.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${card.bgColor}`}>
                  <Icon className={`h-6 w-6 ${card.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: 'Gelica, serif' }}>
          Quick Actions
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:border-accent hover:bg-accent/5 transition-colors text-left">
            <h5 className="font-medium text-gray-800 mb-1" style={{ fontFamily: 'Figtree, sans-serif' }}>
              Add New Gear Item
            </h5>
            <p className="text-sm text-gray-600" style={{ fontFamily: 'Figtree, sans-serif' }}>
              Quickly add new inventory
            </p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:border-accent hover:bg-accent/5 transition-colors text-left">
            <h5 className="font-medium text-gray-800 mb-1" style={{ fontFamily: 'Figtree, sans-serif' }}>
              View Messages
            </h5>
            <p className="text-sm text-gray-600" style={{ fontFamily: 'Figtree, sans-serif' }}>
              Check customer inquiries
            </p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:border-accent hover:bg-accent/5 transition-colors text-left">
            <h5 className="font-medium text-gray-800 mb-1" style={{ fontFamily: 'Figtree, sans-serif' }}>
              Update Rates
            </h5>
            <p className="text-sm text-gray-600" style={{ fontFamily: 'Figtree, sans-serif' }}>
              Manage delivery rates
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard2;
