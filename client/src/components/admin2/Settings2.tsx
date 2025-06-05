
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Users, 
  Settings, 
  Image as ImageIcon,
  FileText,
  Shield
} from 'lucide-react';

const Settings2 = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(false);

  // User Management State
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingRole, setEditingRole] = useState(null);

  // Form States
  const [userForm, setUserForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    company: '',
    roleId: ''
  });

  const [roleForm, setRoleForm] = useState({
    name: '',
    description: '',
    permissions: []
  });

  // Price Guide State
  const [priceGuides, setPriceGuides] = useState([]);
  const [priceGuideForm, setPriceGuideForm] = useState({
    title: '',
    subtitle: '',
    linkUrl: ''
  });

  // Website Images State
  const [websiteImages, setWebsiteImages] = useState([]);
  const [imageForm, setImageForm] = useState({
    section: '',
    imageUrl: '',
    altText: ''
  });

  const availablePermissions = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'rates', label: 'Delivery Rates' },
    { id: 'contact-messages', label: 'Contact Messages' },
    { id: 'collaborations', label: 'Collaborations' },
    { id: 'settings', label: 'Settings' }
  ];

  const imageSections = [
    { id: 'hero', label: 'Hero Section' },
    { id: 'about', label: 'About Section' },
    { id: 'services', label: 'Services Section' },
    { id: 'footer', label: 'Footer' }
  ];

  // Fetch data on component mount
  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchPriceGuides();
    fetchWebsiteImages();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin-users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/roles');
      if (response.ok) {
        const data = await response.json();
        setRoles(data);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchPriceGuides = async () => {
    try {
      const response = await fetch('/api/price-guides');
      if (response.ok) {
        const data = await response.json();
        setPriceGuides(data);
      }
    } catch (error) {
      console.error('Error fetching price guides:', error);
    }
  };

  const fetchWebsiteImages = async () => {
    try {
      const response = await fetch('/api/website-images');
      if (response.ok) {
        const data = await response.json();
        setWebsiteImages(data);
      }
    } catch (error) {
      console.error('Error fetching website images:', error);
    }
  };

  const handleCreateUser = async () => {
    setLoading(true);
    try {
      const userData = {
        ...userForm,
        createdAt: new Date().toISOString(),
        hasPassword: false
      };

      const response = await fetch('/api/admin-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        toast({
          title: "User created successfully",
          description: "The user can now register their account using their email.",
        });
        setShowUserDialog(false);
        setUserForm({ email: '', firstName: '', lastName: '', company: '', roleId: '' });
        fetchUsers();
      } else {
        throw new Error('Failed to create user');
      }
    } catch (error) {
      toast({
        title: "Error creating user",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async () => {
    setLoading(true);
    try {
      const roleData = {
        ...roleForm,
        permissions: JSON.stringify(roleForm.permissions),
        createdAt: new Date().toISOString()
      };

      const response = await fetch('/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roleData)
      });

      if (response.ok) {
        toast({
          title: "Role created successfully",
        });
        setShowRoleDialog(false);
        setRoleForm({ name: '', description: '', permissions: [] });
        fetchRoles();
      } else {
        throw new Error('Failed to create role');
      }
    } catch (error) {
      toast({
        title: "Error creating role",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePriceGuide = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/price-guides', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(priceGuideForm)
      });

      if (response.ok) {
        toast({
          title: "Price guide updated successfully",
        });
        fetchPriceGuides();
      } else {
        throw new Error('Failed to update price guide');
      }
    } catch (error) {
      toast({
        title: "Error updating price guide",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateWebsiteImage = async () => {
    setLoading(true);
    try {
      const imageData = {
        ...imageForm,
        updatedAt: new Date().toISOString()
      };

      const response = await fetch('/api/website-images', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(imageData)
      });

      if (response.ok) {
        toast({
          title: "Website image updated successfully",
        });
        setImageForm({ section: '', imageUrl: '', altText: '' });
        fetchWebsiteImages();
      } else {
        throw new Error('Failed to update website image');
      }
    } catch (error) {
      toast({
        title: "Error updating website image",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (permission) => {
    setRoleForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users size={16} />
            Users
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Shield size={16} />
            Roles
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-2">
            <ImageIcon size={16} />
            Images
          </TabsTrigger>
          <TabsTrigger value="price-guide" className="flex items-center gap-2">
            <FileText size={16} />
            Price Guide
          </TabsTrigger>
        </TabsList>

        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle style={{ fontFamily: 'Gelica, serif' }}>Manage Users</CardTitle>
                  <CardDescription style={{ fontFamily: 'Figtree, sans-serif' }}>
                    Add and manage admin users who can access the portal
                  </CardDescription>
                </div>
                <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-accent hover:bg-accent/90">
                      <Plus size={16} className="mr-2" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle style={{ fontFamily: 'Gelica, serif' }}>Add New User</DialogTitle>
                      <DialogDescription style={{ fontFamily: 'Figtree, sans-serif' }}>
                        Create a new admin user. They will need to register using their email.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={userForm.email}
                          onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="user@example.com"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={userForm.firstName}
                            onChange={(e) => setUserForm(prev => ({ ...prev, firstName: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={userForm.lastName}
                            onChange={(e) => setUserForm(prev => ({ ...prev, lastName: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="company">Company (Optional)</Label>
                        <Input
                          id="company"
                          value={userForm.company}
                          onChange={(e) => setUserForm(prev => ({ ...prev, company: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="role">Role</Label>
                        <Select value={userForm.roleId} onValueChange={(value) => setUserForm(prev => ({ ...prev, roleId: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role.id} value={role.id.toString()}>
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowUserDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateUser} disabled={loading}>
                        {loading ? 'Creating...' : 'Create User'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => {
                  const userRole = roles.find(r => r.id === user.roleId);
                  return (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium" style={{ fontFamily: 'Figtree, sans-serif' }}>
                          {user.firstName} {user.lastName}
                        </h4>
                        <p className="text-sm text-gray-600" style={{ fontFamily: 'Figtree, sans-serif' }}>
                          {user.email} • {userRole?.name || 'No Role'} • {user.company || 'No Company'}
                        </p>
                        <p className="text-xs text-gray-500" style={{ fontFamily: 'Figtree, sans-serif' }}>
                          {user.hasPassword ? 'Account Active' : 'Pending Registration'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit2 size={14} />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle style={{ fontFamily: 'Gelica, serif' }}>Manage Roles</CardTitle>
                  <CardDescription style={{ fontFamily: 'Figtree, sans-serif' }}>
                    Create and manage user roles with specific permissions
                  </CardDescription>
                </div>
                <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-accent hover:bg-accent/90">
                      <Plus size={16} className="mr-2" />
                      Add Role
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle style={{ fontFamily: 'Gelica, serif' }}>Create New Role</DialogTitle>
                      <DialogDescription style={{ fontFamily: 'Figtree, sans-serif' }}>
                        Define a new role with specific permissions
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="roleName">Role Name</Label>
                        <Input
                          id="roleName"
                          value={roleForm.name}
                          onChange={(e) => setRoleForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Collaborator, Manager"
                        />
                      </div>
                      <div>
                        <Label htmlFor="roleDescription">Description</Label>
                        <Textarea
                          id="roleDescription"
                          value={roleForm.description}
                          onChange={(e) => setRoleForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe this role..."
                        />
                      </div>
                      <div>
                        <Label>Permissions</Label>
                        <div className="space-y-2 mt-2">
                          {availablePermissions.map((permission) => (
                            <div key={permission.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={permission.id}
                                checked={roleForm.permissions.includes(permission.id)}
                                onCheckedChange={() => togglePermission(permission.id)}
                              />
                              <Label htmlFor={permission.id} className="text-sm">
                                {permission.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateRole} disabled={loading}>
                        {loading ? 'Creating...' : 'Create Role'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roles.map((role) => {
                  const permissions = role.permissions ? JSON.parse(role.permissions) : [];
                  return (
                    <div key={role.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium" style={{ fontFamily: 'Figtree, sans-serif' }}>
                            {role.name}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Figtree, sans-serif' }}>
                            {role.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {permissions.map((permission) => {
                              const permLabel = availablePermissions.find(p => p.id === permission)?.label;
                              return (
                                <span key={permission} className="px-2 py-1 bg-accent/10 text-accent text-xs rounded">
                                  {permLabel}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit2 size={14} />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Website Images Tab */}
        <TabsContent value="images" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Gelica, serif' }}>Website Images</CardTitle>
              <CardDescription style={{ fontFamily: 'Figtree, sans-serif' }}>
                Manage images displayed throughout the website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="imageSection">Section</Label>
                  <Select value={imageForm.section} onValueChange={(value) => setImageForm(prev => ({ ...prev, section: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      {imageSections.map((section) => (
                        <SelectItem key={section.id} value={section.id}>
                          {section.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="altText">Alt Text</Label>
                  <Input
                    id="altText"
                    value={imageForm.altText}
                    onChange={(e) => setImageForm(prev => ({ ...prev, altText: e.target.value }))}
                    placeholder="Describe the image"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={imageForm.imageUrl}
                  onChange={(e) => setImageForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <Button onClick={handleUpdateWebsiteImage} disabled={loading}>
                {loading ? 'Updating...' : 'Update Image'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Price Guide Tab */}
        <TabsContent value="price-guide" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Gelica, serif' }}>Price Guide Management</CardTitle>
              <CardDescription style={{ fontFamily: 'Figtree, sans-serif' }}>
                Manage the price guide download link for the gear page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="guideTitle">Title</Label>
                  <Input
                    id="guideTitle"
                    value={priceGuideForm.title}
                    onChange={(e) => setPriceGuideForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Price Guide"
                  />
                </div>
                <div>
                  <Label htmlFor="guideSubtitle">Subtitle</Label>
                  <Input
                    id="guideSubtitle"
                    value={priceGuideForm.subtitle}
                    onChange={(e) => setPriceGuideForm(prev => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="Download our complete price list"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="guideLink">Download Link URL</Label>
                <Input
                  id="guideLink"
                  value={priceGuideForm.linkUrl}
                  onChange={(e) => setPriceGuideForm(prev => ({ ...prev, linkUrl: e.target.value }))}
                  placeholder="https://drive.google.com/file/d/..."
                />
              </div>
              <Button onClick={handleUpdatePriceGuide} disabled={loading}>
                {loading ? 'Updating...' : 'Update Price Guide'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings2;
