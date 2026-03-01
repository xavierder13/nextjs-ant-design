# fms-nextjs/Dockerfile
FROM node:20

# Set working directory
WORKDIR /app

ENV PS1="# "

# Copy package.json and package-lock.json for caching npm install
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Expose Next.js default dev port
EXPOSE 3000

# Start Next.js development server
CMD ["npm", "run", "dev"]