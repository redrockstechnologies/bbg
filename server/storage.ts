import { eq } from "drizzle-orm";
import { db } from "./db";
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
  archiveContactMessage(id: number): Promise<ContactMessage | undefined>;

  // Delivery rate operations
  getAllDeliveryRates(): Promise<DeliveryRate[]>;
  getDeliveryRate(id: number): Promise<DeliveryRate | undefined>;
  createDeliveryRate(rate: InsertDeliveryRate): Promise<DeliveryRate>;
  updateDeliveryRate(id: number, rate: InsertDeliveryRate): Promise<DeliveryRate | undefined>;
  deleteDeliveryRate(id: number): Promise<boolean>;

  // Price guide operations
  getPriceGuide(): Promise<PriceGuide | undefined>;
  createOrUpdatePriceGuide(priceGuide: InsertPriceGuide): Promise<PriceGuide>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Gear item operations
  async getAllGearItems(): Promise<GearItem[]> {
    return await db.select().from(gearItems);
  }

  async getGearItem(id: number): Promise<GearItem | undefined> {
    const result = await db.select().from(gearItems).where(eq(gearItems.id, id)).limit(1);
    return result[0];
  }

  async createGearItem(insertGearItem: InsertGearItem): Promise<GearItem> {
    const result = await db.insert(gearItems).values(insertGearItem).returning();
    return result[0];
  }

  async updateGearItem(id: number, updateGearItem: InsertGearItem): Promise<GearItem | undefined> {
    const result = await db.update(gearItems).set(updateGearItem).where(eq(gearItems.id, id)).returning();
    return result[0];
  }

  async deleteGearItem(id: number): Promise<boolean> {
    const result = await db.delete(gearItems).where(eq(gearItems.id, id)).returning();
    return result.length > 0;
  }

  // Testimonial operations
  async getAllTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials);
  }

  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    const result = await db.select().from(testimonials).where(eq(testimonials.id, id)).limit(1);
    return result[0];
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const result = await db.insert(testimonials).values(insertTestimonial).returning();
    return result[0];
  }

  async updateTestimonial(id: number, updateTestimonial: InsertTestimonial): Promise<Testimonial | undefined> {
    const result = await db.update(testimonials).set(updateTestimonial).where(eq(testimonials.id, id)).returning();
    return result[0];
  }

  async deleteTestimonial(id: number): Promise<boolean> {
    const result = await db.delete(testimonials).where(eq(testimonials.id, id)).returning();
    return result.length > 0;
  }

  // Contact message operations
  async getAllContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages);
  }

  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    const result = await db.select().from(contactMessages).where(eq(contactMessages.id, id)).limit(1);
    return result[0];
  }

  async createContactMessage(insertContactMessage: InsertContactMessage): Promise<ContactMessage> {
    const result = await db.insert(contactMessages).values(insertContactMessage).returning();
    return result[0];
  }

  async archiveContactMessage(id: number): Promise<ContactMessage | undefined> {
    const result = await db.update(contactMessages).set({ archived: true }).where(eq(contactMessages.id, id)).returning();
    return result[0];
  }

  // Delivery rate operations
  async getAllDeliveryRates(): Promise<DeliveryRate[]> {
    return await db.select().from(deliveryRates);
  }

  async getDeliveryRate(id: number): Promise<DeliveryRate | undefined> {
    const result = await db.select().from(deliveryRates).where(eq(deliveryRates.id, id)).limit(1);
    return result[0];
  }

  async createDeliveryRate(insertDeliveryRate: InsertDeliveryRate): Promise<DeliveryRate> {
    const result = await db.insert(deliveryRates).values(insertDeliveryRate).returning();
    return result[0];
  }

  async updateDeliveryRate(id: number, updateDeliveryRate: InsertDeliveryRate): Promise<DeliveryRate | undefined> {
    const result = await db.update(deliveryRates).set(updateDeliveryRate).where(eq(deliveryRates.id, id)).returning();
    return result[0];
  }

  async deleteDeliveryRate(id: number): Promise<boolean> {
    const result = await db.delete(deliveryRates).where(eq(deliveryRates.id, id)).returning();
    return result.length > 0;
  }

  // Price guide operations
  async getPriceGuide(): Promise<PriceGuide | undefined> {
    const result = await db.select().from(priceGuides).limit(1);
    return result[0];
  }

  async createOrUpdatePriceGuide(insertPriceGuide: InsertPriceGuide): Promise<PriceGuide> {
    const existing = await this.getPriceGuide();
    const now = new Date().toISOString();

    if (existing) {
      // Update existing
      const updateData = {
        ...insertPriceGuide,
        updatedAt: now
      };
      const result = await db.update(priceGuides).set(updateData).where(eq(priceGuides.id, existing.id)).returning();
      return result[0];
    } else {
      // Create new
      const createData = {
        ...insertPriceGuide,
        createdAt: now,
        updatedAt: now
      };
      const result = await db.insert(priceGuides).values(createData).returning();
      return result[0];
    }
  }
}

export const storage = new DatabaseStorage();