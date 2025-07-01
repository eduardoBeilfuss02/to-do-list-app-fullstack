// Arquivo para o modelo de Notificação
// Este arquivo contém a classe Notificacao que gerencia as notificações do usuário
// Ele inclui métodos para gerar notificações baseadas em tarefas, buscar notificações não lidas e marcar notificações como lidas

import db from '../config/database';

// Cria a classe Notificacao que representa uma notificação no sistema
// A classe Notificacao contém propriedades como id, idUsuario, idTarefa, mensagem, dataEnvio e lida
export class Notificacao {
  id: number;
  idUsuario: number;
  idTarefa: number;
  mensagem: string;
  dataEnvio: Date;
  lida: boolean;

  constructor(id: number, idUsuario: number, idTarefa: number, mensagem: string, dataEnvio: Date, lida: boolean) {
    this.id = id;
    this.idUsuario = idUsuario;
    this.idTarefa = idTarefa;
    this.mensagem = mensagem;
    this.dataEnvio = dataEnvio;
    this.lida = lida;
  }

  // --- MÉTODOS ESTÁTICOS ---

  /**
   * Analisa as tarefas de um usuário e cria notificações para as que estão atrasadas ou vencem hoje.
   * Só cria a notificação se uma igual já não existir.
   */
  
  static async generateForUser(idUsuario: number): Promise<void> {
    const [tasks]: any = await db.query(
      'SELECT id, titulo, prazo FROM tarefas WHERE idUsuario = ? AND status = ? AND prazo IS NOT NULL',
      [idUsuario, 'pendente']
    );

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    for (const task of tasks) {
      const prazo = new Date(task.prazo);
      let mensagem = '';

      if (prazo < hoje) {
        mensagem = `A sua tarefa "${task.titulo}" está atrasada!`;
      } else if (prazo.getTime() === hoje.getTime()) {
        mensagem = `A sua tarefa "${task.titulo}" vence hoje!`;
      }

      if (mensagem) {
        const [existing]: any = await db.query('SELECT id FROM notificacoes WHERE idTarefa = ?', [task.id]);
        if (existing.length === 0) {
          await db.query(
            'INSERT INTO notificacoes (idUsuario, idTarefa, mensagem) VALUES (?, ?, ?)',
            [idUsuario, task.id, mensagem]
          );
        }
      }
    }
  }

  /**
   * Busca todas as notificações não lidas de um usuário.
   */
  static async findUnreadByUser(idUsuario: number): Promise<Notificacao[]> {
    const [notifications] = await db.query(
      'SELECT * FROM notificacoes WHERE idUsuario = ? AND lida = FALSE ORDER BY dataEnvio DESC',
      [idUsuario]
    );
    return notifications as Notificacao[];
  }

  /**
   * Marca uma notificação específica como lida.
   */
  static async markAsRead(idNotificacao: number, idUsuario: number): Promise<boolean> {
    const [result]: any = await db.query(
      'UPDATE notificacoes SET lida = TRUE WHERE id = ? AND idUsuario = ?',
      [idNotificacao, idUsuario]
    );
    return result.affectedRows > 0;
  }
}