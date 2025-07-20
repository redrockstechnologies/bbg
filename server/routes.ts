import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { emailService } from "./emailService";
import { insertUserSchema, insertGearItemSchema, insertTestimonialSchema, insertContactMessageSchema, insertDeliveryRateSchema, insertPriceGuideSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api

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
      console.log("Received contact form data:", req.body);
      
      const messageData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        arrivalDate: req.body.arrivalDate || null,
        departureDate: req.body.departureDate || null,
        message: req.body.message,
        enquiryItems: req.body.enquiryItems || null,
        createdAt: new Date().toISOString(),
        archived: false
      };
      
      console.log("Formatted message data:", messageData);
      
      const parsed = insertContactMessageSchema.parse(messageData);
      const message = await storage.createContactMessage(parsed);
      
      // Send email notification
      try {
        await emailService.sendContactNotification({
          name: messageData.name,
          email: messageData.email,
          phone: messageData.phone,
          message: messageData.message,
          arrivalDate: messageData.arrivalDate || undefined,
          departureDate: messageData.departureDate || undefined,
          enquiryItems: messageData.enquiryItems || undefined
        });
        console.log("Email notification sent successfully");
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
        // Don't fail the request if email fails
      }
      
      console.log("Contact message created successfully:", message);
      res.status(201).json(message);
    } catch (error) {
      console.error("Error creating contact message:", error);
      if (error instanceof z.ZodError) {
        console.error("Validation errors:", error.errors);
        res.status(400).json({ error: "Validation failed", details: error.errors });
      } else {
        console.error("Server error:", error);
        res.status(500).json({ error: "Failed to create contact message", details: error.message });
      }
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

  // Price guide routes
  app.get("/api/price-guide", async (req, res) => {
    try {
      const priceGuide = await storage.getPriceGuide();
      res.json(priceGuide);
    } catch (error) {
      res.status(500).json({ message: "Error fetching price guide", error });
    }
  });

  app.post("/api/price-guide", async (req, res) => {
    try {
      const priceGuideData = insertPriceGuideSchema.parse(req.body);
      const newPriceGuide = await storage.createOrUpdatePriceGuide(priceGuideData);
      res.status(201).json(newPriceGuide);
    } catch (error) {
      res.status(400).json({ message: "Invalid price guide data", error });
    }
  });

  app.put("/api/price-guide", async (req, res) => {
    try {
      const priceGuideData = insertPriceGuideSchema.parse(req.body);
      const updatedPriceGuide = await storage.createOrUpdatePriceGuide(priceGuideData);
      res.json(updatedPriceGuide);
    } catch (error) {
      res.status(400).json({ message: "Invalid price guide data", error });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}