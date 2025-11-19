# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependency manifests and install first (prevents copying host node_modules)
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source files
COPY . ./

# Build the app
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy all files needed for runtime (package.json, node_modules, dist)
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
