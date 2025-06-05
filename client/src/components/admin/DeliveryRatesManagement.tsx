
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

// Schema for delivery rates
const deliveryRateSchema = z.object({
  category: z.string().min(1, "Category is required"),
  location: z.string().min(1, "Location is required"),
  rate: z.string().min(1, "Rate is required"),
});

type DeliveryRateFormValues = z.infer<typeof deliveryRateSchema>;

type DeliveryRate = {
  id: number;
  category: string;
  location: string;
  rate: string;
};

const DeliveryRatesManagement = () => {
  const [deliveryRates, setDeliveryRates] = useState<DeliveryRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRate, setEditingRate] = useState<DeliveryRate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteRateId, setDeleteRateId] = useState<number | null>(null);
  
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
  
  // Fetch delivery rates from API
  const fetchDeliveryRates = async () => {
    try {
      const response = await fetch("/api/delivery-rates");
      if (response.ok) {
        const data = await response.json();
        setDeliveryRates(data);
      }
    } catch (error) {
      console.error("Error fetching delivery rates:", error);
      toast({
        title: "Error",
        description: "Failed to load delivery rates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle form submission (add/edit)
  const onSubmit = async (data: DeliveryRateFormValues) => {
    setIsSubmitting(true);
    
    try {
      if (editingRate) {
        // Update existing rate
        const response = await fetch(`/api/delivery-rates/${editingRate.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        
        if (response.ok) {
          toast({
            title: "Success",
            description: "Delivery rate updated successfully",
          });
        }
      } else {
        // Add new rate
        const response = await fetch("/api/delivery-rates", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        
        if (response.ok) {
          toast({
            title: "Success",
            description: "Delivery rate added successfully",
          });
        }
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
      const response = await fetch(`/api/delivery-rates/${deleteRateId}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Delivery rate deleted successfully",
        });
        
        fetchDeliveryRates();
      }
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
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Gelica, serif' }}>
              Delivery Rates Management
            </h3>
            <p className="text-gray-600 mt-1" style={{ fontFamily: 'Figtree, sans-serif' }}>
              Manage delivery rates for different locations and categories
            </p>
          </div>
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
      </div>
      
      {/* Add/Edit Rate Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6" style={{ fontFamily: 'Gelica, serif' }}>
            {editingRate ? "Edit Delivery Rate" : "Add New Delivery Rate"}
          </h3>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Delivery">Delivery</SelectItem>
                        <SelectItem value="Collection">Collection</SelectItem>
                        <SelectItem value="Airport Transfer">Airport Transfer</SelectItem>
                        <SelectItem value="After Hours">After Hours</SelectItem>
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
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="e.g. Ballito, Umhlanga, King Shaka Airport"
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
                        placeholder="e.g. R50, R100, Free"
                        className="w-full p-3 rounded-lg border border-gray-300 focus:border-accent focus:ring-1 focus:ring-accent outline-none" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex space-x-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-accent hover:bg-accent/90 text-white py-2 px-6 rounded-full transition-colors"
                >
                  {isSubmitting ? "Saving..." : "Save Rate"}
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
      
      {/* Delivery Rates Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: 'Gelica, serif' }}>
          Current Delivery Rates
        </h4>
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
                    <td className="px-6 py-4 whitespace-nowrap">{rate.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{rate.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{rate.rate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        variant="ghost"
                        className="text-blue-600 hover:text-blue-800 mr-3"
                        onClick={() => {
                          setEditingRate(rate);
                          setShowForm(true);
                        }}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => setDeleteRateId(rate.id)}
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
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteRateId} onOpenChange={() => setDeleteRateId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this delivery rate. This action cannot be undone.
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

export default DeliveryRatesManagement;
