import { Schema, model, Types } from 'mongoose';
import { IUsuario } from '../interfaces/IUsuario';
import bcrypt from 'bcryptjs';

const UsuarioSchema = new Schema<IUsuario>({
  nome: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  senha: { type: String, required: true, minlength: 6, select: false },
 empresa: { type: Schema.Types.ObjectId, ref: 'Empresa', required: true },
  ativo: { type: Boolean, default: true },
  dataCadastro: { type: Date, default: Date.now }
});

UsuarioSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) return next();
  this.senha = await bcrypt.hash(this.senha, 10);
  next();
});

UsuarioSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.senha);
};

export default model<IUsuario>('Usuario', UsuarioSchema);