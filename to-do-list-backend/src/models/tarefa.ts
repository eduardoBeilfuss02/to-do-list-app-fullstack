// Arquivo para o modelo de Tarefa
// Este arquivo contém a classe Tarefa que gerencia as tarefas do usuário
// Ela inclui métodos para criar, buscar, atualizar e deletar tarefas, garantindo que as tarefas pertençam ao usuário autenticado

import db from '../config/database';

// Cria a classe Tarefa que representa uma tarefa no sistema
// A classe Tarefa contém propriedades como id, titulo, descricao, prazo, prioridade, status e idUsuario
// A classe também contém métodos estáticos para criar, buscar, atualizar e deletar tarefas
export class Tarefa {
  id: number;
  titulo: string;
  descricao: string | null;
  prazo: Date | null;
  prioridade: string;
  status: 'pendente' | 'concluida';
  idUsuario: number;

  constructor(id: number, titulo: string, descricao: string | null, prazo: Date | null, prioridade: string, status: 'pendente' | 'concluida', idUsuario: number) {
  this.id = id;
  this.titulo = titulo;
  this.descricao = descricao;
  this.prazo = prazo;
  this.prioridade = prioridade;
  this.status = status;
  this.idUsuario = idUsuario;
}

  // --- MÉTODOS ESTÁTICOS ---

  static async create(data: { titulo: string, descricao?: string, prazo?: string, prioridade?: string }, idUsuario: number): Promise<any> {
    const { titulo, descricao, prazo, prioridade } = data;
    const query = `
      INSERT INTO tarefas (titulo, descricao, prazo, prioridade, idUsuario, status) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [titulo, descricao || null, prazo || null, prioridade || 'media', idUsuario, 'pendente'];
    const [result]: any = await db.query(query, values);

    // Retorna os dados da tarefa criada para o controller
    return { id: result.insertId, ...data, status: 'pendente', idUsuario };
  }

  static async findByUser(idUsuario: number): Promise<Tarefa[]> {
    const query = 'SELECT * FROM tarefas WHERE idUsuario = ? ORDER BY id DESC';
    const [tasks] = await db.query(query, [idUsuario]);
    return tasks as Tarefa[];
  }
  
  static async update(id: number, idUsuario: number, data: any): Promise<boolean> {
    const [taskExistente]: any = await db.query('SELECT * FROM tarefas WHERE id = ? AND idUsuario = ?', [id, idUsuario]);
    if (taskExistente.length === 0) return false; // Tarefa não encontrada ou não pertence ao usuário

    const camposParaAtualizar = {
      titulo: data.titulo || taskExistente[0].titulo,
      descricao: data.descricao || taskExistente[0].descricao,
      prazo: data.prazo || taskExistente[0].prazo,
      prioridade: data.prioridade || taskExistente[0].prioridade,
      status: data.status || taskExistente[0].status
    };
    
    const query = `UPDATE tarefas SET titulo = ?, descricao = ?, prazo = ?, prioridade = ?, status = ? WHERE id = ?`;
    const values = [camposParaAtualizar.titulo, camposParaAtualizar.descricao, camposParaAtualizar.prazo, camposParaAtualizar.prioridade, camposParaAtualizar.status, id];
    await db.query(query, values);
    return true;
  }

  static async delete(id: number, idUsuario: number): Promise<boolean> {
    const [result]: any = await db.query('DELETE FROM tarefas WHERE id = ? AND idUsuario = ?', [id, idUsuario]);
    return result.affectedRows > 0; // Retorna true se deletou, false se não encontrou
  }
}