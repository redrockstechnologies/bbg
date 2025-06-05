import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Trash2 } from "lucide-react";

interface PriceGuide {
  id?: number;
  title: string;
  subtitle: string;
  fileUrl: string;
  fileName: string;
}

const PriceGuideManagement = () => {
  const [priceGuide, setPriceGuide] = useState<PriceGuide>({
    title: "",
    subtitle: "",
    fileUrl: "",
    fileName: ""
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPriceGuide();
  }, []);

  const fetchPriceGuide = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/price-guide");
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setPriceGuide(data);
        }
      }
    } catch (error) {
      console.error("Error fetching price guide:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf" || file.type.startsWith("image/")) {
        setSelectedFile(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF or image file",
          variant: "destructive"
        });
      }
    }
  };

  const handleSave = async () => {
    if (!priceGuide.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a title",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      // For now, just save the text content without file upload
      const priceGuideData = {
        title: priceGuide.title,
        subtitle: priceGuide.subtitle,
        fileUrl: priceGuide.fileUrl || "",
        fileName: selectedFile?.name || priceGuide.fileName || ""
      };

      const response = await fetch("/api/price-guide", {
        method: priceGuide.id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(priceGuideData)
      });

      if (response.ok) {
        const savedGuide = await response.json();
        setPriceGuide(savedGuide);
        setSelectedFile(null);
        toast({
          title: "Success",
          description: "Price guide saved successfully"
        });
      } else {
        throw new Error("Failed to save price guide");
      }
    } catch (error) {
      console.error("Error saving price guide:", error);
      toast({
        title: "Error",
        description: "Failed to save price guide",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPriceGuide(prev => ({
      ...prev,
      fileUrl: "",
      fileName: ""
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Price Guide Management</h2>
        <p className="text-gray-600">Manage your downloadable price guide</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Price Guide Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={priceGuide.title}
              onChange={(e) => setPriceGuide(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter price guide title"
              className="w-full p-3 rounded-lg border border-gray-300 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Textarea
              id="subtitle"
              value={priceGuide.subtitle}
              onChange={(e) => setPriceGuide(prev => ({ ...prev, subtitle: e.target.value }))}
              placeholder="Enter price guide subtitle/description"
              rows={3}
              className="w-full p-3 rounded-lg border border-gray-300 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
            />
          </div>

          <div className="space-y-4">
            <Label>Price Guide File</Label>

            {/* Current file display */}
            {priceGuide.fileName && !selectedFile && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-sm font-medium">{priceGuide.fileName}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveFile}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Selected file display */}
            {selectedFile && (
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-sm font-medium text-blue-700">{selectedFile.name}</span>
                  <span className="text-xs text-blue-500 ml-2">(New)</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* File upload */}
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF or image files only</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,image/*"
                  onChange={handleFileSelect}
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-accent hover:bg-accent/90 text-white py-2 px-6 rounded-lg transition-colors"
            >
              {isSaving ? "Saving..." : "Save Price Guide"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PriceGuideManagement;