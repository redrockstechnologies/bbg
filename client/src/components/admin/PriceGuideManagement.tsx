
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
import { Trash2, Upload, Download, FileText, Plus } from "lucide-react";
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
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
      
      // Hide form and reset
      setShowForm(false);
      
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
      setShowDeleteDialog(false);
      
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
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl">Manage Price Guide</h3>
        <Button 
          onClick={() => {
            setShowForm(true);
          }}
          className="bg-accent hover:bg-accent/90 text-white py-2 px-4 rounded-full transition-colors flex items-center"
        >
          <Plus size={16} className="mr-1" /> 
          {priceGuide ? "Update Guide" : "Add Price Guide"}
        </Button>
      </div>
      
      {/* Current Price Guide Display */}
      {priceGuide && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h4 className="font-medium mb-4 flex items-center">
            <FileText className="mr-2 text-accent" size={20} />
            Current Price Guide
          </h4>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>Title:</strong> {priceGuide.title}</p>
                <p><strong>Subtitle:</strong> {priceGuide.subtitle}</p>
              </div>
              <div>
                <p><strong>File:</strong> {priceGuide.fileName}</p>
                <p><strong>Size:</strong> {formatFileSize(priceGuide.fileSize)}</p>
                <p><strong>Uploaded:</strong> {new Date(priceGuide.uploadedAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex gap-3 pt-3 border-t border-gray-200">
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
                variant="outline"
                size="sm"
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2"
              >
                <Upload size={16} />
                Update
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                className="flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h4 className="text-xl mb-6">{priceGuide ? "Update Price Guide" : "Add New Price Guide"}</h4>
          
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
                      <Input
                        {...field}
                        placeholder="e.g., Download our comprehensive pricing information"
                        className="w-full p-3 rounded-lg border border-gray-300 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
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
                  <Input
                    id="pdf-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
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
              
              <div className="flex space-x-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-accent hover:bg-accent/90 text-white py-2 px-6 rounded-full transition-colors flex items-center gap-2"
                >
                  <Upload size={16} />
                  {isSubmitting ? "Saving..." : priceGuide ? "Update Price Guide" : "Create Price Guide"}
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

      {/* No Price Guide State */}
      {!priceGuide && !showForm && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FileText className="mx-auto mb-4 text-gray-400" size={48} />
          <h4 className="text-lg font-medium mb-2">No Price Guide</h4>
          <p className="text-gray-600 mb-4">Create a price guide to share pricing information with customers.</p>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-accent hover:bg-accent/90 text-white py-2 px-6 rounded-full transition-colors flex items-center mx-auto"
          >
            <Plus size={16} className="mr-2" />
            Create Price Guide
          </Button>
        </div>
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the price guide. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PriceGuideManagement;
