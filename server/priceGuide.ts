
import { Router } from 'express';
import { Client } from '@replit/object-storage';
import multer from 'multer';

const router = Router();
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

// Get current price guide
router.get('/api/price-guide', async (req, res) => {
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

// Upload new price guide
router.post('/api/price-guide', upload.single('pdf'), async (req, res) => {
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

// Download price guide PDF
router.get('/api/price-guide/download', async (req, res) => {
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

// Delete price guide
router.delete('/api/price-guide', async (req, res) => {
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

export default router;
