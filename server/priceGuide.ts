
import { Router } from 'express';
import { Client } from '@replit/object-storage';
import multer from 'multer';

const router = Router();

// Initialize storage client with proper error handling
let storage: Client;
try {
  storage = new Client();
} catch (error) {
  console.error('Failed to initialize Replit Object Storage:', error);
  // Fallback - we'll handle this in individual routes
}

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

// Helper function to ensure storage is available
const ensureStorage = () => {
  if (!storage) {
    try {
      storage = new Client();
    } catch (error) {
      throw new Error('Object storage not available');
    }
  }
  return storage;
};

// Get current price guide
router.get('/api/price-guide', async (req, res) => {
  try {
    const storageClient = ensureStorage();
    const { ok, value, error } = await storageClient.downloadAsText('price-guide/metadata.json');
    
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
    const storageClient = ensureStorage();
    const { ok: pdfOk, error: pdfError } = await storageClient.uploadFromBytes(pdfPath, req.file.buffer);
    
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
    const { ok: metaOk, error: metaError } = await storageClient.uploadFromText(
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
    const storageClient = ensureStorage();
    const { ok: metaOk, value: metaValue, error: metaError } = await storageClient.downloadAsText('price-guide/metadata.json');
    
    if (!metaOk) {
      return res.status(404).json({ error: 'Price guide not found' });
    }
    
    const metadata = JSON.parse(metaValue);
    const pdfPath = `price-guide/${metadata.fileName}`;
    
    // Download PDF
    const { ok: pdfOk, value: pdfBuffer, error: pdfError } = await storageClient.downloadAsBytes(pdfPath);
    
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
    const storageClient = ensureStorage();
    const { ok: metaOk, value: metaValue } = await storageClient.downloadAsText('price-guide/metadata.json');
    
    if (metaOk) {
      const metadata = JSON.parse(metaValue);
      const pdfPath = `price-guide/${metadata.fileName}`;
      
      // Delete PDF file
      await storageClient.delete(pdfPath);
    }
    
    // Delete metadata
    await storageClient.delete('price-guide/metadata.json');
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting price guide:', error);
    res.status(500).json({ error: 'Failed to delete price guide' });
  }
});

export default router;
