// Middleware para autenticação usando JWT
// Funciona validando o token JWT enviado no cabeçalho Authorization
// Se o token for válido, adiciona as informações do usuário ao objeto de requisição

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Definimos uma interface para a requisição autenticada
// Isso nos permite adicionar informações do usuário ao objeto de requisição
export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    nome: string;
  };
}

// Chave secreta usada para assinar os tokens JWT
// Deve ser mantida em segredo e não deve ser exposta no código fonte
const chaveSecreta = process.env.JWT_SECRET as string; //Importa chave secreta do .env

// autMiddleware é o middleware de autenticação
// Ele verifica se o token JWT está presente no cabeçalho Authorization
export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    res.status(401).json({ error: 'Acesso negado. Nenhum token fornecido.' });
    return; // Usamos um return "vazio" para parar a execução
  }

  const partes = authHeader.split(' ');

  if (partes.length !== 2) {
    res.status(401).json({ error: 'Erro no formato do token.' });
    return;
  }

  const [scheme, token] = partes;

  if (!/^Bearer$/i.test(scheme)) {
    res.status(401).json({ error: 'Token mal formatado.' });
    return;
  }

  jwt.verify(token, chaveSecreta, (err, decoded) => {
    if (err) {
      res.status(403).json({ error: 'Token inválido ou expirado.' });
      return;
    }

    req.user = decoded as { id: number; nome: string; };
    next();
  });
};

