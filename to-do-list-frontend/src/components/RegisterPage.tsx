// Arquivo para a página de registro da aplicação de lista de tarefas

// Importando as dependências necessárias
// Importando o React, hooks e bibliotecas necessárias
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import styles from './LoginPage.module.css'; 

// Componente funcional para a página de registro
// Este componente renderiza um formulário de registro e lida com o cadastro do usuário
const RegisterPage = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [user, setUser] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validação simples no frontend
    // Verifica se todos os campos estão preenchidos
    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }
    
    // axios é usado para fazer uma requisição POST para o endpoint de registro
    // Se o registro for bem-sucedido, o usuário é redirecionado para a página de login
    try {
      await axios.post('http://localhost:3000/api/auth/register', {
        nome,
        user,
        senha,
      });

      alert('Cadastro realizado com sucesso! Você será redirecionado para a página de login.');
      navigate('/login'); // Redireciona para o login após o sucesso


      // Em caso de erro, exibe uma mensagem de erro
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Ocorreu um erro ao tentar cadastrar.';
      console.error("Erro no cadastro:", errorMessage);
      setError(errorMessage);
    }
  };

  // Renderiza o formulário de registro
  // O formulário inclui campos para nome completo, usuário, senha e confirmação de senha
  return (
    <div className={styles.loginContainer}>
      <div className={styles.formContainer}>
        <h2>Cadastrar</h2>
        <form onSubmit={handleRegister}>
          <div className={styles.inputGroup}>
            <label htmlFor="nome-register">Nome Completo:</label>
            <input id="nome-register" type="text" className={styles.inputField} value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="user-register">Usuário:</label>
            <input id="user-register" type="text" className={styles.inputField} value={user} onChange={(e) => setUser(e.target.value)} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="senha-register">Senha:</label>
            <input id="senha-register" type="password" className={styles.inputField} value={senha} onChange={(e) => setSenha(e.target.value)} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="confirmar-senha-register">Confirmar Senha:</label>
            <input id="confirmar-senha-register" type="password" className={styles.inputField} value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} required />
          </div>
          
          {error && <p className={styles.errorMessage}>{error}</p>}
          
          {/* Botão de envio do formulário */}
          {/* Quando clicado, chama a função handleRegister para processar o registro */}
          <button type="submit" className={styles.submitButton}>Cadastrar</button>
        </form>
        <p style={{ marginTop: '20px' }}>
          Já tem uma conta? <Link to="/login">Faça o login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;