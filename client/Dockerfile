# Client/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies and build the app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production image
FROM node:16-alpine

WORKDIR /app
COPY --from=builder /app ./

# Cloud Run will provide the PORT variable (default 8080)
ENV PORT 8080
EXPOSE 8080

# Start the Next.js server (adjust if you use a custom command)
CMD ["npm", "start"]