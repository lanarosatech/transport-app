// db/db.js
const { Client } = require('pg');

// Configuração da conexão com o banco de dados PostgreSQL
const client = new Client({
  host: 'localhost',
  database: 'transport_app',
  user: 'postgres',
  password: 'nova-senha', // Substitua pela sua senha do PostgreSQL
  port: 5432,
});

// Conectar ao banco de dados
client.connect();

// Exportar a conexão para poder ser usada em outros arquivos
module.exports = client;
