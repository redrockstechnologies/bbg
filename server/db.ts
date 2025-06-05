
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { 
  users, gearItems, testimonials, contactMessages, 
  deliveryRates, priceGuides 
} from "@shared/schema";

// Use Replit's environment variables for database connection
const connectionString = process.env.DATABASE_URL || "postgresql://localhost:5432/ballito_baby_gear";

const sql = postgres(connectionString);
export const db = drizzle(sql);

// Initialize database with default data if empty
export async function initializeDatabase() {
  try {
    // Check if admin user exists
    const adminExists = await db.select().from(users).where(eq(users.username, "admin")).limit(1);
    
    if (adminExists.length === 0) {
      // Create admin user
      await db.insert(users).values({
        username: "admin",
        password: "password"
      });
    }

    // Check if price guide exists
    const priceGuideExists = await db.select().from(priceGuides).limit(1);
    
    if (priceGuideExists.length === 0) {
      // Create default price guide
      await db.insert(priceGuides).values({
        title: "Our Price Guide",
        subtitle: "View our Price Guide for the full price list of our products & services as well as our terms & conditions",
        fileUrl: "",
        fileName: ""
      });
    }

    // Add default gear items if none exist
    const gearExists = await db.select().from(gearItems).limit(1);
    
    if (gearExists.length === 0) {
      await db.insert(gearItems).values([
        {
          itemType: "Baby Cot",
          dayCost: "R120",
          weekCost: "R600",
          additionalDeets: "Comfortable, sturdy cot with mattress and fitted sheet included. Perfect for babies up to 2 years.",
          imageUrl: "https://images.unsplash.com/photo-1618314085635-340e9b8a6daf?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80"
        },
        {
          itemType: "Stroller",
          dayCost: "R150",
          weekCost: "R750",
          additionalDeets: "Lightweight, easy-fold stroller with sun canopy. Suitable for babies 6 months and older.",
          imageUrl: "https://images.unsplash.com/photo-1591349884490-a6e09f2f4e1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80"
        },
        {
          itemType: "High Chair",
          dayCost: "R100",
          weekCost: "R500",
          additionalDeets: "Easy-clean high chair with adjustable height and removable tray. Suitable for babies who can sit unassisted.",
          imageUrl: "https://pixabay.com/get/g31ccf60c89bd83a410930828c2fe9bdc945c8529b6366a239b381eeb2fe20d1208db7e8a2e6eafade15e7d5cb6b789bc1db39c5fb4cf09fa1_1280.jpg"
        }
      ]);
    }

    // Add default testimonials if none exist
    const testimonialsExist = await db.select().from(testimonials).limit(1);
    
    if (testimonialsExist.length === 0) {
      await db.insert(testimonials).values([
        {
          name: "Sarah T.",
          location: "Johannesburg",
          rating: 5,
          text: "Absolute lifesaver! We traveled with our 8-month-old and didn't have to worry about packing any baby gear. Everything was spotless and high quality."
        },
        {
          name: "Michael R.",
          location: "Cape Town",
          rating: 5,
          text: "The NappyNow service was incredible! We ran out of nappies at 9 PM and they had them delivered within the hour. Cannot recommend enough!"
        },
        {
          name: "Emma K.",
          location: "Durban",
          rating: 5,
          text: "We've used baby gear rental services before, but Ballito Baby Gear is on another level. The quality of the equipment and the service was impeccable."
        }
      ]);
    }

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}
