# FROM node:24
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# EXPOSE 3002
# CMD ["npx", "nodemon", "server"]

FROM node:24

WORKDIR /app

COPY package*.json ./
RUN npm install -g nodemon
RUN npm install

COPY . .

COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

EXPOSE 3002

CMD ["/wait-for-it.sh", "fitlife-mysql:3306", "--", "nodemon", "server.js"]


