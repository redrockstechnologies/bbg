
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Upload, Download, FileText } from "lucide-react";

const priceGuideSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
});

type PriceGuideFormValues = z.infer<typeof priceGuideSchema>;

type PriceGuide = {
  title: string;
  subtitle: string;
  fileName: string;
  uploadedAt: string;
  fileSize: number;
  exists: boolean;
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
  
  // Fetch price guide from backend
  const fetchPriceGuide = async () => {
    try {
      const response = await fetch('/api/price-guide');
      if (response.ok) {
        const data = await response.json();
        if (data.exists) {
          setPriceGuide(data);
        } else {
          setPriceGuide(null);
        }
      }
    } catch (error) {
      console.error("Error fetching price guide:", error);
      toast({
        title: "Error",
        description: "Failed to fetch price guide",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF file",
          variant: "destructive",
        });
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB
        toast({
          title: "File too large",
          description: "File size must be less than 10MB",
          variant: "destructive",
        });
        return;
      }
      
      setFileUpload(file);
    }
  };
  
  // Submit form
  const onSubmit = async (data: PriceGuideFormValues) => {
    if (!fileUpload && !priceGuide) {
      toast({
        title: "PDF Required",
        description: "Please select a PDF file to upload",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('subtitle', data.subtitle);
      
      if (fileUpload) {
        formData.append('pdf', fileUpload);
      }
      
      const response = await fetch('/api/price-guide', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save price guide');
      }
      
      const result = await response.json();
      
      // Update local state
      setPriceGuide({
        ...result.metadata,
        exists: true,
      });
      
      // Reset file input
      setFileUpload(null);
      const fileInput = document.getElementById('pdf-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      toast({
        title: "Success",
        description: priceGuide ? "Price guide updated successfully" : "Price guide created successfully",
      });
      
    } catch (error) {
      console.error("Error saving price guide:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save price guide",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Delete price guide
  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const response = await fetch('/api/price-guide', {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete price guide');
      }
      
      setPriceGuide(null);
      form.reset();
      
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
  
  // Download PDF
  const handleDownload = () => {
    window.open('/api/price-guide/download', '_blank');
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Price Guide Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Guide Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Current Price Guide Display */}
        {priceGuide && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Current Price Guide</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Title:</strong> {priceGuide.title}</p>
              <p><strong>Subtitle:</strong> {priceGuide.subtitle}</p>
              <p><strong>File:</strong> {priceGuide.fileName}</p>
              <p><strong>Size:</strong> {formatFileSize(priceGuide.fileSize)}</p>
              <p><strong>Uploaded:</strong> {new Date(priceGuide.uploadedAt).toLocaleDateString()}</p>
              <div className="flex gap-2 mt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="flex items-center gap-2"
                >
                  <Download size={16} />
                  Download
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Form */}
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
                      placeholder="e.g., Price Guide"
                      className="w-full"
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
                    <Input
                      {...field}
                      placeholder="e.g., Download our comprehensive pricing information"
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* File Upload */}
            <div className="space-y-2">
              <label htmlFor="pdf-upload" className="block text-sm font-medium">
                PDF File {!priceGuide && <span className="text-red-500">*</span>}
              </label>
              <div className="flex items-center gap-4">
                <input
                  id="pdf-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary/90"
                />
                {fileUpload && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <FileText size={16} />
                    {fileUpload.name}
                  </div>
                )}
              </div>
              {!priceGuide && (
                <p className="text-xs text-gray-500">Maximum file size: 10MB</p>
              )}
            </div>
            
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center gap-2"
            >
              <Upload size={16} />
              {isSubmitting ? "Saving..." : priceGuide ? "Update Price Guide" : "Create Price Guide"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PriceGuideManagement;
