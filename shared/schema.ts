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
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).pick({
  name: true,
  email: true,
  phone: true,
  arrivalDate: true,
  departureDate: true,
  message: true,
  enquiryItems: true,
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
