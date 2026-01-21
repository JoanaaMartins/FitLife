FROM node:24
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh
EXPOSE 4000
CMD ["/wait-for-it.sh", "fitlife-mongodb:27017", "--", "node", "app.js"]
