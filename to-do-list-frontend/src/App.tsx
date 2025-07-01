// Arquivo contendo as rotas da aplicação


// Importando os componentes necessários do React Router
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import TasksPage from './components/TasksPage'
import './App.css'

// Componente principal da aplicação
// Define as rotas da aplicação usando React Router
// Cada rota corresponde a um componente específico que será renderizado

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Se a URL for /register, mostre o componente RegisterPage */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Se a URL for /login, mostre o componente LoginPage */}
        <Route path="/login" element={<LoginPage />} />

        {/* Se a URL for /tarefas, mostre o componente TasksPage */}
        <Route path="/tarefas" element={<TasksPage />} />

        {/* 4. Rota padrão: se o usuário acessar '/', ele é redirecionado para o login */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  )
}

export default App