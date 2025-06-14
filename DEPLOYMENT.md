# Driveway Camera Resizer - Portainer Deployment Guide

## Overview

This service provides image resizing capabilities for driveway camera images using Sharp library.

## Prerequisites

1. Docker image `image-resizer:latest` has been built successfully
2. Portainer is installed and accessible
3. Docker host has network access to fetch images from external URLs

## Deployment Options

### Option 1: Using Portainer Stacks (Recommended)

1. **Access Portainer**

   - Open your Portainer web interface
   - Navigate to "Stacks" in the left sidebar

2. **Create New Stack**

   - Click "Add stack"
   - Name: `image-resizer`
   - Select "Web editor"

3. **Deploy Stack**
   - Copy the contents of `portainer-stack.yml` into the web editor
   - Click "Deploy the stack"

### Option 2: Using Docker Compose

1. **Upload files to server**

   ```bash
   # Copy docker-compose.yml to your server
   scp docker-compose.yml user@server:/path/to/deployment/
   ```

2. **Deploy using Docker Compose**
   ```bash
   docker-compose up -d
   ```

## Service Configuration

### Ports

- **Internal**: 3000 (container port)
- **External**: 3001 (host port)
- **URL**: `http://YOUR_SERVER_IP:3001`

### Environment Variables

- `NODE_ENV=production`
- `PORT=3000`

### Resource Limits

- **Memory**: 512MB limit, 256MB reservation
- **CPU**: 0.5 cores limit, 0.25 cores reservation

### Security Features

- Runs as non-root user (UID 1001)
- No new privileges escalation
- Custom network isolation

## API Endpoints

### Health Check

```
GET /health
```

Returns: `{"status": "OK", "timestamp": "2024-..."}`

### Image Resize

```
GET /resize?url=IMAGE_URL&width=500&height=500&fit=fill&format=jpeg&quality=80
```

**Parameters:**

- `url`: Image URL to resize (required)
- `width`: Target width in pixels (default: 500)
- `height`: Target height in pixels (default: 500)
- `fit`: Resize fit mode - fill, contain, cover, inside, outside (default: fill)
- `format`: Output format - jpeg, png, webp (default: jpeg)
- `quality`: Image quality 1-100 (default: 80)

**Example:**

```
http://YOUR_SERVER_IP:3001/resize?url=IMAGEURL&width=800&height=600&format=jpeg&quality=90
```

## Monitoring & Logs

### Health Monitoring

The service includes automatic health checks that run every 30 seconds. Portainer will show the service as healthy/unhealthy based on these checks.

### Log Access

- **Via Portainer**: Go to Containers -> image-resizer -> Logs
- **Via Docker**: `docker logs image-resizer`
- **Persistent logs**: Mounted to `/app/logs` volume

### Log Configuration

- Max log file size: 10MB
- Max log files: 3 (rotates automatically)
- Format: JSON structured logging

## Troubleshooting

### Common Issues

1. **Service not starting**

   - Check if port 3001 is already in use
   - Verify Docker image exists: `docker images | grep image-resizer`

2. **Health check failing**

   - Check container logs for startup errors
   - Verify network connectivity within container

3. **Image processing errors**
   - Ensure source URLs are accessible from the container
   - Check memory limits if processing large images

### Useful Commands

```bash
# Check service status
docker ps | grep image-resizer

# View logs
docker logs -f image-resizer

# Restart service
docker restart image-resizer

# Test health endpoint
curl http://localhost:3001/health

# Test image resize
curl "http://localhost:3001/resize?url=https://example.com/image.jpg&width=300&height=300" -o resized.jpg
```

## Security Notes

1. The service runs as a non-root user for security
2. Network isolation through custom Docker network
3. Resource limits prevent resource exhaustion
4. No privilege escalation allowed

## Updating the Service

1. **Build new image**

   ```bash
   docker build -t image-resizer:latest .
   ```

2. **Update via Portainer**

   - Go to Stacks -> image-resizer
   - Click "Editor"
   - Click "Update the stack"

3. **Or via Docker Compose**
   ```bash
   docker-compose down
   docker-compose up -d
   ```

## Performance Tuning

- Adjust memory limits based on expected image sizes
- Increase CPU limits for faster processing
- Monitor resource usage in Portainer dashboard
- Consider adding Redis cache for frequently accessed images
