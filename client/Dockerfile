# Stage 1: Build the Next.js app
FROM node:20-alpine AS builder  
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./

# Copy .env.production so that Next.js can load it at build time
COPY .env.production ./

RUN npm install

# Copy the rest of the application code
COPY . .

# Set the environment to production so Next.js loads .env.production
ENV NODE_ENV=production

# Build your Next.js app in production mode.
RUN npm run build

# Stage 2: Create the production image
FROM node:20-alpine
WORKDIR /app

# Copy all necessary files from the builder stage.
COPY --from=builder /app ./

# Set the port. Cloud Run will override this at runtime if necessary.
ENV PORT=8080
EXPOSE 8080

# Start the Next.js server using next start.
CMD ["npm", "start"]
