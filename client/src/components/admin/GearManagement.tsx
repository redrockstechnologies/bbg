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
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
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
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle style={{ fontFamily: 'Gelica, serif' }}>Inventory Management</CardTitle>
              <CardDescription style={{ fontFamily: 'Figtree, sans-serif' }}>
                Add, edit, and manage your baby gear inventory
              </CardDescription>
            </div>
            <Button onClick={() => setShowForm(!showForm)} className="bg-accent hover:bg-accent/90 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add New Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showForm && (
            <form onSubmit={editingItem ? handleUpdate : handleSubmit} className="space-y-4 bg-gray-50 p-6 rounded-lg">
              <h4 className="text-lg font-medium" style={{ fontFamily: 'Gelica, serif' }}>
                {editingItem ? "Edit" : "Add New"} Gear Item
              </h4>

              <div className="mb-4">
                <Label htmlFor="itemType" className="block text-sm font-medium text-gray-700">
                  Item Type
                </Label>
                <Input
                  type="text"
                  id="itemType"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="mb-4">
                <Label htmlFor="dayCost" className="block text-sm font-medium text-gray-700">
                  Daily Cost
                </Label>
                <Input
                  type="number"
                  id="dayCost"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="mb-4">
                <Label htmlFor="weekCost" className="block text-sm font-medium text-gray-700">
                  Weekly Cost
                </Label>
                <Input
                  type="number"
                  id="weekCost"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="mb-4">
                <Label htmlFor="additionalDeets" className="block text-sm font-medium text-gray-700">
                  Additional Details
                </Label>
                <Textarea
                  id="additionalDeets"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="bg-accent hover:bg-accent/90 text-white">
                  {editingItem ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {gearItems.map((item) => (
              <div key={item.id} className="p-4 border rounded-lg flex justify-between items-center">
                <div>
                  <h4 className="font-medium" style={{ fontFamily: 'Figtree, sans-serif' }}>
                    {item.itemType}
                  </h4>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Figtree, sans-serif' }}>
                    Day: {item.dayCost} | Week: {item.weekCost}
                  </p>
                  {item.additionalDeets && (
                    <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'Figtree, sans-serif' }}>
                      {item.additionalDeets}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GearManagement;