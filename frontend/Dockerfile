FROM node:alpine

COPY . /frontend
WORKDIR /frontend

RUN npm install --legacy-peer-deps \
    npm run build

CMD ["npm", "start"]

