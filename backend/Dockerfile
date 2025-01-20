FROM node:16-alpine
WORKDIR /backend
COPY package*.json ./
RUN npm install --force
COPY . .
CMD ["node", "index.js"]
