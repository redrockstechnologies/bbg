
import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import BabyEssentialCard from "./BabyEssentialCard";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export type DeliveryOption = {
  name: string;
  price: number;
};

export type BabyEssentialItem = {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  status: boolean;
  imageUrl: string;
  deliveryOptions: DeliveryOption[];
};

const BabyEssentialsGrid = () => {
  const [essentialItems, setEssentialItems] = useState<BabyEssentialItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<BabyEssentialItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEssentialItems = async () => {
      try {
        const essentialsRef = collection(db, "babyEssentials");
        const q = query(essentialsRef, where("status", "==", true));
        const snapshot = await getDocs(q);
        const fetchedItems: BabyEssentialItem[] = [];

        snapshot.forEach((doc) => {
          fetchedItems.push({
            id: doc.id,
            ...doc.data() as Omit<BabyEssentialItem, 'id'>
          });
        });

        setEssentialItems(fetchedItems);
        setFilteredItems(fetchedItems);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching baby essential items:", error);
        setLoading(false);
      }
    };

    fetchEssentialItems();
  }, []);

  // Filter items based on search query
  useEffect(() => {
    const filtered = essentialItems.filter((item) => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredItems(filtered);
  }, [searchQuery, essentialItems]);

  return (
    <div>
      <div className="mb-8">
        <Input
          id="essentials-search"
          type="text"
          placeholder="Search for baby essentials..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Skeleton loading state
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="gear-card bg-card rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 flex flex-col items-center">
                <Skeleton className="w-40 h-40 rounded-full mb-4" />
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-16 w-full mb-4" />
                <Skeleton className="h-10 w-full rounded-full" />
              </div>
            </div>
          ))
        ) : (
          filteredItems.map((item) => (
            <BabyEssentialCard key={item.id} item={item} />
          ))
        )}
      </div>
    </div>
  );
};

export default BabyEssentialsGrid;
