
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface DeliveryRate {
  id: string;
  category: string;
  location: string;
  rate: string;
}

const DeliveryRates = () => {
  const [rates, setRates] = useState<DeliveryRate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeliveryRates();
  }, []);

  const fetchDeliveryRates = async () => {
    try {
      const ratesRef = collection(db, "deliveryRates");
      const snapshot = await getDocs(ratesRef);
      const fetchedRates: DeliveryRate[] = [];
      
      snapshot.forEach((doc) => {
        fetchedRates.push({
          id: doc.id,
          ...doc.data()
        } as DeliveryRate);
      });
      
      if (fetchedRates.length === 0) {
        // Set default rates if none exist
        const defaultRates = [
          { category: "Only Delivery", location: "In Ballito", rate: "R90" },
          { category: "Only Delivery", location: "Outside Ballito", rate: "R150" },
          { category: "Only Delivery", location: "Airport", rate: "R120" },
          { category: "Only Pickup", location: "In Ballito", rate: "R90" },
          { category: "Only Pickup", location: "Outside Ballito", rate: "R150" },
          { category: "Only Pickup", location: "Airport", rate: "R120" },
          { category: "Delivery & Pickup", location: "In Ballito", rate: "R150" },
          { category: "Delivery & Pickup", location: "Outside Ballito", rate: "R250" },
          { category: "Delivery & Pickup", location: "Airport", rate: "R200" },
          { category: "Delivery & Pickup Hours", location: "Mon - Sat", rate: "10:00 - 16:00" },
          { category: "Delivery & Pickup Hours", location: "After Hours Fee", rate: "R25" },
          { category: "Delivery & Pickup Hours", location: "Sunday Fee", rate: "R50" }
        ];
        setRates(defaultRates as DeliveryRate[]);
      } else {
        setRates(fetchedRates);
      }
    } catch (error) {
      console.error("Error fetching delivery rates:", error);
    } finally {
      setLoading(false);
    }
  };

  const groupedRates = rates.reduce((acc, rate) => {
    if (!acc[rate.category]) {
      acc[rate.category] = [];
    }
    acc[rate.category].push(rate);
    return acc;
  }, {} as Record<string, DeliveryRate[]>);

  if (loading) {
    return <div className="text-center py-8">Loading delivery rates...</div>;
  }

  return (
    <section className="mb-16 mt-20">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl mb-3 font-medium">Delivery & Collection Rates</h2>
        <div className="w-24 h-1 bg-accent mx-auto mb-6"></div>
        <div className="max-w-4xl mx-auto space-y-4 text-lg">
          <p className="text-primary">
            <strong>Collection is free in Salt Rock, Ballito and must be arranged during your booking.</strong>
          </p>
          <p className="text-primary">
            <strong>Delivery is subject to availability & can be arranged prior to your arrival so that everything is waiting for you at your accommodation.</strong>
          </p>
          <p className="text-primary">
            <strong>Pickup means we will come to collect the items once your stay is over.</strong>
          </p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(groupedRates).map(([category, categoryRates]) => (
          <div key={category} className="bg-card rounded-lg shadow-lg overflow-hidden transition-all duration-300">
            <div className="p-6">
              <h3 className="text-xl mb-4 font-medium text-center">{category}</h3>
              <div className="space-y-3">
                {categoryRates.map((rate, index) => (
                  <div key={index} className="flex justify-between items-center gap-2">
                    <span className="text-lg font-medium">{rate.location}:</span>
                    <span className="text-lg font-bold text-primary">{rate.rate}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DeliveryRates;
