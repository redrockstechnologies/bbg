import { Phone, Mail, Clock, MapPin } from "lucide-react";

const ContactInfo = () => {
  return (
    <div>
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl mb-6">Contact Information</h2>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <Phone className="text-accent mr-3 mt-1" size={20} />
            <div>
              <h3 className="font-medium">Phone</h3>
              <p>+27 72 125 7824</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Mail className="text-accent mr-3 mt-1" size={20} />
            <div>
              <h3 className="font-medium">Email</h3>
              <p>hello.jmbabysitting@gmail.com</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Clock className="text-accent mr-3 mt-1" size={20} />
            <div>
              <h3 className="font-medium">Operating Hours</h3>
              <p>Monday to Saturday: 10:00 AM - 04:00 PM</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <MapPin className="text-accent mr-3 mt-1" size={20} />
            <div>
              <h3 className="font-medium">Service Area</h3>
              <p>Ballito and surrounding areas (within 30km)</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-lg mb-1">How does delivery and collection work?</h3>
            <p className="text-sm">We can deliver and collect all items at your accommodation at times that suit you, or to the airport. There is an extra charge for this service.</p>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-1">How clean is your equipment?</h3>
            <p className="text-sm">All our equipment is thoroughly sanitized between rentals using hospital-grade, baby-safe cleaning products.</p>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-1">What if something breaks during our rental?</h3>
            <p className="text-sm">Contact us immediately and we'll arrange a replacement. Normal wear and tear is expected, but damage beyond this may incur additional charges.</p>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-1">How far in advance should I book?</h3>
            <p className="text-sm">We recommend booking at least one week in advance during regular seasons and 2-3 weeks for peak holiday periods.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
