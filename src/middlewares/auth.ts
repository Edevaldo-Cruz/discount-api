import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario";
import { JWT_SECRET } from "../config/env";
import { ErrorHandler } from "@utils/errorHandler";
import mongoose from "mongoose";

// Extende o tipo Request para incluir o campo 'usuario'
declare global {
  namespace Express {
    interface Request {
      usuario?: any;
    }
  }
}

// Interface para o payload do token
interface TokenPayload {
  id: string;
  perfil?: string;
  empresa?: string;
}

export const proteger = async (
  req: Request & { usuario?: any },
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    // 1. Obter o token do header
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      throw new ErrorHandler("Token não fornecido", 401);
    }

    // 2. Verificar token
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    // 3. Obter usuário completo do banco
    const usuario = await Usuario.findById(decoded.id).select(
      "+perfil +empresa"
    );

    if (!usuario) {
      throw new ErrorHandler("Usuário não encontrado", 404);
    }

    // 4. Verificar se o usuário está ativo
    if (!usuario.ativo) {
      throw new ErrorHandler("Conta desativada", 401);
    }

    // 5. Adicionar usuário à requisição
    req.usuario = {
      id: usuario._id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil,
      empresa: usuario.empresa,
    };

    next();
  } catch (err) {
    // Tratar erros específicos do JWT
    if (err instanceof jwt.JsonWebTokenError) {
      return next(new ErrorHandler("Token inválido", 401));
    }
    if (err instanceof jwt.TokenExpiredError) {
      return next(new ErrorHandler("Token expirado", 401));
    }
    next(err);
  }
};

export const autorizar = (...perfils: string[]) => {
  return (
    req: Request & { usuario?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      // 1. Verificar se o usuário está autenticado
      if (!req.usuario) {
        throw new ErrorHandler("Autenticação necessária", 401);
      }

      // 2. Verificar se o usuário tem a perfil necessária
      if (!perfils.includes(req.usuario.perfil)) {
        throw new ErrorHandler("Acesso não autorizado", 403);
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

// Middleware para verificar propriedade/associação
export const verificarPropriedade = (
  modelo: string,
  campoId: string = "_id"
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const documento = await mongoose.model(modelo).findById(req.params.id);

      if (!documento) {
        throw new ErrorHandler("Documento não encontrado", 404);
      }

      // Verificar se o usuário é admin ou dono do recurso
      if (
        req.usuario.perfil !== "admin" &&
        documento[campoId]?.toString() !== req.usuario.id
      ) {
        throw new ErrorHandler(
          `Acesso não autorizado a este recurso ${req.usuario.perfil} `,
          403
        );
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
