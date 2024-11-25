# Usar a imagem oficial do Node.js
FROM node:16

# Definir o diretório de trabalho no container
WORKDIR /app

# Copiar arquivos de configuração
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o restante do código
COPY . .

# Expor a porta do servidor
EXPOSE 8080

# Comando para iniciar o servidor
CMD ["npm", "run", "dev"]
