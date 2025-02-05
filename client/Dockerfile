# Stage 1: Build the Next.js app
FROM node:16-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Build your Next.js app in production mode. This generates the standalone output.
RUN npm run build

# Stage 2: Create the production image
FROM node:16-alpine
WORKDIR /app

# Copy the standalone output from the builder stage
COPY --from=builder /app/.next/standalone ./.next/standalone

# Copy the production node_modules (only those required to run the standalone server)
COPY --from=builder /app/node_modules ./node_modules

# If your Next.js app uses static files (e.g., images, public assets), copy them as well.
COPY --from=builder /app/public ./public

# Set the environment variable for the port. Cloud Run sets PORT automatically,
# but you can provide a default here for local testing.
ENV PORT=8080

# Expose the port so Cloud Run knows which port to route traffic to.
EXPOSE 8080

# Start the standalone Next.js server.
CMD ["node", ".next/standalone/server.js"]
