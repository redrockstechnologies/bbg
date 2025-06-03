import React from 'react';
import { Helmet } from 'react-helmet';
import GearGrid from '@/components/gear/GearGrid';
import EnquiryBar from '@/components/gear/EnquiryBar';
import DeliveryRates from '@/components/gear/DeliveryRates';

const Gear = () => {
  return (
    <>
      <Helmet>
        <title>Our Baby Gear | Ballito Baby Gear Rentals</title>
        <meta name="description" content="Browse our collection of premium baby equipment available for rent during your stay in Ballito. From cribs and strollers to high chairs and car seats." />
        <meta property="og:title" content="Our Baby Gear | Ballito Baby Gear Rentals" />
        <meta property="og:description" content="Browse our collection of premium baby equipment available for rent during your stay in Ballito." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ballitobabygear.co.za/gear" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl mb-3">Our Baby Gear</h1>
          <p className="text-xl max-w-3xl mx-auto">Browse our collection of premium baby equipment available for rent during your stay in Ballito.</p>
          <div className="w-24 h-1 bg-accent mx-auto mt-4"></div>
        </div>
        
        {/* Gear Grid Component */}
        <GearGrid />
        
        {/* Delivery Rates Component */}
        <DeliveryRates />
        
        {/* Enquiry Bar Component */}
        <EnquiryBar />
      </div>
    </>
  );
};

export default Gear;
