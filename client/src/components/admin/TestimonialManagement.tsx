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
import { Textarea } from "@/components/ui/textarea";
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

// Schema for testimonials
const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  rating: z.string().min(1, "Rating is required"),
  text: z.string().min(1, "Testimonial text is required"),
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

type Testimonial = {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
};

const TestimonialManagement = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTestimonialId, setDeleteTestimonialId] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  // Form setup
  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: "",
      location: "",
      rating: "5",
      text: "",
    },
  });
  
  // Fetch testimonials on mount
  useEffect(() => {
    fetchTestimonials();
  }, []);
  
  // Reset form when editing testimonial changes
  useEffect(() => {
    if (editingTestimonial) {
      form.reset({
        name: editingTestimonial.name,
        location: editingTestimonial.location,
        rating: editingTestimonial.rating.toString(),
        text: editingTestimonial.text,
      });
    } else {
      form.reset({
        name: "",
        location: "",
        rating: "5",
        text: "",
      });
    }
  }, [editingTestimonial, form]);
  
  // Fetch testimonials from Firestore
  const fetchTestimonials = async () => {
    try {
      const testimonialsRef = collection(db, "testimonials");
      const snapshot = await getDocs(testimonialsRef);
      const fetchedTestimonials: Testimonial[] = [];
      
      snapshot.forEach((doc) => {
        fetchedTestimonials.push({
          id: doc.id,
          ...doc.data() as Omit<Testimonial, 'id'>
        });
      });
      
      setTestimonials(fetchedTestimonials);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      toast({
        title: "Error",
        description: "Failed to load testimonials",
        variant: "destructive",
      });
      setLoading(false);
    }
  };
  
  // Handle form submission (add/edit)
  const onSubmit = async (data: TestimonialFormValues) => {
    setIsSubmitting(true);
    
    try {
      const testimonialData = {
        name: data.name,
        location: data.location,
        rating: parseInt(data.rating),
        text: data.text,
      };
      
      if (editingTestimonial) {
        // Update existing testimonial
        await updateDoc(doc(db, "testimonials", editingTestimonial.id), testimonialData);
        
        toast({
          title: "Success",
          description: "Testimonial updated successfully",
        });
      } else {
        // Add new testimonial
        await addDoc(collection(db, "testimonials"), testimonialData);
        
        toast({
          title: "Success",
          description: "Testimonial added successfully",
        });
      }
      
      // Reset and refresh
      setEditingTestimonial(null);
      setShowForm(false);
      form.reset();
      fetchTestimonials();
    } catch (error) {
      console.error("Error saving testimonial:", error);
      toast({
        title: "Error",
        description: "Failed to save testimonial",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle delete
  const handleDelete = async () => {
    if (!deleteTestimonialId) return;
    
    try {
      await deleteDoc(doc(db, "testimonials", deleteTestimonialId));
      
      toast({
        title: "Success",
        description: "Testimonial deleted successfully",
      });
      
      fetchTestimonials();
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      toast({
        title: "Error",
        description: "Failed to delete testimonial",
        variant: "destructive",
      });
    } finally {
      setDeleteTestimonialId(null);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl">Manage Testimonials</h3>
        <Button 
          onClick={() => {
            setEditingTestimonial(null);
            setShowForm(true);
          }}
          className="bg-accent hover:bg-accent/90 text-white py-2 px-4 rounded-full transition-colors flex items-center"
        >
          <Plus size={16} className="mr-1" /> Add New Testimonial
        </Button>
      </div>
      
      {/* Add/Edit Testimonial Form */}
      {showForm && (
        <div className="bg-white rounded-lg p-6 mb-8 border border-gray-200">
          <h3 className="text-xl mb-6">{editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}</h3>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="e.g. Sarah T."
                        className="w-full p-3 rounded-lg border border-gray-300 focus:border-accent focus:ring-1 focus:ring-accent outline-none" 
                      />
                    </FormControl>
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
                        placeholder="e.g. Johannesburg"
                        className="w-full p-3 rounded-lg border border-gray-300 focus:border-accent focus:ring-1 focus:ring-accent outline-none" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a rating" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1 Star</SelectItem>
                        <SelectItem value="2">2 Stars</SelectItem>
                        <SelectItem value="3">3 Stars</SelectItem>
                        <SelectItem value="4">4 Stars</SelectItem>
                        <SelectItem value="5">5 Stars</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Testimonial Text</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={4} 
                        placeholder="Enter the testimonial text here..."
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
                  {isSubmitting ? "Saving..." : "Save Testimonial"}
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
      
      {/* Testimonials Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center">Loading...</td>
              </tr>
            ) : testimonials.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center">No testimonials found</td>
              </tr>
            ) : (
              testimonials.map((testimonial) => (
                <tr key={testimonial.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{testimonial.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{testimonial.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{testimonial.rating}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-800 mr-3"
                      onClick={() => {
                        setEditingTestimonial(testimonial);
                        setShowForm(true);
                      }}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-red-600 hover:text-red-800"
                      onClick={() => setDeleteTestimonialId(testimonial.id)}
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
      <AlertDialog open={!!deleteTestimonialId} onOpenChange={() => setDeleteTestimonialId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this testimonial. This action cannot be undone.
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

export default TestimonialManagement;
