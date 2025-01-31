FROM node:18-alpine

WORKDIR /app

# Copy package files first
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build and start commands
CMD ["npm", "run", "dev"]