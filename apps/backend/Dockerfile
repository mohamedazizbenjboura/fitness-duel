# Backend Dockerfile for Fitness Duel
# This Dockerfile should be built from the REPO ROOT, not apps/backend
FROM node:18-alpine

WORKDIR /app

# Copy root package files
COPY package*.json ./

# Copy workspace packages
COPY packages/shared/package*.json ./packages/shared/
COPY apps/backend/package*.json ./apps/backend/

# Install dependencies for entire monorepo
RUN npm install

# Copy shared package source and build it
COPY packages/shared ./packages/shared
RUN npm run build --workspace=@fitness-duel/shared

# Copy backend source and build it
COPY apps/backend ./apps/backend
RUN npm run build --workspace=@fitness-duel/backend

# Expose port
EXPOSE 3001

# Start the backend server
WORKDIR /app/apps/backend
CMD ["npm", "start"]
