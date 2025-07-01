// Arquivo de entrada do servidor Express
// Este arquivo configura o servidor Express, importa as rotas e inicia o servidor na porta especificada
// Ele também configura o middleware para analisar JSON e habilita CORS para permitir requisições de diferentes origens

import dotenv from 'dotenv';
dotenv.config(); // Esta linha carrega as variáveis do .env para a aplicação
import express from 'express';
import authRoutes from './routes/auth.routes'; // 1. Importe as rotas
import tarefasRoutes from './routes/tarefas.routes'; // Importa as rotas de tarefas
import notificacoesRoutes from './routes/notificacoes.routes'; // Importa as rotas de notificações
import cors from 'cors';


// Cria uma instância do servidor Express
// Configura o servidor para usar JSON e habilita CORS
const app = express();
app.use(express.json());
app.use(cors());

// 2. Use as rotas de autenticação com um prefixo
// Todas as rotas dentro de 'authRoutes' agora começarão com '/api/'
app.use('/api/auth', authRoutes);
app.use('/api/tasks', tarefasRoutes);
app.use('/api/notifications', notificacoesRoutes);

// Inicia o servidor na porta especificada
// O servidor escuta na porta 3000 e exibe uma mensagem no console quando está rodando
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

// Rota raiz para verificar se a API está funcionando
// Esta rota responde com uma mensagem simples quando acessada
app.get('/', (req, res) => {
  res.send('A API da To-Do List está no ar!');
});