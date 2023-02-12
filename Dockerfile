# Use an official Node.js image as the base image
FROM node:19.6.0

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies
RUN npm ci

# Copy the application code to the container
COPY . .

# Build the application
RUN npm run build

# Specify the command to run the application
CMD ["npm", "start"]
