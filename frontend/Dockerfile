FROM node:alpine

COPY . /frontend
WORKDIR /frontend

RUN npm install --force \
    npm run build

CMD ["npm", "start"]

