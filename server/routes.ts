
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertGearItemSchema, insertTestimonialSchema, insertContactMessageSchema, insertDeliveryRateSchema } from "@shared/schema";
import priceGuideRoutes from "./priceGuide";

async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api

  // Use the price guide routes from priceGuide.ts
  app.use(priceGuideRoutes);

  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const newUser = await storage.createUser(userData);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data", error });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user", error });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      // Check hardcoded credentials first
      if (username === "admin" && password === "password") {
        return res.status(200).json({ success: true });
      }

      // Then check database
      const user = await storage.getUserByUsername(username);
      if (user && user.password === password) {
        return res.status(200).json({ success: true });
      }

      res.status(401).json({ message: "Invalid credentials" });
    } catch (error) {
      res.status(500).json({ message: "Login error", error });
    }
  });

  // Gear items routes
  app.get("/api/gear", async (req, res) => {
    try {
      const gearItems = await storage.getAllGearItems();
      res.json(gearItems);
    } catch (error) {
      res.status(500).json({ message: "Error fetching gear items", error });
    }
  });

  app.get("/api/gear/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const gearItem = await storage.getGearItem(id);
      if (!gearItem) {
        return res.status(404).json({ message: "Gear item not found" });
      }
      res.json(gearItem);
    } catch (error) {
      res.status(500).json({ message: "Error fetching gear item", error });
    }
  });

  app.post("/api/gear", async (req, res) => {
    try {
      const gearData = insertGearItemSchema.parse(req.body);
      const newGearItem = await storage.createGearItem(gearData);
      res.status(201).json(newGearItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid gear item data", error });
    }
  });

  app.put("/api/gear/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const gearData = insertGearItemSchema.parse(req.body);
      const updatedGearItem = await storage.updateGearItem(id, gearData);
      if (!updatedGearItem) {
        return res.status(404).json({ message: "Gear item not found" });
      }
      res.json(updatedGearItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid gear item data", error });
    }
  });

  app.delete("/api/gear/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteGearItem(id);
      if (!success) {
        return res.status(404).json({ message: "Gear item not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting gear item", error });
    }
  });

  // Testimonials routes
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getAllTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Error fetching testimonials", error });
    }
  });

  app.get("/api/testimonials/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const testimonial = await storage.getTestimonial(id);
      if (!testimonial) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      res.json(testimonial);
    } catch (error) {
      res.status(500).json({ message: "Error fetching testimonial", error });
    }
  });

  app.post("/api/testimonials", async (req, res) => {
    try {
      const testimonialData = insertTestimonialSchema.parse(req.body);
      const newTestimonial = await storage.createTestimonial(testimonialData);
      res.status(201).json(newTestimonial);
    } catch (error) {
      res.status(400).json({ message: "Invalid testimonial data", error });
    }
  });

  app.put("/api/testimonials/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const testimonialData = insertTestimonialSchema.parse(req.body);
      const updatedTestimonial = await storage.updateTestimonial(id, testimonialData);
      if (!updatedTestimonial) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      res.json(updatedTestimonial);
    } catch (error) {
      res.status(400).json({ message: "Invalid testimonial data", error });
    }
  });

  app.delete("/api/testimonials/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTestimonial(id);
      if (!success) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting testimonial", error });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const messageData = {
        ...req.body,
        createdAt: new Date().toISOString(),
        archived: false
      };
      const parsed = insertContactMessageSchema.parse(messageData);
      const message = await storage.createContactMessage(parsed);
      res.status(201).json(message);
    } catch (error) {
      console.error("Error creating contact message:", error);
      res.status(500).json({ error: "Failed to create contact message" });
    }
  });

  app.patch("/api/contact/:id/archive", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const message = await storage.archiveContactMessage(id);
      if (!message) {
        res.status(404).json({ error: "Contact message not found" });
        return;
      }
      res.json(message);
    } catch (error) {
      console.error("Error archiving contact message:", error);
      res.status(500).json({ error: "Failed to archive contact message" });
    }
  });
  // Contact message routes
  app.get("/api/contact", async (req, res) => {
    try {
      const messages = await storage.getAllContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({ error: "Failed to fetch contact messages" });
    }
  });

  // Delivery rates routes
  app.get("/api/delivery-rates", async (req, res) => {
    try {
      const deliveryRates = await storage.getAllDeliveryRates();
      res.json(deliveryRates);
    } catch (error) {
      res.status(500).json({ message: "Error fetching delivery rates", error });
    }
  });

  app.post("/api/delivery-rates", async (req, res) => {
    try {
      const rateData = insertDeliveryRateSchema.parse(req.body);
      const newRate = await storage.createDeliveryRate(rateData);
      res.status(201).json(newRate);
    } catch (error) {
      res.status(400).json({ message: "Invalid delivery rate data", error });
    }
  });

  app.put("/api/delivery-rates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const rateData = insertDeliveryRateSchema.parse(req.body);
      const updatedRate = await storage.updateDeliveryRate(id, rateData);
      if (!updatedRate) {
        return res.status(404).json({ message: "Delivery rate not found" });
      }
      res.json(updatedRate);
    } catch (error) {
      res.status(400).json({ message: "Invalid delivery rate data", error });
    }
  });

  app.delete("/api/delivery-rates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteDeliveryRate(id);
      if (!success) {
        return res.status(404).json({ message: "Delivery rate not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting delivery rate", error });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

export default registerRoutes;
