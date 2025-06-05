
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
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
import { Download, Upload, Trash2 } from "lucide-react";

// Schema for price guide
const priceGuideSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
});

type PriceGuideFormValues = z.infer<typeof priceGuideSchema>;

type PriceGuide = PriceGuideFormValues & {
  fileUrl?: string;
  fileName?: string;
  uploadedAt?: string;
};

const PriceGuideManagement = () => {
  const [priceGuide, setPriceGuide] = useState<PriceGuide | null>(null);
  const [loading, setLoading] = useState(true);
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
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
  
  // Fetch price guide from Firebase Storage
  const fetchPriceGuide = async () => {
    try {
      // Try to get the metadata file from Firebase Storage
      const metadataRef = ref(storage, 'price-guide/metadata.json');
      const metadataUrl = await getDownloadURL(metadataRef);
      const response = await fetch(metadataUrl);
      
      if (response.ok) {
        const data = await response.json();
        setPriceGuide(data);
      }
    } catch (error) {
      console.log("No existing price guide found or error fetching:", error);
      // This is expected if no price guide exists yet
    } finally {
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
        // Delete old file if it exists
        if (priceGuide?.fileUrl) {
          try {
            const oldFileRef = ref(storage, `price-guide/${priceGuide.fileName}`);
            await deleteObject(oldFileRef);
          } catch (error) {
            console.log("Could not delete old file:", error);
          }
        }
        
        // Upload new file
        const timestamp = Date.now();
        const newFileName = `${timestamp}_${fileUpload.name}`;
        const storageRef = ref(storage, `price-guide/${newFileName}`);
        const uploadResult = await uploadBytes(storageRef, fileUpload);
        fileUrl = await getDownloadURL(uploadResult.ref);
        fileName = newFileName;
      }
      
      // Create metadata object
      const priceGuideData: PriceGuide = {
        title: data.title,
        subtitle: data.subtitle,
        fileUrl,
        fileName,
        uploadedAt: new Date().toISOString(),
      };
      
      // Save metadata to Firebase Storage
      const metadataBlob = new Blob([JSON.stringify(priceGuideData, null, 2)], {
        type: 'application/json'
      });
      const metadataRef = ref(storage, 'price-guide/metadata.json');
      await uploadBytes(metadataRef, metadataBlob);
      
      toast({
        title: "Success",
        description: "Price guide updated successfully",
      });
      
      setFileUpload(null);
      setPriceGuide(priceGuideData);
    } catch (error) {
      console.error("Error saving price guide:", error);
      toast({
        title: "Error",
        description: "Failed to save price guide. Please check your Firebase configuration.",
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

  const handleDelete = async () => {
    if (!priceGuide?.fileUrl) return;
    
    setIsDeleting(true);
    try {
      // Delete PDF file
      if (priceGuide.fileName) {
        const fileRef = ref(storage, `price-guide/${priceGuide.fileName}`);
        await deleteObject(fileRef);
      }
      
      // Delete metadata file
      const metadataRef = ref(storage, 'price-guide/metadata.json');
      await deleteObject(metadataRef);
      
      setPriceGuide(null);
      form.reset({
        title: "",
        subtitle: "",
      });
      
      toast({
        title: "Success",
        description: "Price guide deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting price guide:", error);
      toast({
        title: "Error",
        description: "Failed to delete price guide",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl">Manage Price Guide</h3>
        <div className="flex space-x-2">
          {priceGuide?.fileUrl && (
            <>
              <Button 
                onClick={handleDownload}
                className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-full transition-colors flex items-center"
              >
                <Download size={16} className="mr-1" /> Download Current
              </Button>
              <Button 
                onClick={handleDelete}
                disabled={isDeleting}
                variant="destructive"
                className="py-2 px-4 rounded-full transition-colors flex items-center"
              >
                <Trash2 size={16} className="mr-1" /> 
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </>
          )}
        </div>
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
                    <p className="text-xs text-gray-400">
                      Uploaded: {priceGuide.uploadedAt ? new Date(priceGuide.uploadedAt).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                )}
                {fileUpload && (
                  <div className="mt-2">
                    <p className="text-sm text-green-600">
                      New file selected: {fileUpload.name}
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
