import { Link } from "wouter";

const Services = () => {
  return (
    <section className="mb-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl mb-3">Our Services</h2>
        <div className="w-24 h-1 bg-accent mx-auto"></div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Baby Gear Rentals Card */}
        <div className="service-card bg-card rounded-lg shadow-lg overflow-hidden transition-all duration-300">
          <img 
            src="https://images.unsplash.com/photo-1600627094888-1957e7797da4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80" 
            alt="Baby Gear Rental Service" 
            className="w-full h-64 object-cover"
          />
          <div className="p-6">
            <h3 className="text-2xl mb-3">Baby Gear Rentals</h3>
            <p className="mb-5">
              From cribs and strollers to high chairs and bath tubs — we have all the essentials to make your baby comfortable on holiday.
            </p>
            <Link href="/gear">
              <a className="bg-accent hover:bg-accent/90 text-white py-2 px-6 rounded-full inline-block transition-colors">
                View Our Gear
              </a>
            </Link>
          </div>
        </div>
        
        {/* NappyNow Card */}
        <div className="service-card bg-card rounded-lg shadow-lg overflow-hidden transition-all duration-300">
          <img 
            src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80" 
            alt="NappyNow Delivery Service" 
            className="w-full h-64 object-cover"
          />
          <div className="p-6">
            <h3 className="text-2xl mb-3">NappyNow</h3>
            <p className="mb-5">
              Need nappies, wipes, or other baby essentials delivered right to your doorstep? Our NappyNow service has you covered.
            </p>
            <Link href="/contact">
              <a className="bg-accent hover:bg-accent/90 text-white py-2 px-6 rounded-full inline-block transition-colors">
                Contact Us
              </a>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
