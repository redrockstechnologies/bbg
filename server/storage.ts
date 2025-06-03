import { 
  users, type User, type InsertUser,
  gearItems, type GearItem, type InsertGearItem,
  testimonials, type Testimonial, type InsertTestimonial,
  contactMessages, type ContactMessage, type InsertContactMessage, 
  deliveryRates, type DeliveryRate, type InsertDeliveryRate,
  priceGuides, type PriceGuide, type InsertPriceGuide
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Gear item operations
  getAllGearItems(): Promise<GearItem[]>;
  getGearItem(id: number): Promise<GearItem | undefined>;
  createGearItem(gearItem: InsertGearItem): Promise<GearItem>;
  updateGearItem(id: number, gearItem: InsertGearItem): Promise<GearItem | undefined>;
  deleteGearItem(id: number): Promise<boolean>;

  // Testimonial operations
  getAllTestimonials(): Promise<Testimonial[]>;
  getTestimonial(id: number): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: number, testimonial: InsertTestimonial): Promise<Testimonial | undefined>;
  deleteTestimonial(id: number): Promise<boolean>;

  // Contact message operations
  getAllContactMessages(): Promise<ContactMessage[]>;
  getContactMessage(id: number): Promise<ContactMessage | undefined>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;

  // Price guide operations
  getPriceGuide(): Promise<PriceGuide | undefined>;
  createOrUpdatePriceGuide(priceGuide: InsertPriceGuide): Promise<PriceGuide>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private gearItems: Map<number, GearItem>;
  private testimonials: Map<number, Testimonial>;
  private contactMessages: Map<number, ContactMessage>;
  private priceGuide: PriceGuide | undefined;

  private userCurrentId: number;
  private gearCurrentId: number;
  private testimonialCurrentId: number;
  private contactMessageCurrentId: number;
  private priceGuideCurrentId: number;

  constructor() {
    this.users = new Map();
    this.gearItems = new Map();
    this.testimonials = new Map();
    this.contactMessages = new Map();

    this.userCurrentId = 1;
    this.gearCurrentId = 1;
    this.testimonialCurrentId = 1;
    this.contactMessageCurrentId = 1;
    this.priceGuideCurrentId = 1;

    // Initialize with default price guide
    this.priceGuide = {
      id: 1,
      title: "Our Price Guide",
      subtitle: "View our Price Guide for the full price list of our products & services as well as our terms & conditions",
      fileUrl: "",
      fileName: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Initialize with admin user
    this.createUser({ username: "admin", password: "password" });

    // Add some default gear items
    this.createGearItem({
      itemType: "Baby Cot",
      dayCost: "R120",
      weekCost: "R600",
      additionalDeets: "Comfortable, sturdy cot with mattress and fitted sheet included. Perfect for babies up to 2 years.",
      imageUrl: "https://images.unsplash.com/photo-1618314085635-340e9b8a6daf?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80"
    });

    this.createGearItem({
      itemType: "Stroller",
      dayCost: "R150",
      weekCost: "R750",
      additionalDeets: "Lightweight, easy-fold stroller with sun canopy. Suitable for babies 6 months and older.",
      imageUrl: "https://images.unsplash.com/photo-1591349884490-a6e09f2f4e1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80"
    });

    this.createGearItem({
      itemType: "High Chair",
      dayCost: "R100",
      weekCost: "R500",
      additionalDeets: "Easy-clean high chair with adjustable height and removable tray. Suitable for babies who can sit unassisted.",
      imageUrl: "https://pixabay.com/get/g31ccf60c89bd83a410930828c2fe9bdc945c8529b6366a239b381eeb2fe20d1208db7e8a2e6eafade15e7d5cb6b789bc1db39c5fb247e869365c41fb4cf09fa1_1280.jpg"
    });

    // Add some default testimonials
    this.createTestimonial({
      name: "Sarah T.",
      location: "Johannesburg",
      rating: 5,
      text: "Absolute lifesaver! We traveled with our 8-month-old and didn't have to worry about packing any baby gear. Everything was spotless and high quality."
    });

    this.createTestimonial({
      name: "Michael R.",
      location: "Cape Town",
      rating: 5,
      text: "The NappyNow service was incredible! We ran out of nappies at 9 PM and they had them delivered within the hour. Cannot recommend enough!"
    });

    this.createTestimonial({
      name: "Emma K.",
      location: "Durban",
      rating: 5,
      text: "We've used baby gear rental services before, but Ballito Baby Gear is on another level. The quality of the equipment and the service was impeccable."
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Gear item operations
  async getAllGearItems(): Promise<GearItem[]> {
    return Array.from(this.gearItems.values());
  }

  async getGearItem(id: number): Promise<GearItem | undefined> {
    return this.gearItems.get(id);
  }

  async createGearItem(insertGearItem: InsertGearItem): Promise<GearItem> {
    const id = this.gearCurrentId++;
    const gearItem: GearItem = { ...insertGearItem, id };
    this.gearItems.set(id, gearItem);
    return gearItem;
  }

  async updateGearItem(id: number, updateGearItem: InsertGearItem): Promise<GearItem | undefined> {
    const existingGearItem = this.gearItems.get(id);
    if (!existingGearItem) {
      return undefined;
    }

    const updatedGearItem: GearItem = { ...updateGearItem, id };
    this.gearItems.set(id, updatedGearItem);
    return updatedGearItem;
  }

  async deleteGearItem(id: number): Promise<boolean> {
    return this.gearItems.delete(id);
  }

  // Testimonial operations
  async getAllTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    return this.testimonials.get(id);
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.testimonialCurrentId++;
    const testimonial: Testimonial = { ...insertTestimonial, id };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }

  async updateTestimonial(id: number, updateTestimonial: InsertTestimonial): Promise<Testimonial | undefined> {
    const existingTestimonial = this.testimonials.get(id);
    if (!existingTestimonial) {
      return undefined;
    }

    const updatedTestimonial: Testimonial = { ...updateTestimonial, id };
    this.testimonials.set(id, updatedTestimonial);
    return updatedTestimonial;
  }

  async deleteTestimonial(id: number): Promise<boolean> {
    return this.testimonials.delete(id);
  }

  // Contact message operations
  async getAllContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values());
  }

  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    return this.contactMessages.get(id);
  }

  async createContactMessage(insertContactMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.contactMessageCurrentId++;
    const contactMessage: ContactMessage = { ...insertContactMessage, id };
    this.contactMessages.set(id, contactMessage);
    return contactMessage;
  }

  // Price guide operations
  async getPriceGuide(): Promise<PriceGuide | undefined> {
    return this.priceGuide;
  }

  async createOrUpdatePriceGuide(insertPriceGuide: InsertPriceGuide): Promise<PriceGuide> {
    if (this.priceGuide) {
      // Update existing
      this.priceGuide = {
        ...this.priceGuide,
        ...insertPriceGuide,
        updatedAt: new Date().toISOString()
      };
    } else {
      // Create new
      const id = this.priceGuideCurrentId++;
      this.priceGuide = {
        ...insertPriceGuide,
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
    return this.priceGuide;
  }
}

export const storage = new MemStorage();