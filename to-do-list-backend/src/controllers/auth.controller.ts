// Arquivo para o controlador de autenticação
// Este arquivo contém as funções de registro e login, delegando a lógica para a classe Usuario

import { Request, Response } from 'express';
import { Usuario } from '../models/usuario'; // Importamos a classe Usuario que contém a lógica de autenticação

// A classe Usuario deve conter os métodos register e login que lidam com a lógica de autenticação
// A função register deve criar um novo usuário e a função login deve verificar as credenciais do usuário
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    await Usuario.register(req.body); // Delega a lógica para a classe Usuario
    res.status(201).json({ message: 'Usuário criado com sucesso!' });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Nome de usuário já existe.' });
    } else {
      console.error('Erro no servidor:', error);
      res.status(500).json({ error: 'Ocorreu um erro no servidor.' });
    }
  }
};

// A função login verifica as credenciais do usuário e retorna um token se forem válidas
// A classe Usuario deve conter a lógica para verificar as credenciais e gerar o token
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user, senha } = req.body;
    const token = await Usuario.login(user, senha); // Delega a lógica para a classe Usuario

    if (!token) {
      res.status(401).json({ error: 'Usuário ou senha inválidos.' });
      return;
    }

    res.status(200).json({
      message: 'Login bem-sucedido!',
      token: token
    });
  } catch (error) {
    console.error('Erro no servidor:', error);
    res.status(500).json({ error: 'Ocorreu um erro no servidor.' });
  }
};