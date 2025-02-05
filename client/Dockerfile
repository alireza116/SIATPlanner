# Stage 1: Build the Next.js app
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build your Next.js app in production mode
RUN npm run build

# Stage 2: Create the production image
FROM node:20-alpine
WORKDIR /app

# Copy all necessary files from the builder stage
COPY --from=builder /app ./

# Set the environment variable for the port.
ENV PORT=8080
EXPOSE 8080

# Start the Next.js server using next start
CMD ["npm", "start"]
