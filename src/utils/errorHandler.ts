import { Request, Response, NextFunction } from "express";

class ErrorHandler extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

const handleErrors = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    success: false,
    error: err.message || "Erro interno no servidor",
  });
};

export { ErrorHandler, handleErrors };
