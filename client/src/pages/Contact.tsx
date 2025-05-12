import React from 'react';
import { Helmet } from 'react-helmet';
import ContactForm from '@/components/contact/ContactForm';
import ContactInfo from '@/components/contact/ContactInfo';

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us | Ballito Baby Gear</title>
        <meta name="description" content="Have questions or need to make a booking? Get in touch with Ballito Baby Gear today. We provide premium baby equipment rentals in Ballito and surrounding areas." />
        <meta property="og:title" content="Contact Us | Ballito Baby Gear" />
        <meta property="og:description" content="Have questions or need to make a booking? Get in touch with Ballito Baby Gear today." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ballitobabygear.co.za/contact" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl mb-3">Contact Us</h1>
          <p className="text-xl max-w-3xl mx-auto">Have questions or need to make a booking? Get in touch with us today.</p>
          <div className="w-24 h-1 bg-accent mx-auto mt-4"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Form */}
          <ContactForm />
          
          {/* Contact Information and FAQs */}
          <ContactInfo />
        </div>
      </div>
    </>
  );
};

export default Contact;
