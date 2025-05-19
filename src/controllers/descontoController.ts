import { Request, Response, NextFunction } from 'express';
import Desconto from '../models/Desconto';
import { ErrorHandler } from '@utils/errorHandler';

class DescontoController {
  /**
   * @desc    Criar novo desconto
   * @route   POST /descontos
   * @access  Privado (Empresa)
   */
  static async criar(
    req: Request & { usuario?: any },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const novoDesconto = await Desconto.create({
        ...req.body,
        empresa: req.usuario.empresa,
        ativo: true
      });

      res.status(201).json({
        success: true,
        data: novoDesconto
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * @desc    Obter todos os descontos
   * @route   GET /descontos
   * @access  Público
   */
  static async listarTodos(_: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const descontos = await Desconto.find({ ativo: true }).populate('empresa');

      res.status(200).json({
        success: true,
        count: descontos.length,
        data: descontos
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * @desc    Obter desconto por ID
   * @route   GET /descontos/:id
   * @access  Público
   */
  static async obterPorId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const desconto = await Desconto.findById(req.params.id).populate('empresa');

      if (!desconto) {
        return next(new ErrorHandler('Desconto não encontrado', 404));
      }

      res.status(200).json({
        success: true,
        data: desconto
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * @desc    Atualizar desconto
   * @route   PUT /descontos/:id
   * @access  Privado (Empresa)
   */
  static async atualizar(
    req: Request & { usuario?: any },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const desconto = await Desconto.findById(req.params.id);

      if (!desconto) {
        return next(new ErrorHandler('Desconto não encontrado', 404));
      }

      if (desconto.empresa.toString() !== req.usuario.empresa.toString()) {
        return next(new ErrorHandler('Acesso negado à atualização deste desconto', 403));
      }

      const descontoAtualizado = await Desconto.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });

      res.status(200).json({
        success: true,
        data: descontoAtualizado
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * @desc    Deletar (desativar) desconto
   * @route   DELETE /descontos/:id
   * @access  Privado (Empresa)
   */
  static async deletar(
    req: Request & { usuario?: any },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const desconto = await Desconto.findById(req.params.id);

      if (!desconto) {
        return next(new ErrorHandler('Desconto não encontrado', 404));
      }

      if (desconto.empresa.toString() !== req.usuario.empresa.toString()) {
        return next(new ErrorHandler('Acesso negado à exclusão deste desconto', 403));
      }

      desconto.ativo = false;
      await desconto.save();

      res.status(200).json({
        success: true,
        message: 'Desconto desativado com sucesso'
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * @desc    Listar descontos por empresa
   * @route   GET /descontos/empresa/:empresaId
   * @access  Público
   */
  static async listarPorEmpresa(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const descontos = await Desconto.find({
        empresa: req.params.empresaId,
        ativo: true
      }).populate('empresa');

      res.status(200).json({
        success: true,
        count: descontos.length,
        data: descontos
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * @desc    Listar descontos próximos do vencimento (até 7 dias)
   * @route   GET /descontos/proximos-vencimento
   * @access  Público
   */
  static async listarProximosVencimento(
    _: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const hoje = new Date();
      const daquiSeteDias = new Date();
      daquiSeteDias.setDate(hoje.getDate() + 7);

      const descontos = await Desconto.find({
        validade: { $gte: hoje, $lte: daquiSeteDias },
        ativo: true
      }).populate('empresa');

      res.status(200).json({
        success: true,
        count: descontos.length,
        data: descontos
      });
    } catch (err) {
      next(err);
    }
  }
}

export default DescontoController;
