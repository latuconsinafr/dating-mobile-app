# Base image
FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Copy the .env files
COPY .env ./

# Install bash
RUN apk add --no-cache bash

# Copy the wait-for-it script
COPY wait-for-it.sh /usr/src/app/

# Make the script executable
RUN chmod +x /usr/src/app/wait-for-it.sh

# Creates a "dist" folder with the production build
RUN npm run build

# Expose the port on which the app will run
EXPOSE ${PORT}

# Start the server using the production build, wait for db to be available and run migrations
CMD ["bash", "-c", "/usr/src/app/wait-for-it.sh db:${DATABASE_PORT} -- npm run migration:run && npm run seed:run && npm run start:prod"]
