# Use an official Node.js runtime as a parent image
FROM node:22-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Install pm2 globally
RUN npm install pm2 -g

# Expose the port the app runs on
EXPOSE 80

# Command to start the application using pm2
CMD ["pm2-runtime", "npm", "--", "run", "preview", "--", "--host", "0.0.0.0", "--port", "80"]
