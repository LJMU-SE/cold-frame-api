# Step 1: Create a Dockerfile
# Step 2: Set the base image
FROM node:14

# Step 3: Set the working directory
WORKDIR /app

# Step 4: Copy package.json and package-lock.json
COPY package*.json ./

# Step 5: Install dependencies
RUN npm install

# Step 6: Copy the rest of the application
COPY . .

# Step 7: Expose port
EXPOSE 3000

# Step 8: Set the command to start the application
CMD [ "npm", "start" ]