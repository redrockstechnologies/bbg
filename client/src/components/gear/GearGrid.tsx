import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import GearCard from "./GearCard";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export type GearItem = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  dailyPrice: number;
  weeklyPrice: number | null;
  isActive: boolean;
};

const GearGrid = () => {
  const [gearItems, setGearItems] = useState<GearItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<GearItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGearItems = async () => {
      try {
        const gearRef = collection(db, "public");
        const q = query(gearRef, where("isActive", "==", true));
        const snapshot = await getDocs(q);
        const fetchedItems: GearItem[] = [];

        snapshot.forEach((doc) => {
          fetchedItems.push({
            id: doc.id,
            ...doc.data() as Omit<GearItem, 'id'>
          });
        });

        setGearItems(fetchedItems);
        setFilteredItems(fetchedItems);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching gear items:", error);
        setLoading(false);
      }
    };

    fetchGearItems();
  }, []);

  // Filter items based on search query
  useEffect(() => {
    const filtered = gearItems.filter((item) => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredItems(filtered);
  }, [searchQuery, gearItems]);

  return (
    <div>
      <div className="mb-8">
        <Input
          id="gear-search"
          type="text"
          placeholder="Search for baby gear..."
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
            <GearCard key={item.id} item={item} />
          ))
        )}
      </div>
    </div>
  );
};

export default GearGrid;