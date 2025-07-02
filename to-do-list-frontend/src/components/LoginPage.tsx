// Arquivo para a página de login da aplicação de lista de tarefas 

// Importando as dependências necessárias 
// Importando o React, hooks e bibliotecas necessárias
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; 
import styles from './LoginPage.module.css';

// Componente funcional para a página de login
// Este componente renderiza um formulário de login e lida com a autenticação do usuário
const LoginPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Verifica se os campos de usuário e senha estão preenchidos
    try {
      const response = await axios.post('https://to-do-list-app-backend-api.onrender.com/api/auth/login', {
        user,
        senha,
      });
      
      // Se o login for bem-sucedido, armazena o token no localStorage e redireciona para a página de tarefas
      // O token é usado para autenticar as requisições subsequentes
      const { token } = response.data;
      localStorage.setItem('authToken', token);
      navigate('/tarefas');
     
      // Em caso de erro, exibe uma mensagem de erro
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Ocorreu um erro. Tente novamente.';
      console.error("Erro no login:", errorMessage);
      setError(errorMessage);
    }
  };
 
  // Renderiza o formulário de login
  // O formulário inclui campos para usuário e senha, e um botão de login 
  return (
    <div className={styles.loginContainer}>
      <div className={styles.formContainer}>
        <h2>Entrar</h2>
        <form onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <label htmlFor="user-login">Usuário:</label>
            <input
              id="user-login" // Campo de entrada para o nome de usuário
              type="text" 
              className={styles.inputField}
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="senha-login">Senha:</label>
            <input
              id="senha-login" // Campo de entrada para a senha
              type="password"
              className={styles.inputField}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          {error && <p className={styles.errorMessage}>{error}</p>}

          {/* Botão de envio do formulário*/}
          <button type="submit" className={styles.submitButton}>Login</button>
        </form>
        
        {/* Link para a página de registro, caso o usuário não tenha uma conta */}
        <p style={{ marginTop: '20px' }}>
          Não tem uma conta? <Link to="/register">Cadastre-se aqui</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;