
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Calendar, User, MessageCircle, Package, Archive, MessageSquare } from "lucide-react";
import { collection, getDocs, doc, updateDoc, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  arrivalDate?: string;
  departureDate?: string;
  message: string;
  enquiryItems?: string;
  archived?: boolean;
  createdAt?: string;
}

const ContactMessagesManagement = () => {
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<'new' | 'archived'>('new');
  const { toast } = useToast();

  useEffect(() => {
    fetchContactMessages();
  }, []);

  const fetchContactMessages = async () => {
    try {
      console.log("Fetching contact messages from Firebase...");
      const messagesCollection = collection(db, 'contactMessages');
      const messagesQuery = query(messagesCollection, orderBy('createdAt', 'asc'));
      const messagesSnapshot = await getDocs(messagesQuery);
      
      const messages: ContactMessage[] = [];
      messagesSnapshot.forEach((doc) => {
        const data = doc.data();
        messages.push({
          id: doc.id, // Use actual Firebase document ID
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          arrivalDate: data.arrivalDate || undefined,
          departureDate: data.departureDate || undefined,
          message: data.message || '',
          enquiryItems: data.enquiryItems || undefined,
          archived: data.archived || false,
          createdAt: data.createdAt || undefined
        });
      });
      
      console.log("Fetched messages:", messages);
      setContactMessages(messages);
    } catch (error) {
      console.error("Error fetching contact messages from Firebase:", error);
      toast({
        title: "Error",
        description: "Failed to load contact messages from Firebase",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const archiveMessage = async (messageId: string) => {
    try {
      const messageDoc = doc(db, 'contactMessages', messageId);
      await updateDoc(messageDoc, {
        archived: true
      });
      
      fetchContactMessages();
      toast({
        title: "Success",
        description: "Message archived successfully",
      });
    } catch (error) {
      console.error("Error archiving message:", error);
      toast({
        title: "Error",
        description: "Failed to archive message",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString();
  };

  const formatPhoneForWhatsApp = (phone: string) => {
    // Remove all non-numeric characters except +
    let cleaned = phone.replace(/[^\d+]/g, '');
    
    // If it starts with +, remove it
    if (cleaned.startsWith('+')) {
      cleaned = cleaned.substring(1);
    }
    
    // If it starts with 0, assume it's South African and replace with 27
    if (cleaned.startsWith('0')) {
      cleaned = '27' + cleaned.substring(1);
    }
    
    return cleaned;
  };

  const openWhatsApp = (message: ContactMessage) => {
    const formattedPhone = formatPhoneForWhatsApp(message.phone);
    const whatsappMessage = `Hi ${message.name}, thank you for your inquiry about Ballito Baby Gear rental services. How can we assist you?`;
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  const openEmailClient = (message: ContactMessage) => {
    const subject = `Re: Your inquiry - Ballito Baby Gear`;
    const body = `Hi ${message.name},\n\nThank you for your inquiry about our baby gear rental services.\n\n`;
    const mailto = `mailto:${message.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailto);
  };

  const filteredMessages = contactMessages.filter(message => {
    if (filter === 'new') return !message.archived;
    return message.archived;
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading contact messages...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Gelica, serif' }}>
              Contact Messages Management
            </h3>
            <p className="text-gray-600 mt-1" style={{ fontFamily: 'Figtree, sans-serif' }}>
              View and manage customer inquiries and messages
            </p>
          </div>
          <Button onClick={fetchContactMessages} className="bg-accent hover:bg-accent/90">
            Refresh
          </Button>
        </div>
      </div>

      {/* Filter toggle */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          className={`px-6 py-2 rounded-full font-medium transition-colors ${
            filter === 'new' ? 'bg-accent text-white' : 'bg-gray-200 text-primary'
          }`}
          onClick={() => setFilter('new')}
        >
          New Messages ({contactMessages.filter(m => !m.archived).length})
        </button>
        <button
          className={`px-6 py-2 rounded-full font-medium transition-colors ${
            filter === 'archived' ? 'bg-accent text-white' : 'bg-gray-200 text-primary'
          }`}
          onClick={() => setFilter('archived')}
        >
          Archived ({contactMessages.filter(m => m.archived).length})
        </button>
      </div>

      {filteredMessages.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No {filter} messages yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredMessages.map((message) => (
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
                    <p className="text-xs text-gray-500">Submitted: {formatDateTime(message.createdAt)}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => openWhatsApp(message)}
                    className="bg-green-500 hover:bg-green-600 text-white"
                    size="sm"
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Send WhatsApp
                  </Button>
                  <Button
                    onClick={() => openEmailClient(message)}
                    className="bg-accent hover:bg-accent/90 text-white"
                    size="sm"
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    Reply via Email
                  </Button>
                  {!message.archived && (
                    <Button
                      onClick={() => archiveMessage(message.id)}
                      variant="outline"
                      size="sm"
                    >
                      <Archive className="w-4 h-4 mr-1" />
                      Archive
                    </Button>
                  )}
                </div>
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
