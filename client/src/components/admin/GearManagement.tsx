import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Schema for gear items
const gearItemSchema = z.object({
  ItemType: z.string().min(1, "Item type is required"),
  DayCost: z.string().min(1, "Daily cost is required"),
  WeekCost: z.string().min(1, "Weekly cost is required"),
  AdditionalDeets: z.string().optional(),
});

type GearItemFormValues = z.infer<typeof gearItemSchema>;

type GearItem = GearItemFormValues & {
  id: string;
  ImageUrl?: string;
};

const GearManagement = () => {
  const [gearItems, setGearItems] = useState<GearItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<GearItem | null>(null);
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  // Form setup
  const form = useForm<GearItemFormValues>({
    resolver: zodResolver(gearItemSchema),
    defaultValues: {
      ItemType: "",
      DayCost: "",
      WeekCost: "",
      AdditionalDeets: "",
    },
  });
  
  // Fetch gear items on mount
  useEffect(() => {
    fetchGearItems();
  }, []);
  
  // Reset form when editing item changes
  useEffect(() => {
    if (editingItem) {
      form.reset({
        ItemType: editingItem.ItemType,
        DayCost: editingItem.DayCost,
        WeekCost: editingItem.WeekCost,
        AdditionalDeets: editingItem.AdditionalDeets || "",
      });
    } else {
      form.reset({
        ItemType: "",
        DayCost: "",
        WeekCost: "",
        AdditionalDeets: "",
      });
    }
  }, [editingItem, form]);
  
  // Fetch gear items from Firestore
  const fetchGearItems = async () => {
    try {
      const gearRef = collection(db, "gear");
      const snapshot = await getDocs(gearRef);
      const fetchedItems: GearItem[] = [];
      
      snapshot.forEach((doc) => {
        fetchedItems.push({
          id: doc.id,
          ...doc.data() as Omit<GearItem, 'id'>
        });
      });
      
      setGearItems(fetchedItems);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching gear items:", error);
      toast({
        title: "Error",
        description: "Failed to load gear items",
        variant: "destructive",
      });
      setLoading(false);
    }
  };
  
  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileUpload(e.target.files[0]);
    }
  };
  
  // Handle form submission (add/edit)
  const onSubmit = async (data: GearItemFormValues) => {
    setIsSubmitting(true);
    
    try {
      let imageUrl = editingItem?.ImageUrl || "";
      
      // Upload image if selected
      if (fileUpload) {
        const storageRef = ref(storage, `gear/${Date.now()}_${fileUpload.name}`);
        const uploadResult = await uploadBytes(storageRef, fileUpload);
        imageUrl = await getDownloadURL(uploadResult.ref);
      }
      
      if (editingItem) {
        // Update existing item
        await updateDoc(doc(db, "gear", editingItem.id), {
          ...data,
          ImageUrl: imageUrl,
        });
        
        toast({
          title: "Success",
          description: "Gear item updated successfully",
        });
      } else {
        // Add new item
        await addDoc(collection(db, "gear"), {
          ...data,
          ImageUrl: imageUrl,
        });
        
        toast({
          title: "Success",
          description: "Gear item added successfully",
        });
      }
      
      // Reset and refresh
      setEditingItem(null);
      setShowForm(false);
      setFileUpload(null);
      form.reset();
      fetchGearItems();
    } catch (error) {
      console.error("Error saving gear item:", error);
      toast({
        title: "Error",
        description: "Failed to save gear item",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle delete
  const handleDelete = async () => {
    if (!deleteItemId) return;
    
    try {
      await deleteDoc(doc(db, "gear", deleteItemId));
      
      toast({
        title: "Success",
        description: "Gear item deleted successfully",
      });
      
      fetchGearItems();
    } catch (error) {
      console.error("Error deleting gear item:", error);
      toast({
        title: "Error",
        description: "Failed to delete gear item",
        variant: "destructive",
      });
    } finally {
      setDeleteItemId(null);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Gelica, serif' }}>
              Inventory Management
            </h3>
            <p className="text-gray-600 mt-1" style={{ fontFamily: 'Figtree, sans-serif' }}>
              Manage your baby gear inventory items
            </p>
          </div>
          <Button 
            onClick={() => {
              setEditingItem(null);
              setShowForm(true);
            }}
            className="bg-accent hover:bg-accent/90 text-white py-2 px-4 rounded-full transition-colors flex items-center"
          >
            <Plus size={16} className="mr-1" /> Add New Item
          </Button>
        </div>
      </div>
      
      {/* Add/Edit Gear Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6" style={{ fontFamily: 'Gelica, serif' }}>
            {editingItem ? "Edit Gear Item" : "Add New Gear Item"}
          </h3>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="ItemType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Type</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="w-full p-3 rounded-lg border border-gray-300 focus:border-accent focus:ring-1 focus:ring-accent outline-none" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="DayCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily Cost</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="w-full p-3 rounded-lg border border-gray-300 focus:border-accent focus:ring-1 focus:ring-accent outline-none" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="WeekCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weekly Cost</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="w-full p-3 rounded-lg border border-gray-300 focus:border-accent focus:ring-1 focus:ring-accent outline-none" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="AdditionalDeets"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Details</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={3} 
                        className="w-full p-3 rounded-lg border border-gray-300 focus:border-accent focus:ring-1 focus:ring-accent outline-none" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="mb-6">
                <label className="block mb-2 font-medium">Item Image</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                />
                {editingItem?.ImageUrl && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Current image:</p>
                    <img 
                      src={editingItem.ImageUrl} 
                      alt={editingItem.ItemType} 
                      className="h-20 w-20 object-cover mt-1 rounded"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex space-x-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-accent hover:bg-accent/90 text-white py-2 px-6 rounded-full transition-colors"
                >
                  {isSubmitting ? "Saving..." : "Save Item"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-primary py-2 px-6 rounded-full transition-colors"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
      
      {/* Gear Items Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: 'Gelica, serif' }}>
          Current Inventory
        </h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Cost</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weekly Cost</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center">Loading...</td>
              </tr>
            ) : gearItems.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center">No gear items found</td>
              </tr>
            ) : (
              gearItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{item.ItemType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.DayCost}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.WeekCost}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-800 mr-3"
                      onClick={() => {
                        setEditingItem(item);
                        setShowForm(true);
                      }}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-red-600 hover:text-red-800"
                      onClick={() => setDeleteItemId(item.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteItemId} onOpenChange={() => setDeleteItemId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this gear item. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GearManagement;
