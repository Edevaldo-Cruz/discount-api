import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario';
import { JWT_SECRET } from '../config/env';
import { ErrorHandler } from '@utils/errorHandler';

export const proteger = async (
  req: Request & { usuario?: any },
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ErrorHandler('Não autorizado', 401);
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const usuario = await Usuario.findById(decoded.id);

    if (!usuario) {
      throw new ErrorHandler('Usuário não encontrado', 404);
    }

    req.usuario = usuario;
    next();
  } catch (err) {
    next(err);
  }
};

export const autorizar = (...roles: string[]) => {
  return (req: Request & { usuario?: any }, res: Response, next: NextFunction) => {
    if (!roles.includes(req.usuario.role)) {
      return next(
        new ErrorHandler('Não autorizado para esta ação', 403)
      );
    }
    next();
  };
};