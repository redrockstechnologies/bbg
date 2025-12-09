import React from 'react';
import { Helmet } from 'react-helmet';
import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import Services from '@/components/home/Services';
import Testimonials from '@/components/home/Testimonials';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Ballito Baby Gear | Experience Effortless Holidays</title>
        <meta name="description" content="Ballito Baby Gear provides holidaying parents with baby gear rentals so they can avoid playing Tetris with the boot of their car. Experience effortless holidays with baby." />
        <meta property="og:title" content="Ballito Baby Gear | Experience Effortless Holidays" />
        <meta property="og:description" content="Rent premium baby equipment for your vacation in Ballito. We deliver and collect everything your little one needs during your stay." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ballitobabygear.co.za" />
      </Helmet>
      
      {/* Hero Section */}
      <Hero />
      
      <div className="container mx-auto px-4 py-8">
        {/* About Section */}
        <About />
        
        {/* Services Section */}
        <Services />
        
        {/* Testimonials Section */}
        <Testimonials />
      </div>
    </>
  );
};

export default Home;
