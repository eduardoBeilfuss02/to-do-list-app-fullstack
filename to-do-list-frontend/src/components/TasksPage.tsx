// Arquivo para a página de tarefas da aplicação de lista de tarefas
// Este componente renderiza a página principal onde as tarefas são gerenciadas

// Importando as dependências necessárias
// Importa o React, hooks e bibliotecas necessárias
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import styles from './TasksPage.module.css';


// --- INTERFACES ---
// Define as interfaces para as tarefas, token decodificado e notificações
// Essas interfaces ajudam a tipar os dados que serão usados no componente
interface Task {
  id: number;
  titulo: string;
  descricao: string | null;
  status: 'pendente' | 'concluida';
  prazo: string | null;
}

interface DecodedToken {
  id: number;
  nome: string;
}

interface Notification {
  id: number;
  mensagem: string;
}

// Componente funcional para a página de tarefas
// Este componente renderiza a página principal onde as tarefas são gerenciadas
const TasksPage = () => {
  // --- ESTADOS DO COMPONENTE ---
  // Define os estados necessários para gerenciar as tarefas, notificações e outros dados
  // Utiliza o hook useState para criar estados reativos
  // Cada estado é inicializado com um valor padrão
  // Exemplo: tasks é um array de tarefas, newTodoTitle é uma string para o título da nova tarefa, etc.
  // O estado loading é usado para indicar se os dados estão sendo carregados
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [newTodoPrazo, setNewTodoPrazo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskData, setEditingTaskData] = useState<{ titulo: string; descricao: string; prazo: string }>({ titulo: '', descricao: '', prazo: '' });
  const [userName, setUserName] = useState<string>('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // --- EFEITO PARA BUSCAR DADOS INICIAIS ---
  // O useEffect é usado para buscar os dados iniciais quando o componente é montado
  // Faz uma requisição para obter as tarefas e notificações do usuário autenticado
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('Nenhum token de autenticação encontrado. Por favor, faça o login.');
          setLoading(false);
          return;
        }

        // Decodifica o token JWT para obter o nome do usuário
        // Utiliza a biblioteca jwt-decode para decodificar o token e extrair informações
        const decodedToken = jwtDecode<DecodedToken>(token);
        setUserName(decodedToken.nome);

        // Faz requisições paralelas para obter as tarefas e notificações
        // Utiliza o axios para fazer as requisições HTTP
        // As requisições são feitas para o backend da aplicação, que deve estar rodando na porta 3000
        // As respostas são armazenadas nos estados tasks e notifications
        const apiHeaders = { headers: { Authorization: `Bearer ${token}` } };
        const tasksRequest = axios.get('https://to-do-list-app-backend-api.onrender.com/api/tasks', apiHeaders);
        const notificationsRequest = axios.get('https://to-do-list-app-backend-api.onrender.com/api/notifications', apiHeaders);

        const [tasksResponse, notificationsResponse] = await Promise.all([tasksRequest, notificationsRequest]);

        setTasks(tasksResponse.data);
        setNotifications(notificationsResponse.data);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError('Não foi possível carregar os dados.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- FUNÇÕES DE MANIPULAÇÃO DE TAREFAS (HANDLERS) ---
  // Essas funções são responsáveis por manipular as tarefas, como criar, deletar, editar e alterar o status
  // Cada função é chamada em resposta a eventos, como cliques de botões ou envios de formulários
  // As funções utilizam o axios para fazer requisições HTTP ao backend da aplicação

  // Função para criar uma nova tarefa
  // É chamada quando o formulário de criação de tarefa é enviado
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        'https://to-do-list-app-backend-api.onrender.com/api/tasks',
        {
          titulo: newTodoTitle,
          descricao: newTodoDescription,
          prazo: newTodoPrazo || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks([response.data, ...tasks]);
      setNewTodoTitle('');
      setNewTodoDescription('');
      setNewTodoPrazo('');
    } catch (err) {
      setError('Não foi possível criar a tarefa.');
    }
  };

  // Função para deletar uma tarefa
  // É chamada quando o usuário clica no botão de deletar uma tarefa
  const handleDeleteTask = async (id: number) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`https://to-do-list-app-backend-api.onrender.com/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.filter(task => task.id !== id));
      setSelectedTask(null);
      setIsEditing(false);
    } catch (err) {
      setError('Não foi possível deletar a tarefa.');
    }
  };

  // Função para alternar o status de uma tarefa
  // É chamada quando o usuário clica no botão para marcar uma tarefa como concluída ou reabri-la
  // Altera o status da tarefa entre 'pendente' e 'concluida
  const handleToggleStatus = async (taskToUpdate: Task) => {
    const newStatus: Task["status"] = taskToUpdate.status === 'pendente' ? 'concluida' : 'pendente';
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(
        `https://to-do-list-app-backend-api.onrender.com/api/tasks/${taskToUpdate.id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedTask: Task = { ...taskToUpdate, status: newStatus };
      setTasks(tasks.map(task => task.id === taskToUpdate.id ? updatedTask : task));
      setSelectedTask(updatedTask);
    } catch (err) {
      setError('Não foi possível alterar o status da tarefa.');
    }
  };

  // Função para iniciar a edição de uma tarefa
  // É chamada quando o usuário clica no botão de editar uma tarefa
  // Preenche os campos de edição com os dados da tarefa selecionada
  // Define o estado isEditing como true para mostrar os campos de edição
  const handleStartEditing = (task: Task) => {
    setIsEditing(true);
    setEditingTaskData({
      titulo: task.titulo,
      descricao: task.descricao || '',
      prazo: task.prazo ? task.prazo.split('T')[0] : ''
    });
  };

  // Função para cancelar a edição de uma tarefa
  // É chamada quando o usuário clica no botão de cancelar edição
  const handleCancelEditing = () => {
    setIsEditing(false);
  };

  // Função para salvar as alterações feitas em uma tarefa
  // É chamada quando o usuário clica no botão de salvar alterações
  const handleSaveChanges = async () => {
    if (!selectedTask) return;
    try {
      const token = localStorage.getItem('authToken');
      const dataToUpdate = {
        titulo: editingTaskData.titulo,
        descricao: editingTaskData.descricao,
        prazo: editingTaskData.prazo || null
      };
      await axios.put(
        `https://to-do-list-app-backend-api.onrender.com/api/tasks/${selectedTask.id}`, // Atualiza a tarefa com os novos dados
        dataToUpdate,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedTask = { ...selectedTask, ...dataToUpdate };
      setTasks(tasks.map(t => (t.id === selectedTask.id ? updatedTask : t)));
      setSelectedTask(updatedTask);
      setIsEditing(false);
    } catch (err) {
      setError('Não foi possível salvar as alterações.');
    }
  };

  // --- FUNÇÃO PARA MARCAR NOTIFICAÇÃO COMO LIDA ---
  // Esta função é chamada quando o usuário clica em uma notificação para marcá-la como lida
  // Faz uma requisição PATCH para o backend para atualizar o status da notificação
  // Remove a notificação da lista de notificações após marcá-la como lida
  const handleMarkNotificationAsRead = async (notificationId: number) => {
    try {
        const token = localStorage.getItem('authToken');
        await axios.patch(`https://to-do-list-app-backend-api.onrender.com/api/notifications/${notificationId}/read`, 
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotifications(notifications.filter(notif => notif.id !== notificationId));
    } catch (err) {
        console.error("Erro ao marcar notificação como lida:", err);
    }
  };


  // --- RENDERIZAÇÃO DO COMPONENTE ---
  // Renderiza o componente TasksPage
  // Exibe o cabeçalho com o nome do usuário e o ícone de notificações
  if (loading) return <p>Carregando...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  // Renderiza a lista de tarefas e os detalhes da tarefa selecionada
  // O cabeçalho exibe o nome do usuário e um ícone de notificação
  // O formulário de criação de tarefa permite adicionar novas tarefas
  // A lista de tarefas exibe as tarefas pendentes e concluídas
  // A seção de detalhes da tarefa exibe as informações da tarefa selecionada e permite editar ou deletar a tarefa
  // O ícone de notificação exibe um badge se houver notificações não lidas
  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1>Olá, {userName}! Estas são suas tarefas.</h1>
        <div className={styles.notificationBell} onClick={() => setIsNotificationOpen(!isNotificationOpen)}>
          <span>🔔</span>
          {notifications.length > 0 && <div className={styles.notificationBadge}></div>}
          {isNotificationOpen && (
            <div className={styles.notificationDropdown}>
              {notifications.length > 0 ? (
                notifications.map(notif => (
                  <div 
                    key={notif.id} 
                    className={styles.notificationItem} 
                    onClick={() => handleMarkNotificationAsRead(notif.id)}
                  >
                    {notif.mensagem}
                  </div>
                ))
              ) : (
                <div className={styles.noNotifications}>Nenhuma notificação nova.</div>
              )}
            </div>
          )}
        </div>
      </header>
      <main className={styles.mainContent}>
        <div className={styles.leftPanel}>
          <form onSubmit={handleCreateTask} className={styles.addTaskForm}>
            <input type="text" value={newTodoTitle} onChange={(e) => setNewTodoTitle(e.target.value)} placeholder="Título da nova tarefa..." className={styles.taskInput} required />
            <textarea value={newTodoDescription} onChange={(e) => setNewTodoDescription(e.target.value)} placeholder="Descrição (opcional)..." className={styles.taskTextarea} />
            <input type="date" value={newTodoPrazo} onChange={(e) => setNewTodoPrazo(e.target.value)} className={styles.taskInput} />
            <button type="submit" className={styles.addButton}>Adicionar +</button>
          </form>
          <ul className={styles.taskList}>
            {tasks.map(task => (
              <li key={task.id} className={`${styles.taskItem} ${selectedTask?.id === task.id ? styles.taskItemSelected : ''}`} onClick={() => { setSelectedTask(task); handleCancelEditing(); }}>
                <span className={task.status === 'concluida' ? styles.taskTitleCompleted : ''}>{task.titulo}</span>
                {task.status === 'concluida' && ' ✅'}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.rightPanel}>
          {selectedTask ? (
            <div className={styles.taskDetails}>
              {isEditing ? (
                <>
                  <input type="text" value={editingTaskData.titulo} onChange={(e) => setEditingTaskData({ ...editingTaskData, titulo: e.target.value })} className={styles.editInput} />
                  <textarea value={editingTaskData.descricao} onChange={(e) => setEditingTaskData({ ...editingTaskData, descricao: e.target.value })} className={styles.editInput} rows={5}/>
                  <input type="date" value={editingTaskData.prazo} onChange={(e) => setEditingTaskData({ ...editingTaskData, prazo: e.target.value })} className={styles.editInput}/>
                  <div className={styles.actionButtons}><button onClick={handleSaveChanges}>Salvar</button><button onClick={handleCancelEditing}>Cancelar</button></div>
                </>
              ) : (
                <>
                  <h2>{selectedTask.titulo}</h2>
                  <p>{selectedTask.descricao || 'Esta tarefa não tem descrição.'}</p>
                  <p><strong>Status:</strong> {selectedTask.status}</p>
                  {selectedTask.prazo && (<p><strong>Prazo:</strong> {new Date(selectedTask.prazo).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>)}
                  <div className={styles.actionButtons}>
                    <button onClick={() => handleStartEditing(selectedTask)}>Editar</button>
                    <button onClick={() => handleToggleStatus(selectedTask)}>{selectedTask.status === 'pendente' ? 'Marcar como Concluída' : 'Reabrir Tarefa'}</button>
                    <button onClick={() => handleDeleteTask(selectedTask.id)} className={styles.deleteButton}>Deletar</button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <p className={styles.placeholder}>Selecione uma tarefa para ver os detalhes</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default TasksPage;