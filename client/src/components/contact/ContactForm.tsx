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

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  arrivalDate: z.string().optional(),
  departureDate: z.string().optional(),
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
      arrivalDate: "",
      departureDate: "",
      message: "",
    },
  });
  
  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Format enquiry items as a readable string
      const formattedEnquiryItems = enquiryItems.map(item => 
        `${item.ItemType} for ${item.DayCost} per day; ${item.WeekCost} per week`
      ).join('\n');
      
      // Create form data
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      if (data.arrivalDate) formData.append("arrivalDate", data.arrivalDate);
      if (data.departureDate) formData.append("departureDate", data.departureDate);
      formData.append("message", data.message);
      if (formattedEnquiryItems) {
        formData.append("enquiryItems", formattedEnquiryItems);
      }
      // Add custom subject
      const randomId = Math.random().toString(36).substring(2, 10);
      formData.append("_subject", `BBG inquiry from ${data.name} (#${randomId})`);
      
      // Submit to FormSubmit
      const response = await fetch("https://formsubmit.co/hello.jmbabysitting@gmail.com", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error("Failed to submit form");
      }
      
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
      console.error("Error submitting message:", error);
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
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input type="tel" {...field} className="w-full p-3 rounded-lg border border-gray-300 focus:border-accent focus:ring-1 focus:ring-accent outline-none" />
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
                    <span>{item.ItemType}</span>
                    <span>{item.DayCost}/day</span>
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
