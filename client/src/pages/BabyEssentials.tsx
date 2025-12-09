
import React from 'react';
import { Helmet } from 'react-helmet';
import BabyEssentialsGrid from '@/components/babyEssentials/BabyEssentialsGrid';
import EnquiryBar from '@/components/gear/EnquiryBar';

const BabyEssentials = () => {
  return (
    <>
      <Helmet>
        <title>Baby Essentials | Ballito Baby Gear Rentals</title>
        <meta name="description" content="Browse our collection of baby essentials available for purchase during your stay in Ballito." />
        <meta property="og:title" content="Baby Essentials | Ballito Baby Gear Rentals" />
        <meta property="og:description" content="Browse our collection of baby essentials available for purchase during your stay in Ballito." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ballitobabygear.co.za/baby-essentials" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl mb-3">Baby Essentials</h1>
          <p className="text-xl max-w-3xl mx-auto">Browse our collection of baby essentials available during your stay in Ballito.</p>
          <div className="w-24 h-1 bg-accent mx-auto mt-4"></div>
        </div>
        
        {/* Baby Essentials Grid Component */}
        <BabyEssentialsGrid />
        
        {/* Enquiry Bar Component */}
        <EnquiryBar />
      </div>
    </>
  );
};

export default BabyEssentials;
