// Arquivo principal do React para a aplicação de lista de tarefas

// Importando as dependências necessárias
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom' 

// Renderizando o componente App dentro do elemento com id 'root'
// O BrowserRouter é usado para habilitar o roteamento na aplicação
// O React.StrictMode é usado para destacar potenciais problemas na aplicação

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)