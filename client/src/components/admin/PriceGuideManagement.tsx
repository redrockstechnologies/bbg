
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
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
import { Download, Upload } from "lucide-react";

// Schema for price guide
const priceGuideSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
});

type PriceGuideFormValues = z.infer<typeof priceGuideSchema>;

type PriceGuide = PriceGuideFormValues & {
  id: number;
  fileUrl?: string;
  fileName?: string;
};

const PriceGuideManagement = () => {
  const [priceGuide, setPriceGuide] = useState<PriceGuide | null>(null);
  const [loading, setLoading] = useState(true);
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  
  // Form setup
  const form = useForm<PriceGuideFormValues>({
    resolver: zodResolver(priceGuideSchema),
    defaultValues: {
      title: "",
      subtitle: "",
    },
  });
  
  // Fetch price guide on mount
  useEffect(() => {
    fetchPriceGuide();
  }, []);
  
  // Reset form when price guide changes
  useEffect(() => {
    if (priceGuide) {
      form.reset({
        title: priceGuide.title,
        subtitle: priceGuide.subtitle,
      });
    }
  }, [priceGuide, form]);
  
  // Fetch price guide from API
  const fetchPriceGuide = async () => {
    try {
      const response = await fetch("/api/price-guide");
      if (response.ok) {
        const data = await response.json();
        setPriceGuide(data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching price guide:", error);
      toast({
        title: "Error",
        description: "Failed to load price guide",
        variant: "destructive",
      });
      setLoading(false);
    }
  };
  
  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
        setFileUpload(file);
      } else {
        toast({
          title: "Invalid File",
          description: "Please select a PDF file",
          variant: "destructive",
        });
      }
    }
  };
  
  // Handle form submission
  const onSubmit = async (data: PriceGuideFormValues) => {
    setIsSubmitting(true);
    
    try {
      let fileUrl = priceGuide?.fileUrl || "";
      let fileName = priceGuide?.fileName || "";
      
      // Upload PDF if selected
      if (fileUpload) {
        const storageRef = ref(storage, `price-guides/${Date.now()}_${fileUpload.name}`);
        const uploadResult = await uploadBytes(storageRef, fileUpload);
        fileUrl = await getDownloadURL(uploadResult.ref);
        fileName = fileUpload.name;
      }
      
      const method = priceGuide ? "PUT" : "POST";
      const response = await fetch("/api/price-guide", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          fileUrl,
          fileName,
        }),
      });
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Price guide updated successfully",
        });
        
        setFileUpload(null);
        fetchPriceGuide();
      } else {
        throw new Error("Failed to save price guide");
      }
    } catch (error) {
      console.error("Error saving price guide:", error);
      toast({
        title: "Error",
        description: "Failed to save price guide",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = () => {
    if (priceGuide?.fileUrl) {
      window.open(priceGuide.fileUrl, '_blank');
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl">Manage Price Guide</h3>
        {priceGuide?.fileUrl && (
          <Button 
            onClick={handleDownload}
            className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-full transition-colors flex items-center"
          >
            <Download size={16} className="mr-1" /> Download Current
          </Button>
        )}
      </div>
      
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
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
                name="subtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtitle</FormLabel>
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
                <label className="block mb-2 font-medium">Price Guide PDF</label>
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                />
                {priceGuide?.fileName && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Current file: {priceGuide.fileName}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-accent hover:bg-accent/90 text-white py-2 px-6 rounded-full transition-colors flex items-center"
                >
                  {isSubmitting ? "Saving..." : (
                    <>
                      <Upload size={16} className="mr-1" />
                      Save Price Guide
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};

export default PriceGuideManagement;
