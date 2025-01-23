FROM node:alpine
WORKDIR /frontend
COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm run build
CMD ["npm", "start"]