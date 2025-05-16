import { Schema, model, Types } from "mongoose";
import { IDesconto } from "../interfaces/IDesconto";

const DescontoSchema = new Schema<IDesconto>({
  titulo: { type: String, required: true },
  descricao: { type: String, required: true },
  valor: { type: Number, required: true },
  validade: { type: Date, required: true },
  img_path: { type: String },
  empresa: { type: Schema.Types.ObjectId, ref: "Empresa", required: true },
  ativo: { type: Boolean, default: true },
  dataCadastro: { type: Date, default: Date.now },
});

export default model<IDesconto>("Desconto", DescontoSchema);
