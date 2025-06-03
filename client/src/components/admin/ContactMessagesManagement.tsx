
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Calendar, User, MessageCircle, Package } from "lucide-react";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  arrivalDate?: string;
  departureDate?: string;
  message: string;
  enquiryItems?: string;
}

const ContactMessagesManagement = () => {
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchContactMessages();
  }, []);

  const fetchContactMessages = async () => {
    try {
      const response = await fetch("/api/contact");
      if (response.ok) {
        const data = await response.json();
        setContactMessages(data.sort((a: ContactMessage, b: ContactMessage) => b.id - a.id));
      }
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      toast({
        title: "Error",
        description: "Failed to load contact messages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString();
  };

  const openEmailClient = (message: ContactMessage) => {
    const subject = `Re: Your inquiry - Ballito Baby Gear`;
    const body = `Hi ${message.name},\n\nThank you for your inquiry about our baby gear rental services.\n\n`;
    const mailto = `mailto:${message.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailto);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading contact messages...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Contact Messages</h2>
        <Button onClick={fetchContactMessages} className="bg-accent hover:bg-accent/90">
          Refresh
        </Button>
      </div>

      {contactMessages.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No contact messages yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {contactMessages.map((message) => (
            <div
              key={message.id}
              className="bg-white rounded-lg shadow-md p-6 border hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <User className="text-accent" size={20} />
                  <div>
                    <h3 className="text-lg font-semibold">{message.name}</h3>
                    <p className="text-sm text-gray-600">Message #{message.id}</p>
                  </div>
                </div>
                <Button
                  onClick={() => openEmailClient(message)}
                  className="bg-accent hover:bg-accent/90 text-white"
                  size="sm"
                >
                  Reply via Email
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Mail className="text-gray-500" size={16} />
                  <span className="text-sm">{message.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="text-gray-500" size={16} />
                  <span className="text-sm">{message.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="text-gray-500" size={16} />
                  <span className="text-sm">Arrival: {formatDate(message.arrivalDate)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="text-gray-500" size={16} />
                  <span className="text-sm">Departure: {formatDate(message.departureDate)}</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <MessageCircle className="text-gray-500" size={16} />
                  <span className="text-sm font-medium">Message:</span>
                </div>
                <p className="text-sm bg-gray-50 p-3 rounded border">{message.message}</p>
              </div>

              {message.enquiryItems && (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Package className="text-gray-500" size={16} />
                    <span className="text-sm font-medium">Enquiry Items:</span>
                  </div>
                  <div className="text-sm bg-blue-50 p-3 rounded border">
                    {message.enquiryItems.split('\n').map((item, index) => (
                      <div key={index} className="mb-1">{item}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactMessagesManagement;
