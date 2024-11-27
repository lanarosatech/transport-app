# Transport App - Instruções de Uso

Este projeto foi desenvolvido com React para o frontend e Node.js com Express para o backend. Abaixo estão as instruções para rodar o projeto localmente e dentro de containers Docker.

## Rodando o projeto com Docker

### 1. Requisitos

- Docker e Docker Compose instalados na sua máquina.
- Node.js e NPM configurados corretamente no ambiente de desenvolvimento.

### 2. Rodando o Backend e Frontend com Docker

Para rodar o projeto completo (frontend e backend) com Docker, siga os passos abaixo:

1. **Construa e inicie os containers Docker**:

   Execute o comando abaixo para iniciar tanto o backend quanto o frontend:

   ```
   docker-compose up --build
   ```

   Este comando irá:
   - Construir e iniciar os containers conforme o arquivo `docker-compose.yml`.
   - Iniciar o backend na porta `8080` e o frontend na porta `80`.

2. **Verifique se o backend e o frontend estão rodando**:

   - O **frontend** estará disponível em: [http://localhost](http://localhost).
   - O **backend** estará disponível dentro do container na URL `http://transport-app-backend:8080`.

### 3. Verificando os Logs

Se precisar verificar os logs de execução, use os seguintes comandos:

- Logs do frontend:
  ```
  docker-compose logs frontend
  ```

- Logs do backend:
  ```
  docker-compose logs backend
  ```

### 4. Corrigindo problemas de comunicação entre containers

Se o frontend não conseguir se comunicar com o backend, verifique se o nome do serviço está correto no arquivo `docker-compose.yml`. O nome correto deve ser usado no `fetch` dentro do código do frontend. A URL correta para o backend no frontend será `http://transport-app-backend:8080`.

## Rodando o Backend e o Frontend localmente (sem Docker)

### Backend:

1. Navegue até a pasta do **backend**:
   ```
   cd transport-app-backend
   ```

2. Execute o comando para iniciar o servidor de desenvolvimento:
   ```
   npm run dev
   ```

   Isso iniciará o servidor na porta `8080`.

### Frontend:

1. Navegue até a pasta do **frontend**:
   ```
   cd transport-app-frontend
   ```

2. Instale as dependências do frontend (caso não tenha feito isso):
   ```
   npm install
   ```

3. Execute o comando para iniciar o frontend:
   ```
   npm start
   ```

   Isso iniciará o servidor na porta `3000`. O frontend será acessível em [http://localhost:3000](http://localhost:3000).

## Scripts Disponíveis

Dentro do diretório do projeto, você pode executar os seguintes comandos:

### `npm start`

Executa o aplicativo em modo de desenvolvimento.\
Abra [http://localhost](http://localhost) para visualizá-lo no navegador.

## Problemas Conhecidos

- **Erro de CORS (Cross-Origin Resource Sharing)**: Se o frontend não conseguir acessar o backend, verifique se o CORS está configurado corretamente. Utilize a URL `http://transport-app-backend:8080` para comunicação entre containers Docker.

- **Problemas de rede entre containers Docker**: Se o frontend não conseguir acessar o backend, certifique-se de que ambos os containers estão rodando na mesma rede do Docker e que o nome do serviço está correto no `docker-compose.yml`.

## Atualizações Recentes

- **Background do Aplicativo**: Adicionada uma imagem de fundo ao body do aplicativo para melhorar o design visual.
- **Front-end nas Rotas**: Implementada navegação entre Home, Histórico de Viagens e Motoristas no front-end, com ajustes de estilo para melhorar a experiência do usuário.
- **Backend - Histórico de Corridas**: Adicionado endpoint para buscar o histórico de corridas, permitindo pesquisa tanto pelo ID do cliente quanto pelo código do motorista.
