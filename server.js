const express = require('express');
const sharp = require('sharp');
const fetch = require('node-fetch');
const app = express();

// Middleware for JSON parsing
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Image resize endpoint
app.get('/resize', async (req, res) => {
  try {
    // Get parameters from query string
    const {
      url,
      width = 500,
      height = 500,
      fit = 'fill',
      format = 'jpeg',
      quality = 80
    } = req.query;

    // Use default URL if none provided (your example URL)
    const imageUrl = url;

    console.log(`Fetching image from: ${imageUrl}`);
    console.log(`Resizing to: ${width}x${height}, fit: ${fit}, format: ${format}, quality: ${quality}`);

    // Fetch the image
    const response = await fetch(imageUrl, {
      timeout: 10000, // 10 second timeout
      headers: {
        'User-Agent': 'Image-Resizer-Service/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }

    const buffer = await response.buffer();

    // Resize the image
    let sharpInstance = sharp(buffer)
      .resize(parseInt(width), parseInt(height), {
        fit: fit,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      });

    // Apply format and quality
    if (format === 'jpeg') {
      sharpInstance = sharpInstance.jpeg({ quality: parseInt(quality) });
    } else if (format === 'png') {
      sharpInstance = sharpInstance.png({ quality: parseInt(quality) });
    } else if (format === 'webp') {
      sharpInstance = sharpInstance.webp({ quality: parseInt(quality) });
    }

    const resized = await sharpInstance.toBuffer();

    // Set appropriate headers
    res.type(`image/${format}`);
    res.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.send(resized);

  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({
      error: 'Failed to process image',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Image resizer server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Usage: http://localhost:${PORT}/resize?url=IMAGE_URL&width=500&height=500&fit=fill&format=jpeg&quality=80`);
});
