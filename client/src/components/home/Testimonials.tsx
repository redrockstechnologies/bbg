import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";

type Testimonial = {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
};

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const testimonialsRef = collection(db, "testimonials");
        const snapshot = await getDocs(testimonialsRef);
        const fetchedTestimonials: Testimonial[] = [];
        
        snapshot.forEach((doc) => {
          fetchedTestimonials.push({
            id: doc.id,
            ...doc.data() as Omit<Testimonial, 'id'>
          });
        });
        
        setTestimonials(fetchedTestimonials);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        setLoading(false);
      }
    };
    
    fetchTestimonials();
  }, []);
  
  // If no testimonials are available, use these defaults
  useEffect(() => {
    if (!loading && testimonials.length === 0) {
      setTestimonials([
        {
          id: "1",
          name: "Sarah T.",
          location: "Johannesburg",
          text: "Absolute lifesaver! We traveled with our 8-month-old and didn't have to worry about packing any baby gear. Everything was spotless and high quality.",
          rating: 5
        },
        {
          id: "2",
          name: "Michael R.",
          location: "Cape Town",
          text: "The NappyNow service was incredible! We ran out of nappies at 9 PM and they had them delivered within the hour. Cannot recommend enough!",
          rating: 5
        },
        {
          id: "3",
          name: "Emma K.",
          location: "Durban",
          text: "We've used baby gear rental services before, but Ballito Baby Gear is on another level. The quality of the equipment and the service was impeccable.",
          rating: 5
        }
      ]);
    }
  }, [loading, testimonials]);
  
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };
  
  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };
  
  return (
    <section className="mb-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl mb-3">What Parents Say</h2>
        <div className="w-24 h-1 bg-accent mx-auto"></div>
      </div>
      
      <div className="relative">
        {/* Previous Button */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
          <button 
            onClick={handlePrev}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="text-primary" />
          </button>
        </div>
        
        {/* Testimonials Slider */}
        <div className="overflow-hidden mx-10">
          {loading ? (
            <div className="flex gap-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="min-w-full md:min-w-[33.33%] px-4">
                  <Skeleton className="h-48 w-full rounded-lg" />
                </div>
              ))}
            </div>
          ) : (
            <div 
              className="flex transition-transform duration-300"
              style={{ 
                transform: `translateX(-${currentIndex * 100}%)`,
                width: `${testimonials.length * 100}%`
              }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="testimonial-card min-w-full md:min-w-[33.33%] px-4">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center mb-4">
                      <div className="text-accent flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} fill="currentColor" />
                        ))}
                      </div>
                    </div>
                    <p className="mb-4 italic">"{testimonial.text}"</p>
                    <div className="font-medium">{testimonial.name}, {testimonial.location}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Next Button */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
          <button 
            onClick={handleNext}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
            aria-label="Next testimonial"
          >
            <ChevronRight className="text-primary" />
          </button>
        </div>
        
        {/* Dots Navigation */}
        <div className="flex justify-center mt-6 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? "bg-accent" : "bg-gray-300"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
              aria-current={index === currentIndex}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
