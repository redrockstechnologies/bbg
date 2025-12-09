import { Link } from "wouter";

const Services = () => {
  return (
    <section className="mb-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl mb-3 font-medium">Our Services</h2>
        <div className="w-24 h-1 bg-accent mx-auto"></div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Baby Gear Rentals Card */}
        <div className="service-card bg-card rounded-lg shadow-lg overflow-hidden transition-all duration-300">
          <img 
            src="/assets/ServiceOne.png"
            alt="Baby Gear Rental Service" 
            className="w-full h-64 object-cover"
          />
          <div className="p-6">
            <h3 className="text-2xl mb-3">Baby Gear Rentals</h3>
            <p className="mb-5">
              From camp cots and strollers to high chairs and bumbos — we have all the essentials to make your baby comfortable on holiday.
            </p>
            <Link href="/gear">
              <span className="bg-accent hover:bg-accent/90 text-white py-2 px-6 rounded-full inline-block transition-colors cursor-pointer">
                View Our Gear
              </span>
            </Link>
          </div>
        </div>

        {/* NappyNow Card */}
        <div className="service-card bg-card rounded-lg shadow-lg overflow-hidden transition-all duration-300">
          <img 
            src="/assets/ServiceTwo.png"
            alt="NappyNow Delivery Service" 
            className="w-full h-64 object-cover"
          />
          <div className="p-6">
            <h3 className="text-2xl mb-3">Baby Essentials</h3>
            <p className="mb-5">
              Need nappies, wipes, or other baby essentials delivered right to your doorstep? Our Baby Essentials service has you covered.
            </p>
            <Link href="/baby-essentials">
              <span className="bg-accent hover:bg-accent/90 text-white py-2 px-6 rounded-full inline-block transition-colors cursor-pointer">
                Shop Our Essentials
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;