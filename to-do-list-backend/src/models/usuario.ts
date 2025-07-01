// Arquivo para o modelo de Usuário
// Este arquivo contém a classe Usuario que gerencia as operações relacionadas ao usuário, como registro e login
// Ele inclui métodos para registrar um novo usuário, autenticar um usuário existente e gerar um token JWT

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/database';

// Cria a classe Usuario que representa um usuário no sistema
// A classe Usuario contém propriedades como id, nome, user, senhaHash e dataCadastro
// A classe também contém métodos estáticos para registrar um novo usuário e autenticar um usuário existente
// O método de registro gera um hash da senha antes de armazená-la no banco de dados
export class Usuario {
  id: number;
  nome: string;
  user: string;
  senhaHash: string;
  dataCadastro: Date;

  constructor(id: number, nome: string, user: string, senhaHash: string, dataCadastro: Date) {
    this.id = id;
    this.nome = nome;
    this.user = user;
    this.senhaHash = senhaHash;
    this.dataCadastro = dataCadastro;
  }

  // --- MÉTODOS ESTÁTICOS (Operações da Classe) ---

  static async register(data: { nome: string, user: string, senha: string }): Promise<void> {
    const { nome, user, senha } = data;
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    const query = 'INSERT INTO usuarios (nome, user, senha) VALUES (?, ?, ?)';
    await db.query(query, [nome, user, hashedPassword]);
  }

  static async login(user: string, senha: string): Promise<string | null> {
    const query = 'SELECT * FROM usuarios WHERE user = ?';
    const [rows]: any = await db.query(query, [user]);

    if (rows.length === 0) {
      return null; // Usuário não encontrado
    }

    const usuarioEncontrado = rows[0];
    const senhaCorreta = await bcrypt.compare(senha, usuarioEncontrado.senha);

    if (!senhaCorreta) {
      return null; // Senha incorreta
    }

    const payload = {
      id: usuarioEncontrado.id,
      nome: usuarioEncontrado.nome
    };
    
    const chaveSecreta = process.env.JWT_SECRET as string; // Importa a chave secreta do .env
    const token = jwt.sign(payload, chaveSecreta, { expiresIn: '1h' });

    return token;
  }
}