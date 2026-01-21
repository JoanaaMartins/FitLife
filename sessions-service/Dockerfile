# FROM node:24
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# EXPOSE 3003
# CMD ["npx", "nodemon", "server"] 

FROM node:24

WORKDIR /app

COPY package*.json ./
RUN npm install -g nodemon
RUN npm install

COPY . .

COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

EXPOSE 3003

CMD ["/wait-for-it.sh", "mysql:3306","--","/wait-for-it.sh", "fitlife-rabbitmq:5672", "--timeout=30", "--", "nodemon", "server.js"]

