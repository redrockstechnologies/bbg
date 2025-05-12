import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import GearCard from "./GearCard";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export type GearItem = {
  id: string;
  ItemType: string;
  DayCost: string;
  WeekCost: string;
  AdditionalDeets?: string;
  ImageUrl?: string;
};

const GearGrid = () => {
  const [gearItems, setGearItems] = useState<GearItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<GearItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
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
        setFilteredItems(fetchedItems);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching gear items:", error);
        setLoading(false);
      }
    };
    
    fetchGearItems();
  }, []);
  
  // If no gear items are available, use these defaults
  useEffect(() => {
    if (!loading && gearItems.length === 0) {
      const defaultItems: GearItem[] = [
        {
          id: "1",
          ItemType: "Baby Cot",
          DayCost: "R120",
          WeekCost: "R600",
          AdditionalDeets: "Comfortable, sturdy cot with mattress and fitted sheet included. Perfect for babies up to 2 years.",
          ImageUrl: "https://images.unsplash.com/photo-1618314085635-340e9b8a6daf?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80"
        },
        {
          id: "2",
          ItemType: "Stroller",
          DayCost: "R150",
          WeekCost: "R750",
          AdditionalDeets: "Lightweight, easy-fold stroller with sun canopy. Suitable for babies 6 months and older.",
          ImageUrl: "https://images.unsplash.com/photo-1591349884490-a6e09f2f4e1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80"
        },
        {
          id: "3",
          ItemType: "High Chair",
          DayCost: "R100",
          WeekCost: "R500",
          AdditionalDeets: "Easy-clean high chair with adjustable height and removable tray. Suitable for babies who can sit unassisted.",
          ImageUrl: "https://pixabay.com/get/g31ccf60c89bd83a410930828c2fe9bdc945c8529b6366a239b381eeb2fe20d1208db7e8a2e6eafade15e7d5cb6b789bc1db39c5fb247e869365c41fb4cf09fa1_1280.jpg"
        },
        {
          id: "4",
          ItemType: "Car Seat",
          DayCost: "R140",
          WeekCost: "R700",
          AdditionalDeets: "Safety-certified car seat with 5-point harness. Available in infant, toddler, and booster sizes.",
          ImageUrl: "https://pixabay.com/get/g91018f9359696d6f73ccf601021521c405fe562069cac3c1d31a3b12f30c6072c7d1b0e440e50914aa4f1e6d15c877f4_1280.jpg"
        },
        {
          id: "5",
          ItemType: "Baby Bath",
          DayCost: "R80",
          WeekCost: "R400",
          AdditionalDeets: "Safe, ergonomic baby bath with non-slip surface. Perfect for babies from newborn to 12 months.",
          ImageUrl: "https://pixabay.com/get/g9fb5bc175ffb95c36fe529ff3659353b23fc3fab8d6c5861e1fc2fd01b3bd019da35e820ce27bc8ad182b994e782810c19a11f82334d2a9f8791eede9797be7f_1280.jpg"
        },
        {
          id: "6",
          ItemType: "Play Mat",
          DayCost: "R90",
          WeekCost: "R450",
          AdditionalDeets: "Colorful activity gym with hanging toys and music. Machine-washable mat for hygiene.",
          ImageUrl: "https://images.unsplash.com/photo-1583695477989-e35857eb9263?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80"
        }
      ];
      
      setGearItems(defaultItems);
      setFilteredItems(defaultItems);
    }
  }, [loading, gearItems]);
  
  // Filter items based on search query
  useEffect(() => {
    const filtered = gearItems.filter((item) => 
      item.ItemType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.AdditionalDeets && item.AdditionalDeets.toLowerCase().includes(searchQuery.toLowerCase()))
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
