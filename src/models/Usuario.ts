import { Schema, model, Types } from "mongoose";
import { IUsuario, PerfilUsuario } from "../interfaces/IUsuario";
import bcrypt from "bcryptjs";

const UsuarioSchema = new Schema<IUsuario>(
  {
    nome: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, "Nome não pode exceder 100 caracteres"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email inválido",
      ],
    },
    senha: {
      type: String,
      required: true,
      minlength: [8, "Senha deve ter no mínimo 8 caracteres"],
      select: false,
    },
    empresa: {
      type: Schema.Types.ObjectId,
      ref: "Empresa",
      required: true,
    },
    perfil: {
      type: String,
      enum: Object.values(PerfilUsuario),
      required: true,
    },
    ativo: {
      type: Boolean,
      default: true,
    },
    dataCadastro: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  {
    timestamps: true, // Adiciona createdAt e updatedAt automaticamente
    versionKey: false, // Remove o campo __v
  }
);

// Middleware para hash da senha
UsuarioSchema.pre("save", async function (next) {
  if (!this.isModified("senha")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Método para comparar senhas
UsuarioSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.senha);
};

// Método para omitir campos sensíveis no toJSON
UsuarioSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.senha;
  delete obj.__v;
  return obj;
};

// Índices para melhor performance
UsuarioSchema.index({ email: 1 });
UsuarioSchema.index({ empresa: 1 });
UsuarioSchema.index({ perfil: 1 });

export default model<IUsuario>("Usuario", UsuarioSchema);
