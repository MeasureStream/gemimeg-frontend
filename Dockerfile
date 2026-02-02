# Multi-stage build for Angular application

# Stage 1: Build the Angular application
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application with increased memory (matching GitLab CI)
ARG API_URL="http://gateway-iam:8080"
ARG BACKEND_URL="http://gemimeg-backend:10001"
ARG GATEWAY_URL="http://gateway-iam:8080"
ARG KAFKA_URL="http://kafka:29092"

ENV VITE_API_URL=$API_URL
ENV VITE_BACKEND_URL=$BACKEND_URL
ENV VITE_GATEWAY_URL=$GATEWAY_URL
ENV VITE_KAFKA_URL=$KAFKA_URL
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build

# Stage 2: Serve the application with nginx
FROM nginx:alpine

# Environment Variables
ENV NGINX_PORT=80
ENV BACKEND_HOST=gemimeg-backend
ENV BACKEND_PORT=10001
ENV GATEWAY_HOST=gateway-iam
ENV GATEWAY_PORT=8080

# Copy built application from build stage
# Copy into a subdirectory that matches the baseHref and Gateway path
COPY --from=build /app/dist/gemimeg-frontend /usr/share/nginx/html/gemimegdcc

# Copy nginx configuration
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port (configurable)
EXPOSE ${NGINX_PORT}

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${NGINX_PORT} || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]


