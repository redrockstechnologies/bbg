
import React, { useState } from 'react';
import { Settings, Users, Image, FileText, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ImagesManagement from '@/components/admin/ImagesManagement';

interface User {
  id: number;
  email: string;
  firstName: string;
  company: string;
  privileges: string[];
}

const Settings2 = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'images' | 'price-guide'>('users');
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      email: 'admin@ballitobabygear.com',
      firstName: 'Admin',
      company: 'Ballito Baby Gear',
      privileges: ['dashboard', 'inventory', 'testimonials', 'rates', 'contact-messages', 'settings']
    }
  ]);
  const [priceGuideLink, setPriceGuideLink] = useState('');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    firstName: '',
    company: '',
    privileges: [] as string[]
  });

  const privilegeOptions = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'rates', label: 'Rates' },
    { id: 'contact-messages', label: 'Contact Messages' },
    { id: 'collaborations', label: 'Collaborations' },
    { id: 'settings', label: 'Settings' }
  ];

  const handleAddUser = () => {
    if (newUser.email && newUser.firstName) {
      const user: User = {
        id: Date.now(),
        ...newUser
      };
      setUsers([...users, user]);
      setNewUser({ email: '', firstName: '', company: '', privileges: [] });
      setIsAddingUser(false);
    }
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const togglePrivilege = (privilege: string) => {
    setNewUser({
      ...newUser,
      privileges: newUser.privileges.includes(privilege)
        ? newUser.privileges.filter(p => p !== privilege)
        : [...newUser.privileges, privilege]
    });
  };

  const tabs = [
    { id: 'users', label: 'Manage Users', icon: Users },
    { id: 'images', label: 'Images', icon: Image },
    { id: 'price-guide', label: 'Price Guide', icon: FileText }
  ];

  return (
    <div className="space-y-6">
      {/* Tab navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-accent text-accent'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                style={{ fontFamily: 'Figtree, sans-serif' }}
              >
                <Icon className="mr-2 h-5 w-5" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab content */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Gelica, serif' }}>
                Manage Users
              </h3>
              <p className="text-gray-600 mt-1" style={{ fontFamily: 'Figtree, sans-serif' }}>
                Add and manage admin users and their access privileges
              </p>
            </div>
            <Button
              onClick={() => setIsAddingUser(true)}
              className="bg-accent hover:bg-accent/90"
              style={{ fontFamily: 'Figtree, sans-serif' }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>

          {/* Add user form */}
          {isAddingUser && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-medium text-gray-800 mb-4" style={{ fontFamily: 'Figtree, sans-serif' }}>
                Add New User
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'Figtree, sans-serif' }}>
                    Email
                  </label>
                  <Input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="user@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'Figtree, sans-serif' }}>
                    First Name
                  </label>
                  <Input
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                    placeholder="John"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'Figtree, sans-serif' }}>
                  Company
                </label>
                <Input
                  value={newUser.company}
                  onChange={(e) => setNewUser({ ...newUser, company: e.target.value })}
                  placeholder="Company Name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Figtree, sans-serif' }}>
                  Privileges
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {privilegeOptions.map((privilege) => (
                    <label key={privilege.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newUser.privileges.includes(privilege.id)}
                        onChange={() => togglePrivilege(privilege.id)}
                        className="mr-2 rounded border-gray-300 text-accent focus:ring-accent"
                      />
                      <span className="text-sm text-gray-700" style={{ fontFamily: 'Figtree, sans-serif' }}>
                        {privilege.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setIsAddingUser(false)}
                  style={{ fontFamily: 'Figtree, sans-serif' }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddUser}
                  className="bg-accent hover:bg-accent/90"
                  style={{ fontFamily: 'Figtree, sans-serif' }}
                >
                  Add User
                </Button>
              </div>
            </div>
          )}

          {/* Users list */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Figtree, sans-serif' }}>
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Figtree, sans-serif' }}>
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Figtree, sans-serif' }}>
                    Privileges
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Figtree, sans-serif' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Figtree, sans-serif' }}>
                          {user.firstName}
                        </div>
                        <div className="text-sm text-gray-500" style={{ fontFamily: 'Figtree, sans-serif' }}>
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" style={{ fontFamily: 'Figtree, sans-serif' }}>
                      {user.company}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.privileges.map((privilege) => (
                          <span
                            key={privilege}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent"
                            style={{ fontFamily: 'Figtree, sans-serif' }}
                          >
                            {privilegeOptions.find(p => p.id === privilege)?.label}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'images' && (
        <div>
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Gelica, serif' }}>
              Image Management
            </h3>
            <p className="text-gray-600 mt-1" style={{ fontFamily: 'Figtree, sans-serif' }}>
              Upload and manage images for your website
            </p>
          </div>
          <ImagesManagement />
        </div>
      )}

      {activeTab === 'price-guide' && (
        <div>
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Gelica, serif' }}>
              Price Guide Management
            </h3>
            <p className="text-gray-600 mt-1" style={{ fontFamily: 'Figtree, sans-serif' }}>
              Set the link for your price guide PDF
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Figtree, sans-serif' }}>
                  Price Guide PDF Link
                </label>
                <Input
                  type="url"
                  value={priceGuideLink}
                  onChange={(e) => setPriceGuideLink(e.target.value)}
                  placeholder="https://example.com/price-guide.pdf"
                  className="mb-2"
                />
                <p className="text-sm text-gray-500" style={{ fontFamily: 'Figtree, sans-serif' }}>
                  Enter the direct link to your price guide PDF. This will be used when customers click the download button.
                </p>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  className="bg-accent hover:bg-accent/90"
                  style={{ fontFamily: 'Figtree, sans-serif' }}
                >
                  Save Link
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings2;
