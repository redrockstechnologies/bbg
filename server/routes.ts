
import express, { type Request, Response } from "express";
import { createServer, type Server } from "http";
import { registerVite } from "./vite";
import { db } from "@/server/db";
import * as schema from "@/shared/schema";
import { insertGearItemSchema, insertContactMessageSchema, insertDeliveryRateSchema, insertTestimonialSchema } from "@/shared/schema";
import multer from 'multer';
import { Client } from '@replit/object-storage';

const storage = new Client();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

export function createExpressApp(): Server {
  const app = express();
  app.use(express.json());
  app.use(express.static("public"));

  registerVite(app);

  // Gear Items Routes
  app.get("/api/gear", async (req, res) => {
    try {
      const gearItems = await db.select().from(schema.gearItems);
      res.json(gearItems);
    } catch (error) {
      res.status(500).json({ message: "Error fetching gear items", error });
    }
  });

  app.post("/api/gear", async (req, res) => {
    try {
      const gearItemData = insertGearItemSchema.parse(req.body);
      const newGearItem = await db.insert(schema.gearItems).values(gearItemData).returning();
      res.status(201).json(newGearItem[0]);
    } catch (error) {
      res.status(400).json({ message: "Invalid gear item data", error });
    }
  });

  app.put("/api/gear/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const gearItemData = insertGearItemSchema.parse(req.body);
      const updatedGearItem = await db
        .update(schema.gearItems)
        .set(gearItemData)
        .where(schema.gearItems.id.eq(parseInt(id)))
        .returning();
      
      if (updatedGearItem.length === 0) {
        return res.status(404).json({ message: "Gear item not found" });
      }
      
      res.json(updatedGearItem[0]);
    } catch (error) {
      res.status(400).json({ message: "Invalid gear item data", error });
    }
  });

  app.delete("/api/gear/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deletedGearItem = await db
        .delete(schema.gearItems)
        .where(schema.gearItems.id.eq(parseInt(id)))
        .returning();
      
      if (deletedGearItem.length === 0) {
        return res.status(404).json({ message: "Gear item not found" });
      }
      
      res.json({ message: "Gear item deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting gear item", error });
    }
  });

  // Contact Messages Routes
  app.get("/api/contact", async (req, res) => {
    try {
      const messages = await db.select().from(schema.contactMessages).orderBy(schema.contactMessages.createdAt.desc());
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Error fetching contact messages", error });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactMessageSchema.parse(req.body);
      const newMessage = await db.insert(schema.contactMessages).values(contactData).returning();
      res.status(201).json(newMessage[0]);
    } catch (error) {
      res.status(400).json({ message: "Invalid contact message data", error });
    }
  });

  app.delete("/api/contact/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deletedMessage = await db
        .delete(schema.contactMessages)
        .where(schema.contactMessages.id.eq(parseInt(id)))
        .returning();
      
      if (deletedMessage.length === 0) {
        return res.status(404).json({ message: "Contact message not found" });
      }
      
      res.json({ message: "Contact message deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting contact message", error });
    }
  });

  // Delivery Rates Routes
  app.get("/api/delivery-rates", async (req, res) => {
    try {
      const rates = await db.select().from(schema.deliveryRates);
      res.json(rates);
    } catch (error) {
      res.status(500).json({ message: "Error fetching delivery rates", error });
    }
  });

  app.post("/api/delivery-rates", async (req, res) => {
    try {
      const rateData = insertDeliveryRateSchema.parse(req.body);
      const newRate = await db.insert(schema.deliveryRates).values(rateData).returning();
      res.status(201).json(newRate[0]);
    } catch (error) {
      res.status(400).json({ message: "Invalid delivery rate data", error });
    }
  });

  app.put("/api/delivery-rates/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const rateData = insertDeliveryRateSchema.parse(req.body);
      const updatedRate = await db
        .update(schema.deliveryRates)
        .set(rateData)
        .where(schema.deliveryRates.id.eq(parseInt(id)))
        .returning();
      
      if (updatedRate.length === 0) {
        return res.status(404).json({ message: "Delivery rate not found" });
      }
      
      res.json(updatedRate[0]);
    } catch (error) {
      res.status(400).json({ message: "Invalid delivery rate data", error });
    }
  });

  app.delete("/api/delivery-rates/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deletedRate = await db
        .delete(schema.deliveryRates)
        .where(schema.deliveryRates.id.eq(parseInt(id)))
        .returning();
      
      if (deletedRate.length === 0) {
        return res.status(404).json({ message: "Delivery rate not found" });
      }
      
      res.json({ message: "Delivery rate deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting delivery rate", error });
    }
  });

  // Testimonials Routes
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await db.select().from(schema.testimonials);
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Error fetching testimonials", error });
    }
  });

  app.post("/api/testimonials", async (req, res) => {
    try {
      const testimonialData = insertTestimonialSchema.parse(req.body);
      const newTestimonial = await db.insert(schema.testimonials).values(testimonialData).returning();
      res.status(201).json(newTestimonial[0]);
    } catch (error) {
      res.status(400).json({ message: "Invalid testimonial data", error });
    }
  });

  app.put("/api/testimonials/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const testimonialData = insertTestimonialSchema.parse(req.body);
      const updatedTestimonial = await db
        .update(schema.testimonials)
        .set(testimonialData)
        .where(schema.testimonials.id.eq(parseInt(id)))
        .returning();
      
      if (updatedTestimonial.length === 0) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      
      res.json(updatedTestimonial[0]);
    } catch (error) {
      res.status(400).json({ message: "Invalid testimonial data", error });
    }
  });

  app.delete("/api/testimonials/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deletedTestimonial = await db
        .delete(schema.testimonials)
        .where(schema.testimonials.id.eq(parseInt(id)))
        .returning();
      
      if (deletedTestimonial.length === 0) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      
      res.json({ message: "Testimonial deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting testimonial", error });
    }
  });

  // Price Guide Routes using Object Storage
  app.get('/api/price-guide', async (req, res) => {
    try {
      const { ok, value, error } = await storage.downloadAsText('price-guide/metadata.json');
      
      if (!ok) {
        if (error.message.includes('not found') || error.message.includes('NoSuchKey')) {
          return res.json({ exists: false });
        }
        throw error;
      }
      
      const metadata = JSON.parse(value);
      res.json({ exists: true, ...metadata });
    } catch (error) {
      console.error('Error fetching price guide:', error);
      res.status(500).json({ error: 'Failed to fetch price guide' });
    }
  });

  app.post('/api/price-guide', upload.single('pdf'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No PDF file uploaded' });
      }

      const { title, subtitle } = req.body;
      
      if (!title || !subtitle) {
        return res.status(400).json({ error: 'Title and subtitle are required' });
      }

      const fileName = `price-guide-${Date.now()}.pdf`;
      const pdfPath = `price-guide/${fileName}`;
      
      // Upload PDF file
      const { ok: pdfOk, error: pdfError } = await storage.uploadFromBytes(pdfPath, req.file.buffer);
      
      if (!pdfOk) {
        throw pdfError;
      }
      
      // Create metadata
      const metadata = {
        title,
        subtitle,
        fileName,
        uploadedAt: new Date().toISOString(),
        fileSize: req.file.size,
      };
      
      // Upload metadata
      const { ok: metaOk, error: metaError } = await storage.uploadFromText(
        'price-guide/metadata.json',
        JSON.stringify(metadata, null, 2)
      );
      
      if (!metaOk) {
        throw metaError;
      }
      
      res.json({ success: true, metadata });
    } catch (error) {
      console.error('Error uploading price guide:', error);
      res.status(500).json({ error: 'Failed to upload price guide' });
    }
  });

  app.get('/api/price-guide/download', async (req, res) => {
    try {
      // Get metadata first
      const { ok: metaOk, value: metaValue, error: metaError } = await storage.downloadAsText('price-guide/metadata.json');
      
      if (!metaOk) {
        return res.status(404).json({ error: 'Price guide not found' });
      }
      
      const metadata = JSON.parse(metaValue);
      const pdfPath = `price-guide/${metadata.fileName}`;
      
      // Download PDF
      const { ok: pdfOk, value: pdfBuffer, error: pdfError } = await storage.downloadAsBytes(pdfPath);
      
      if (!pdfOk) {
        throw pdfError;
      }
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${metadata.fileName}"`);
      res.send(Buffer.from(pdfBuffer));
    } catch (error) {
      console.error('Error downloading price guide:', error);
      res.status(500).json({ error: 'Failed to download price guide' });
    }
  });

  app.delete('/api/price-guide', async (req, res) => {
    try {
      // Get metadata first to get the file name
      const { ok: metaOk, value: metaValue } = await storage.downloadAsText('price-guide/metadata.json');
      
      if (metaOk) {
        const metadata = JSON.parse(metaValue);
        const pdfPath = `price-guide/${metadata.fileName}`;
        
        // Delete PDF file
        await storage.delete(pdfPath);
      }
      
      // Delete metadata
      await storage.delete('price-guide/metadata.json');
      
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting price guide:', error);
      res.status(500).json({ error: 'Failed to delete price guide' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
