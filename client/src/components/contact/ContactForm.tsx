import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEnquiry } from "@/context/EnquiryContext";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please include country code (e.g., +27 82 467 1910)"),
  area: z.string().min(2, "Please specify the area you're staying in"),
  arrivalDate: z.string().optional(),
  departureDate: z.string().optional(),
  needsDelivery: z.boolean().default(false),
  needsPickup: z.boolean().default(false),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enquiryItems, clearEnquiry } = useEnquiry();
  const { toast } = useToast();
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      area: "",
      arrivalDate: "",
      departureDate: "",
      needsDelivery: false,
      needsPickup: false,
      message: "",
    },
  });
  
  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Format enquiry items as a readable string
      const formattedEnquiryItems = enquiryItems.map(item => {
        const weeklyInfo = item.weeklyPrice !== null ? `; R${item.weeklyPrice} per week` : '';
        return `${item.title} for R${item.dailyPrice} per day${weeklyInfo}`;
      }).join('\n');
      
      // Submit to API route for email notifications
      const contactData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        area: data.area,
        arrivalDate: data.arrivalDate || null,
        departureDate: data.departureDate || null,
        needsDelivery: data.needsDelivery,
        needsPickup: data.needsPickup,
        message: data.message,
        enquiryItems: formattedEnquiryItems || null
      };

      console.log("Submitting to API:", contactData);
      
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit contact form');
      }

      const result = await response.json();
      console.log("Contact message submitted:", result);
      
      // Reset form and enquiry
      form.reset();
      if (enquiryItems.length > 0) {
        clearEnquiry();
      }
      
      // Show success message
      toast({
        title: "Message sent!",
        description: "We've received your message and will get back to you soon.",
        duration: 5000,
      });
    } catch (error) {
      console.error("Error submitting message to Firebase:", error);
      toast({
        title: "Error sending message",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl mb-6">Send Us a Message</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Name</FormLabel>
                <FormControl>
                  <Input {...field} className="w-full p-3 rounded-lg border border-gray-300 focus:border-accent focus:ring-1 focus:ring-accent outline-none" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input type="email" {...field} className="w-full p-3 rounded-lg border border-gray-300 focus:border-accent focus:ring-1 focus:ring-accent outline-none" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number (with country code)</FormLabel>
                <FormControl>
                  <Input 
                    type="tel" 
                    {...field} 
                    placeholder="+27 82 467 1910"
                    className="w-full p-3 rounded-lg border border-gray-300 focus:border-accent focus:ring-1 focus:ring-accent outline-none" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Area you're staying in</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="e.g., Ballito, Salt Rock, Sheffield Beach"
                    className="w-full p-3 rounded-lg border border-gray-300 focus:border-accent focus:ring-1 focus:ring-accent outline-none" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="arrivalDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arrival Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="w-full p-3 rounded-lg border border-gray-300 focus:border-accent focus:ring-1 focus:ring-accent outline-none" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="departureDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departure Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="w-full p-3 rounded-lg border border-gray-300 focus:border-accent focus:ring-1 focus:ring-accent outline-none" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Select your delivery and pickup preferences. These services may be at an added cost - review rates on the <a href="/gear" className="text-accent underline">Our Gear</a> page.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="needsDelivery"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I need Delivery
                      </FormLabel>
                      <p className="text-sm text-gray-500">
                        We will deliver to your accommodation or the Airport
                      </p>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="needsPickup"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I need Pickup
                      </FormLabel>
                      <p className="text-sm text-gray-500">
                        We will pick the equipment up after your holiday from your accommodation or the Airport
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Message</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    rows={5} 
                    className="w-full p-3 rounded-lg border border-gray-300 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Enquiry Items */}
          {enquiryItems.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-3">Your Enquiry Items:</h3>
              <div className="bg-card p-4 rounded-lg">
                {enquiryItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center mb-2 pb-2 border-b border-white/20">
                    <span>{item.title}</span>
                    <div className="flex gap-2">
                      <span>R{item.dailyPrice}/day</span>
                      {item.weeklyPrice !== null && (
                        <>
                          <span>|</span>
                          <span>R{item.weeklyPrice}/week</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-accent hover:bg-accent/90 text-white py-3 px-6 rounded-full transition-colors w-full"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ContactForm;
