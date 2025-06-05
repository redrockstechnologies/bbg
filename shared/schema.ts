import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema for admin authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Gear items schema
export const gearItems = pgTable("gear_items", {
  id: serial("id").primaryKey(),
  itemType: text("item_type").notNull(),
  dayCost: text("day_cost").notNull(),
  weekCost: text("week_cost").notNull(),
  additionalDeets: text("additional_deets"),
  imageUrl: text("image_url"),
});

export const insertGearItemSchema = createInsertSchema(gearItems).pick({
  itemType: true,
  dayCost: true,
  weekCost: true,
  additionalDeets: true,
  imageUrl: true,
});

// Testimonials schema
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  rating: integer("rating").notNull(),
  text: text("text").notNull(),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).pick({
  name: true,
  location: true,
  rating: true,
  text: true,
});

// Contact messages schema
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  arrivalDate: text("arrival_date"),
  departureDate: text("departure_date"),
  message: text("message").notNull(),
  enquiryItems: text("enquiry_items"),
  archived: boolean("archived").default(false),
  createdAt: text("created_at").notNull(),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).pick({
  name: true,
  email: true,
  phone: true,
  arrivalDate: true,
  departureDate: true,
  message: true,
  enquiryItems: true,
  archived: true,
  createdAt: true,
});

// Delivery rates schema
export const deliveryRates = pgTable("delivery_rates", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  location: text("location").notNull(),
  rate: text("rate").notNull(),
});

export const insertDeliveryRateSchema = createInsertSchema(deliveryRates).pick({
  category: true,
  location: true,
  rate: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type GearItem = typeof gearItems.$inferSelect;
export type InsertGearItem = z.infer<typeof insertGearItemSchema>;

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

// Price guide schema
export const priceGuides = pgTable("price_guides", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  fileUrl: text("file_url"),
  fileName: text("file_name"),
  linkUrl: text("link_url"),
});

export const insertPriceGuideSchema = createInsertSchema(priceGuides).pick({
  title: true,
  subtitle: true,
  fileUrl: true,
  fileName: true,
  linkUrl: true,
});

export type DeliveryRate = typeof deliveryRates.$inferSelect;
export type InsertDeliveryRate = z.infer<typeof insertDeliveryRateSchema>;

export type PriceGuide = typeof priceGuides.$inferSelect;
export type InsertPriceGuide = z.infer<typeof insertPriceGuideSchema>;

// Admin users schema
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  company: text("company"),
  roleId: integer("role_id").references(() => roles.id),
  isActive: boolean("is_active").default(true),
  hasPassword: boolean("has_password").default(false),
  createdAt: text("created_at").notNull(),
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).pick({
  email: true,
  firstName: true,
  lastName: true,
  company: true,
  roleId: true,
  isActive: true,
  hasPassword: true,
  createdAt: true,
});

// Roles schema
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  permissions: text("permissions").notNull(), // JSON string of permissions array
  createdAt: text("created_at").notNull(),
});

export const insertRoleSchema = createInsertSchema(roles).pick({
  name: true,
  description: true,
  permissions: true,
  createdAt: true,
});

// Website images schema for settings
export const websiteImages = pgTable("website_images", {
  id: serial("id").primaryKey(),
  section: text("section").notNull(), // 'hero', 'about', 'footer', etc.
  imageUrl: text("image_url").notNull(),
  altText: text("alt_text"),
  isActive: boolean("is_active").default(true),
  updatedAt: text("updated_at").notNull(),
});

export const insertWebsiteImageSchema = createInsertSchema(websiteImages).pick({
  section: true,
  imageUrl: true,
  altText: true,
  isActive: true,
  updatedAt: true,
});

export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;

export type Role = typeof roles.$inferSelect;
export type InsertRole = z.infer<typeof insertRoleSchema>;

export type WebsiteImage = typeof websiteImages.$inferSelect;
export type InsertWebsiteImage = z.infer<typeof insertWebsiteImageSchema>;