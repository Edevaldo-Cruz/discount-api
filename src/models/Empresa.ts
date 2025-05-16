import { Schema, model } from "mongoose";
import { IEmpresa } from "../interfaces/IEmpresa";

const EmpresaSchema = new Schema<IEmpresa>({
  nome: { type: String, required: true },
  cnpj: { type: String, required: true, unique: true },
  endereco: { type: String, required: true },
  email: { type: String, required: true },
  logo_path: { type: String },
  ativo: { type: Boolean, default: true },
  dataCadastro: { type: Date, default: Date.now },
});

export default model<IEmpresa>("Empresa", EmpresaSchema);
