# Usa a imagem oficial do Node.js
FROM node:20

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os ficheiros de configuração do Node.js
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o resto do código da aplicação
COPY . .

# Expõe a porta da aplicação (definida via .env no docker-compose)
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
