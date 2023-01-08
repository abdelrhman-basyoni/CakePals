FROM node:14-alpine as build

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm install

# Bundle app source
COPY . .

# Build the app
RUN npm run build

# Copy the .env file to the dist folder
COPY .env dist

# Create a production image
FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Install production dependencies
COPY --from=build /usr/src/app/package.json /usr/src/app/package-lock.json ./
RUN npm install --production

# Copy built files
COPY --from=build /usr/src/app/dist ./dist

# Expose the app port
EXPOSE 5000

# Run the app
CMD ["npm", "run", "start:prod"]
