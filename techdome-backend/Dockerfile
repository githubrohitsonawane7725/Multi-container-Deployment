#Official Node.js image
FROM node:16-alpine


# Working directory  
WORKDIR /app


# Copy the package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the backend application
COPY . .


# Start the application
CMD ["npm", "start"]

# Expose the backend port
EXPOSE 5000