// Arquivo: src/config/database.ts
// Este arquivo configura a conexão com o banco de dados MySQL usando mysql2/promise
// Certifique-se de que o banco de dados MySQL esteja instalado e em execução antes de executar a aplicação

import mysql from 'mysql2/promise';

// Cria a conexão com o banco de dados
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

export default db;