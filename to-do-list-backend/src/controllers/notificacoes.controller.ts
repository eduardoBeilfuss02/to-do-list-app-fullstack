// Arquivo para o controlador de notificações
// Este arquivo contém as funções para gerenciar notificações, delegando a lógica para a classe Notificacao

import { Response } from 'express';
import { Notificacao } from '../models/notificacao'; // Importamos a classe
import { AuthenticatedRequest } from '../middleware/auth.middleware';


// getNotifications busca as notificações do usuário autenticado
// Ela garante que as notificações sejam geradas ou atualizadas antes de retornar as não lidas
export const getNotifications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const idUsuario = req.user!.id;
  try {
    // 1. Garante que as notificações sejam geradas ou atualizadas
    await Notificacao.generateForUser(idUsuario);
    
    // 2. Busca e retorna apenas as não lidas
    const notifications = await Notificacao.findUnreadByUser(idUsuario);
    
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Erro ao processar notificações:", error);
    res.status(500).json({ error: 'Ocorreu um erro no servidor ao processar as notificações.' });
  }
};

// A função markAsRead marca uma notificação específica como lida
// Ela verifica se a notificação pertence ao usuário autenticado antes de marcá-la como lida
export const markAsRead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const idUsuario = req.user!.id;
  const { id: idNotificacao } = req.params;
  try {
    const sucesso = await Notificacao.markAsRead(Number(idNotificacao), idUsuario);
    if (!sucesso) {
      res.status(404).json({ error: 'Notificação não encontrada ou não pertence ao usuário.' });
      return;
    }
    res.status(200).json({ message: 'Notificação marcada como lida.' });
  } catch (error) {
    console.error("Erro ao marcar notificação como lida:", error);
    res.status(500).json({ error: 'Ocorreu um erro no servidor.' });
  }
};