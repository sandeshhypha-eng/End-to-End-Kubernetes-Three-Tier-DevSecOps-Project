FROM node:20-bullseye

# Install MongoDB client for testing connectivity
RUN apt-get update && \
    apt-get install -y mongodb-clients && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3500
CMD ["node", "index.js"]
