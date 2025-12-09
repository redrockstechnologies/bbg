import { Link } from "wouter";

const Hero = () => {
  return (
    <div className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden w-full">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-0 z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-50 z-10"></div>

      {/* Background Image */}
      <img 
        src="/assets/Hero.png" 
        alt="Family on beach vacation" 
        className="w-full h-full object-cover"
      />

      {/* Hero Content */}
      <div className="absolute bottom-0 left-0 p-8 md:p-12 lg:p-16 z-20 w-full text-white container mx-auto">
        <h1 className="text-3xl md:text-5xl mb-4 leading-tight">
          Relax, everything Baby needs is already here.
        </h1>
        <p className="text-xl md:text-2xl mb-8">
          Experience effortless holidays with Ballito Baby Gear
        </p>
        <Link href="/gear">
          <span className="bg-accent hover:bg-accent/90 text-white font-medium py-3 px-6 rounded-full inline-block transition-colors cursor-pointer">
            Browse Our Gear
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Hero;