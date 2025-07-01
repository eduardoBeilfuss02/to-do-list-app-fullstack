// Arquivo para as rotas de tarefas
// Este arquivo define as rotas relacionadas às tarefas, como criar, buscar, atualizar e deletar tarefas
// Ele importa os controladores necessários e aplica o middleware de autenticação para proteger as rotas

import { Router } from 'express';
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/tarefas.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const tarefasRoutes = Router();


// A rota POST para '/' (que será /api/tasks/) é protegida pelo authMiddleware.
// 1º - O middleware é executado.
// 2º - Se o token for válido, a função createTask é executada.
tarefasRoutes.post('/', authMiddleware, createTask);

// Rotas para as demais operações de tarefas seguem o mesmo padrão:
tarefasRoutes.get('/', authMiddleware, getTasks);
tarefasRoutes.put('/:id', authMiddleware, updateTask);
tarefasRoutes.delete('/:id', authMiddleware, deleteTask);

export default tarefasRoutes;