# Stage 1: Build the frontend application
FROM node:22-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package.json and package-lock.json (or yarn.lock/pnpm-lock.yaml)
# to leverage Docker cache.
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the rest of the frontend source code
COPY frontend/. .

# Build the frontend application
RUN npm run build

# Stage 2: Build the backend application and serve the frontend
FROM node:22-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm install

COPY backend/. .

# Copy the built frontend static files from the 'frontend-builder' stage
COPY --from=frontend-builder /app/frontend/dist ./public

EXPOSE 8000

CMD ["npm", "start"]