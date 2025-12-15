FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8443
CMD ["npx", "ts-node", "src/server.ts"]
