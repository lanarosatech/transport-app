# Usar imagem base do Node.js
FROM node:16

# Definir o diretório de trabalho no container
WORKDIR /app

# Copiar arquivos de configuração
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o restante do código
COPY . .

# Configurar a porta
ENV PORT=3000

# Expor a porta
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["npm", "start"]
