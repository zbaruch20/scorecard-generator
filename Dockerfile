# ==============================================================================
# Base Stage
# ==============================================================================
# Shared foundation for all targets with Node.js and build dependencies
FROM node:20-alpine AS base

# Install build dependencies for font bundling script
RUN apk add --no-cache bash wget openssl

WORKDIR /app

# Copy package files
COPY package*.json ./

# ==============================================================================
# Development Target
# ==============================================================================
# Used for local development with hot-reload support
# Build with: docker-compose --profile development up --build
FROM base AS development

# Install all dependencies (including devDependencies)
RUN npm install

# Copy source code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ==============================================================================
# Builder Target
# ==============================================================================
# Intermediate stage that builds the production assets
FROM base AS builder

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application (includes font bundling)
RUN npm run build

# ==============================================================================
# Production Target
# ==============================================================================
# Final production image serving static files via nginx
# Build with: docker-compose --profile production up --build
FROM nginx:alpine AS production

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config if needed (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
