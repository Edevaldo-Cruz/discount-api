import { Document } from 'mongoose';

export interface IEmpresa extends Document {
  nome: string;
  cnpj: string;
  endereco: string;
  email: string;
  logo_path?: string;
  ativo: boolean;
  dataCadastro: Date;
}