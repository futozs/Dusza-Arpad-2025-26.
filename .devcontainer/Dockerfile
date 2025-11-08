# syntax=docker.io/docker/dockerfile:1

FROM node:20-alpine

# Install dependencies
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy all project files
COPY . .

# Copy environment variables if they exist
COPY .env* ./ 2>/dev/null || true

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start command
CMD npx prisma migrate deploy && npm run start
