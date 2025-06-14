# Driveway Camera Image Resizer

A simple Docker-based service that fetches images from URLs and resizes them on-the-fly.

## Features

- Resize images from any accessible URL
- Support for multiple image formats (JPEG, PNG, WebP)
- Configurable dimensions, fit modes, and quality
- Built-in health check endpoint
- Docker and docker-compose ready
- Optimized for performance with Sharp

## Quick Start

### Using Docker Compose (Recommended)

1. Build and start the service:

```bash
docker-compose up -d --build
```

2. Test the service:

```bash
# Health check
curl http://localhost:3000/health

# Resize an image (will use your default URL if no url parameter provided)
curl "http://localhost:3000/resize" --output resized.jpg

# Resize with custom parameters
curl "http://localhost:3000/resize?url=https://example.com/image.jpg&width=300&height=200&fit=cover&format=webp&quality=90" --output resized.webp
```

### Using Docker directly

```bash
# Build the image
docker build -t image-resizer .

# Run the container
docker run -d -p 3000:3000 --name image-resizer image-resizer
```

## API Usage

### Endpoints

#### GET /health

Returns service health status.

#### GET /resize

Resizes an image from a URL.

**Query Parameters:**

- `url` (optional): Image URL to fetch and resize. Defaults to your camera endpoint.
- `width` (optional): Target width in pixels. Default: 500
- `height` (optional): Target height in pixels. Default: 500
- `fit` (optional): How to fit the image. Options: `fill`, `cover`, `contain`, `inside`, `outside`. Default: `fill`
- `format` (optional): Output format. Options: `jpeg`, `png`, `webp`. Default: `jpeg`
- `quality` (optional): Image quality (1-100). Default: 80

**Examples:**

```bash
# Basic resize (uses default camera URL)
http://localhost:3000/resize

# Custom URL and dimensions
http://localhost:3000/resize?url=https://example.com/photo.jpg&width=800&height=600

# Different format and quality
http://localhost:3000/resize?url=https://example.com/photo.jpg&format=webp&quality=95

# Cover fit mode (crops to maintain aspect ratio)
http://localhost:3000/resize?url=https://example.com/photo.jpg&width=400&height=400&fit=cover
```

## Configuration

The service can be configured through environment variables:

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (development/production)

## Monitoring with Portainer

Since you have Portainer installed, you can:

1. Import the docker-compose.yml through Portainer's stack feature
2. Monitor container health and logs
3. Scale the service if needed
4. View resource usage

## Managing the Service

```bash
# View logs
docker-compose logs -f

# Stop the service
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Scale the service (run multiple instances)
docker-compose up -d --scale image-resizer=3
```

## Fit Modes Explained

- `fill`: Resize to exact dimensions, may distort image
- `cover`: Crop image to fill dimensions while maintaining aspect ratio
- `contain`: Fit entire image within dimensions, may add padding
- `inside`: Resize to fit inside dimensions, maintaining aspect ratio
- `outside`: Resize to fit outside dimensions, maintaining aspect ratio

## Troubleshooting

- Check container logs: `docker-compose logs image-resizer`
- Verify health: `curl http://localhost:3000/health`
- Ensure the source URL is accessible from within the Docker network
- For local network URLs (like your camera), make sure they're accessible from the container
