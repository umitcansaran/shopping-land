FROM node:16-alpine
WORKDIR /backend
COPY package*.json ./
RUN npm install --force
COPY . .
EXPOSE 8000
CMD ["node", "index.js"]
