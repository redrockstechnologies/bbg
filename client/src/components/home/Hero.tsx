import { Link } from "wouter";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const Hero = () => {
  const [heroImg, setHeroImg] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeroImg = async () => {
      const configRef = doc(db, "config", "siteImages");
      const configSnap = await getDoc(configRef);
      if (configSnap.exists() && configSnap.data().hasOwnProperty("hero-bg")) {
        setHeroImg(configSnap.data()["hero-bg"]);
      } else {
        setHeroImg("https://pixabay.com/get/gb193432d797864e168e6df940ffe5e3dac87b282d79d10c94d455f1f2d5d38429caca9edab17d030400d670325cbacb9573e7792b8477c20e038343d6575fd5e_1280.jpg");
      }
    };
    fetchHeroImg();
  }, []);

  return (
    <div className="relative h-96 md:h-[500px] overflow-hidden rounded-lg mt-6 mb-12">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-0 z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-50 z-10"></div>
      
      {/* Background Image */}
      {heroImg && (
        <img 
          src={heroImg} 
          alt="Family on beach vacation" 
          className="w-full h-full object-cover"
        />
      )}
      
      {/* Hero Content */}
      <div className="absolute bottom-0 left-0 p-8 z-20 w-full text-white">
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
