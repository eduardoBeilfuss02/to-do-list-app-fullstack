// Arquivo contendo as rotas de autenticação
// Este arquivo define as rotas para registro e login de usuários, utilizando o controller de autenticação
// Ele importa as funções do controller e as associa às rotas correspondentes


// Importa o Router do Express para definir as rotas
import { Router } from 'express';
import { register, login } from '../controllers/auth.controller'; // 1. Importe as funções

const authRoutes = Router();

// 2. Usa a função 'register' do controller como o gerenciador da rota
authRoutes.post('/register', register );

// Rota para login
authRoutes.post('/login', login);

export default authRoutes;