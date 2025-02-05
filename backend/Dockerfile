# backend/Dockerfile
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Set environment variable for Cloud Run's port (default 8080)
ENV PORT 8080
EXPOSE 8080

# Start the app
CMD ["npm", "start"]