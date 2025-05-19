import { Request, Response, NextFunction } from "express";
import Usuario from "../models/Usuario";
import { IUsuarioInput, PerfilUsuario } from "../interfaces/IUsuario";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRE } from "../config/env";
import { ErrorHandler } from "../utils/errorHandler";

class UsuarioController {
  // Registrar usuário
 static async registrar(
  req: Request<{}, {}, { nome: string; email: string; senha: string; role?: string; empresa: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { nome, email, senha, role, empresa } = req.body;

    // Mapeia 'role' para 'perfil' (caso esteja usando o campo 'role' no frontend)
    const perfil = role === 'admin' ? PerfilUsuario.ADMIN : PerfilUsuario.USER;

    // Validação do perfil
    if (role && !['admin', 'user'].includes(role)) {
      throw new ErrorHandler('Perfil inválido. Use "admin" ou "user"', 400);
    }

    const usuario = await Usuario.create({
      nome,
      email,
      senha,
      perfil, // Usa o valor mapeado
      empresa,
      ativo: true
    });

    const token = jwt.sign(
      {
        id: usuario._id,
        perfil: usuario.perfil // Garante que o token reflete o valor correto
      },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      success: true,
      token,
      data: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
        empresa: usuario.empresa
      }
    });
  } catch (err) {
    next(err);
  }
}

  // Login
  static async login(
    req: Request<{}, {}, { email: string; senha: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        throw new ErrorHandler("Por favor informe email e senha", 400);
      }

      const usuario = await Usuario.findOne({ email }).select("+senha");

      if (!usuario || !(await usuario.comparePassword(senha))) {
        throw new ErrorHandler("Credenciais inválidas", 401);
      }

      const token = jwt.sign(
        { id: usuario._id },
        JWT_SECRET,
        { expiresIn: 86400 } // 1 dia em segundos
      );

      res.status(200).json({
        success: true,
        token,
      });
    } catch (err) {
      next(err);
    }
  }

  // Obter todos usuários
  static async obterTodos(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const usuarios = await Usuario.find().populate("empresa");
      res.status(200).json({
        success: true,
        count: usuarios.length,
        data: usuarios,
      });
    } catch (err) {
      next(err);
    }
  }
}

export default UsuarioController;
