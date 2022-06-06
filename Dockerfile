FROM node:16-alpine3.12
WORKDIR /src/app
COPY package*.json ./
RUN npm install 
RUN npm run build
COPY . .
CMD ["node", "./dist/src/index.js"]