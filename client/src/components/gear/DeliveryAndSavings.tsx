
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface Modification {
  name: string;
  value: string;
}

interface TermsCondition {
  title: string;
  body: string;
}

interface Additional {
  id: string;
  name: string;
  type: 'Fee' | 'Saving' | 'Promotion';
  public: boolean;
  modifications: Record<string, Modification>;
  tcs: Record<string, TermsCondition>;
}

const DeliveryAndSavings = () => {
  const [additionals, setAdditionals] = useState<Additional[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdditionals();
  }, []);

  const fetchAdditionals = async () => {
    try {
      const q = query(
        collection(db, 'additionals'),
        where('public', '==', true)
      );
      const querySnapshot = await getDocs(q);
      
      const additionalsData: Additional[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        additionalsData.push({
          id: doc.id,
          name: data.name,
          type: data.type,
          public: data.public,
          modifications: data.modifications || {},
          tcs: data.tcs || {},
        });
      });
      
      // Sort by type order: Fee, Saving, Promotion
      const typeOrder = { 'Fee': 1, 'Saving': 2, 'Promotion': 3 };
      additionalsData.sort((a, b) => typeOrder[a.type] - typeOrder[b.type]);
      
      setAdditionals(additionalsData);
    } catch (error) {
      console.error('Error fetching additionals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getColorByType = (type: string) => {
    switch (type) {
      case 'Fee':
        return 'bg-primary/10 border-primary'; // Primary color
      case 'Saving':
        return 'bg-accent/10 border-accent'; // Accent color
      case 'Promotion':
        return 'bg-card border-card'; // Card color
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading delivery options and savings...</div>;
  }

  if (additionals.length === 0) {
    return null;
  }

  return (
    <section className="mb-16 mt-20">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl mb-3 font-medium">Delivery & Savings</h2>
        <div className="w-24 h-1 bg-accent mx-auto mb-6"></div>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {additionals.map((additional) => (
          <div
            key={additional.id}
            className={`rounded-lg shadow-lg overflow-hidden transition-all duration-300 border-2 ${getColorByType(additional.type)}`}
          >
            <div className="p-6">
              <h3 className="text-xl mb-4 font-medium text-center">{additional.name}</h3>
              
              {/* Modifications */}
              {Object.keys(additional.modifications).length > 0 && (
                <div className="space-y-2 mb-4">
                  {Object.values(additional.modifications).map((mod, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{mod.name}:</span>
                      <span className="text-sm">R{mod.value}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Terms & Conditions */}
              {Object.keys(additional.tcs).length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-sm mb-2">Terms & Conditions:</h4>
                  <div className="space-y-2">
                    {Object.values(additional.tcs).map((tc, index) => (
                      <div key={index} className="text-xs">
                        <p className="font-medium">{tc.title}</p>
                        <p className="text-gray-600">{tc.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DeliveryAndSavings;
