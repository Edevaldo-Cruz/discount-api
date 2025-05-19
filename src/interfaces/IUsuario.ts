// src/interfaces/IUsuario.ts
import { Document, Types } from 'mongoose';

export enum PerfilUsuario {
  ADMIN = 'admin',
  USER = 'user'
}

export interface IUsuario extends Document {
  nome: string;
  email: string;
  senha: string;
  empresa: Types.ObjectId;
  perfil: PerfilUsuario;
  ativo: boolean;
  dataCadastro: Date;
  comparePassword(password: string): Promise<boolean>;
}

export interface IUsuarioInput {
  nome: string;
  email: string;
  senha: string;
  empresa: string;
  perfil?: PerfilUsuario;
}