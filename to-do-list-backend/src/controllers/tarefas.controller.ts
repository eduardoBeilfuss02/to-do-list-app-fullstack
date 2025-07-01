// Arquivo para o controlador de tarefas
// Este arquivo contém as funções para gerenciar tarefas, delegando a lógica para a classe Tarefa
// As funções criam, buscam, atualizam e deletam tarefas, garantindo que as tarefas pertençam ao usuário autenticado

import { Response } from 'express';
import { Tarefa } from '../models/tarefa';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

// As funções abaixo são responsáveis por gerenciar as tarefas do usuário autenticado
// createTask cria uma nova tarefa para o usuário autenticado
export const createTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const idUsuario = req.user!.id;
    const novaTarefa = await Tarefa.create(req.body, idUsuario);
    res.status(201).json(novaTarefa);
  } catch (error) {
    res.status(500).json({ error: 'Ocorreu um erro no servidor ao criar a tarefa.' });
  }
};

// getTasks busca todas as tarefas do usuário autenticado
// Ela garante que as tarefas sejam retornadas apenas para o usuário autenticado
export const getTasks = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const idUsuario = req.user!.id;
    const tasks = await Tarefa.findByUser(idUsuario);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Ocorreu um erro no servidor ao buscar as tarefas.' });
  }
};

// updateTask atualiza uma tarefa específica do usuário autenticado
// Ela verifica se a tarefa pertence ao usuário antes de atualizá-la
export const updateTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const idUsuario = req.user!.id;
    const sucesso = await Tarefa.update(Number(id), idUsuario, req.body);
    if (!sucesso) {
      res.status(404).json({ error: 'Tarefa não encontrada ou não pertence ao usuário.' });
      return;
    }
    res.status(200).json({ message: 'Tarefa atualizada com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Ocorreu um erro no servidor ao atualizar a tarefa.' });
  }
};

// deleteTask deleta uma tarefa específica do usuário autenticado
// Ela verifica se a tarefa pertence ao usuário antes de deletá-la
export const deleteTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const idUsuario = req.user!.id;
    const sucesso = await Tarefa.delete(Number(id), idUsuario);
    if (!sucesso) {
      res.status(404).json({ error: 'Tarefa não encontrada ou não pertence ao usuário.' });
      return;
    }
    res.status(200).json({ message: 'Tarefa deletada com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Ocorreu um erro no servidor ao deletar a tarefa.' });
  }
};