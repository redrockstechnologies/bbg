
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Schema for delivery rates
const deliveryRateSchema = z.object({
  category: z.string().min(1, "Category is required"),
  location: z.string().min(1, "Location is required"),
  rate: z.string().min(1, "Rate is required"),
});

type DeliveryRateFormValues = z.infer<typeof deliveryRateSchema>;

type DeliveryRate = DeliveryRateFormValues & {
  id: string;
};

const DeliveryRatesManagement = () => {
  const [deliveryRates, setDeliveryRates] = useState<DeliveryRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRate, setEditingRate] = useState<DeliveryRate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteRateId, setDeleteRateId] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  // Form setup
  const form = useForm<DeliveryRateFormValues>({
    resolver: zodResolver(deliveryRateSchema),
    defaultValues: {
      category: "",
      location: "",
      rate: "",
    },
  });
  
  // Fetch delivery rates on mount
  useEffect(() => {
    fetchDeliveryRates();
  }, []);
  
  // Reset form when editing rate changes
  useEffect(() => {
    if (editingRate) {
      form.reset({
        category: editingRate.category,
        location: editingRate.location,
        rate: editingRate.rate,
      });
    } else {
      form.reset({
        category: "",
        location: "",
        rate: "",
      });
    }
  }, [editingRate, form]);
  
  // Fetch delivery rates from Firestore
  const fetchDeliveryRates = async () => {
    try {
      const ratesRef = collection(db, "deliveryRates");
      const snapshot = await getDocs(ratesRef);
      const fetchedRates: DeliveryRate[] = [];
      
      snapshot.forEach((doc) => {
        fetchedRates.push({
          id: doc.id,
          ...doc.data()
        } as DeliveryRate);
      });
      
      setDeliveryRates(fetchedRates);
    } catch (error) {
      console.error("Error fetching delivery rates:", error);
      toast({
        title: "Error",
        description: "Failed to fetch delivery rates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle form submission
  const onSubmit = async (data: DeliveryRateFormValues) => {
    setIsSubmitting(true);
    
    try {
      if (editingRate) {
        // Update existing rate
        await updateDoc(doc(db, "deliveryRates", editingRate.id), data);
        
        toast({
          title: "Success",
          description: "Delivery rate updated successfully",
        });
      } else {
        // Add new rate
        await addDoc(collection(db, "deliveryRates"), data);
        
        toast({
          title: "Success",
          description: "Delivery rate added successfully",
        });
      }
      
      // Reset and refresh
      setEditingRate(null);
      setShowForm(false);
      form.reset();
      fetchDeliveryRates();
    } catch (error) {
      console.error("Error saving delivery rate:", error);
      toast({
        title: "Error",
        description: "Failed to save delivery rate",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle delete
  const handleDelete = async () => {
    if (!deleteRateId) return;
    
    try {
      await deleteDoc(doc(db, "deliveryRates", deleteRateId));
      
      toast({
        title: "Success",
        description: "Delivery rate deleted successfully",
      });
      
      fetchDeliveryRates();
    } catch (error) {
      console.error("Error deleting delivery rate:", error);
      toast({
        title: "Error",
        description: "Failed to delete delivery rate",
        variant: "destructive",
      });
    } finally {
      setDeleteRateId(null);
    }
  };
  
  const categories = [
    "Only Delivery",
    "Only Pickup", 
    "Delivery & Pickup",
    "Delivery & Pickup Hours"
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl">Manage Delivery Rates</h3>
        <Button 
          onClick={() => {
            setEditingRate(null);
            setShowForm(true);
          }}
          className="bg-accent hover:bg-accent/90 text-white py-2 px-4 rounded-full transition-colors flex items-center"
        >
          <Plus size={16} className="mr-1" /> Add New Rate
        </Button>
      </div>
      
      {/* Add/Edit Rate Form */}
      {showForm && (
        <div className="bg-white rounded-lg p-6 mb-8 border border-gray-200">
          <h3 className="text-xl mb-6">{editingRate ? "Edit Delivery Rate" : "Add New Delivery Rate"}</h3>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location/Description</FormLabel>
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
                name="rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rate</FormLabel>
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
              
              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-accent hover:bg-accent/90 text-white py-2 px-6 rounded-full transition-colors"
                >
                  {isSubmitting ? "Saving..." : (editingRate ? "Update Rate" : "Add Rate")}
                </Button>
                <Button 
                  type="button"
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
      
      {/* Delivery Rates Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center">Loading...</td>
              </tr>
            ) : deliveryRates.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center">No delivery rates found</td>
              </tr>
            ) : (
              deliveryRates.map((rate) => (
                <tr key={rate.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{rate.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{rate.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{rate.rate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => {
                          setEditingRate(rate);
                          setShowForm(true);
                        }}
                        variant="outline"
                        size="sm"
                        className="flex items-center"
                      >
                        <Edit size={14} className="mr-1" /> Edit
                      </Button>
                      <Button
                        onClick={() => setDeleteRateId(rate.id)}
                        variant="outline"
                        size="sm"
                        className="flex items-center text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={14} className="mr-1" /> Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteRateId} onOpenChange={() => setDeleteRateId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the delivery rate.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeliveryRatesManagement;
