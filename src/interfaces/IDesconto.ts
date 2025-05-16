import { Document, Types } from 'mongoose';

export interface IDesconto extends Document {
  titulo: string;
  descricao: string;
  valor: number;
  validade: Date;
  img_path?: string;
  empresa: Types.ObjectId;
  ativo: boolean;
  dataCadastro: Date;
}