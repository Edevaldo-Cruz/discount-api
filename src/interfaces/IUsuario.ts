import { Document, Types } from 'mongoose';

export interface IUsuario extends Document {
  nome: string;
  email: string;
  senha: string;
  empresa: Types.ObjectId;
  ativo: boolean;
  dataCadastro: Date;
  comparePassword(password: string): Promise<boolean>;
}

export interface IUsuarioInput {
  nome: string;
  email: string;
  senha: string;
  empresa: string;
}