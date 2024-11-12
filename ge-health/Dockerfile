# Use an official Node.js image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json .
RUN npm install

# Copy the rest of the application
COPY . .

# Build the React app
RUN npm run build

# Install `serve` to serve the build directory and expose port 3000
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "build"]
