# Backend Dockerfile for Fitness Duel
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY ../../packages/shared /app/packages/shared

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Build shared package
WORKDIR /app/packages/shared
RUN npm install && npm run build

# Back to backend
WORKDIR /app

# Expose port
EXPOSE 3001

# Start the server
CMD ["npm", "start"]
