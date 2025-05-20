import { Request, Response, NextFunction } from 'express';
import Usuario from '../models/Usuario';
import { IUsuario, PerfilUsuario } from '../interfaces/IUsuario';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';
import { ErrorHandler } from '../utils/errorHandler';

interface AuthRequest extends Request {
  usuario?: IUsuario;
}

class UsuarioController {
  // Registrar usuário
  static async registrar(
    req: Request<{}, {}, { nome: string; email: string; senha: string; perfil?: PerfilUsuario; empresa: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { nome, email, senha, perfil = PerfilUsuario.USER, empresa } = req.body;

      if (perfil && !Object.values(PerfilUsuario).includes(perfil)) {
        throw new ErrorHandler('Perfil inválido', 400);
      }

      const usuario = await Usuario.create({
        nome,
        email,
        senha,
        perfil,
        empresa,
        ativo: true
      });

      const token = jwt.sign(
        { id: usuario._id, perfil: usuario.perfil },
        JWT_SECRET,
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
        throw new ErrorHandler('Por favor informe email e senha', 400);
      }

      const usuario = await Usuario.findOne({ email }).select('+senha');

      if (!usuario || !(await usuario.comparePassword(senha))) {
        throw new ErrorHandler('Credenciais inválidas', 401);
      }

      const token = jwt.sign(
        { id: usuario._id, perfil: usuario.perfil },
        JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.status(200).json({
        success: true,
        token,
        perfil: usuario.perfil
      });
    } catch (err) {
      next(err);
    }
  }

  // Obter todos usuários
  static async obterTodos(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const usuarios = await Usuario.find().populate('empresa');
      res.status(200).json({
        success: true,
        count: usuarios.length,
        data: usuarios
      });
    } catch (err) {
      next(err);
    }
  }
}

export default UsuarioController;