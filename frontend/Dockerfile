FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Verify build output
RUN ls -la /app/dist/ || (echo "Build failed: dist directory not found" && exit 1)
RUN test -f /app/dist/index.html || (echo "Build failed: index.html not found" && exit 1)

FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Verify files were copied
RUN ls -la /usr/share/nginx/html/ || (echo "Files not copied" && exit 1)
RUN test -f /usr/share/nginx/html/index.html || (echo "index.html not found" && exit 1)

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create nginx log directory
RUN mkdir -p /var/log/nginx

# Test nginx config
RUN nginx -t || (echo "Nginx config test failed" && exit 1)

# Expose port (Railway will map this)
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
