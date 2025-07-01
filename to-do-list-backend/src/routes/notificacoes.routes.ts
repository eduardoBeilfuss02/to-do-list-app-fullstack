// Arquivo para as rotas de notificações
// Este arquivo define as rotas relacionadas às notificações, como obter notificações e marcar notificações como lidas

// Ele importa os controladores necessários e aplica o middleware de autenticação para proteger as rotas
import { Router } from 'express';
import { getNotifications, markAsRead } from '../controllers/notificacoes.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const notificacoesRoutes = Router();

// A rota GET para '/' (que será /api/notifications) é protegida pelo middleware
// A proteção significa que apenas usuários autenticados podem acessar essa rota
// Ela chama a função getNotifications do controller para buscar as notificações do usuário autenticado
notificacoesRoutes.get('/', authMiddleware, getNotifications);

// A rota PATCH para marcar notificações como lidas é protegida pelo middleware
// A proteção significa que apenas usuários autenticados podem acessar essa rota
// Ela chama a função markAsRead do controller para marcar uma notificação específica como lida
notificacoesRoutes.patch('/:id/read', authMiddleware, markAsRead);

export default notificacoesRoutes;