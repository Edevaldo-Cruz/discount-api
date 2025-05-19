import { Request, Response, NextFunction } from 'express';
import Empresa from '../models/Empresa';
import { ErrorHandler } from '@utils/errorHandler';

class EmpresaController {
  /**
   * @desc    Criar nova empresa
   * @route   POST /empresas
   * @access  Privado (Admin)
   */
  static async criarEmpresa(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Verificar se CNPJ já existe
      const empresaExistente = await Empresa.findOne({ cnpj: req.body.cnpj });
      if (empresaExistente) {
        throw new ErrorHandler('CNPJ já cadastrado', 400);
      }

      const empresa = await Empresa.create(req.body);

      res.status(201).json({
        success: true,
        data: empresa
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * @desc    Obter todas empresas
   * @route   GET /empresas
   * @access  Público
   */
  static async obterTodasEmpresas(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Filtros avançados
      const query = Empresa.find({ ativo: true });

      // Executa a query
      const empresas = await query;

      res.status(200).json({
        success: true,
        count: empresas.length,
        data: empresas
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * @desc    Obter empresa específica
   * @route   GET /empresas/:id
   * @access  Público
   */
  static async obterEmpresa(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const empresa = await Empresa.findById(req.params.id);

      if (!empresa) {
        return next(new ErrorHandler('Empresa não encontrada', 404));
      }

      res.status(200).json({
        success: true,
        data: empresa
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * @desc    Atualizar empresa
   * @route   PUT /empresas/:id
   * @access  Privado (Admin ou Empresa dona)
   */
  static async atualizarEmpresa(
    req: Request & { usuario?: any },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      let empresa = await Empresa.findById(req.params.id);

      if (!empresa) {
        return next(new ErrorHandler('Empresa não encontrada', 404));
      }

      // Verifica se é admin ou empresa dona
      if (req.usuario.role !== 'admin' && empresa.id.toString() !== req.usuario.empresa.toString()) {
        return next(new ErrorHandler('Não autorizado para atualizar esta empresa', 403));
      }

      // Não permite alterar CNPJ
      if (req.body.cnpj && req.body.cnpj !== empresa.cnpj) {
        return next(new ErrorHandler('CNPJ não pode ser alterado', 400));
      }

      empresa = await Empresa.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });

      res.status(200).json({
        success: true,
        data: empresa
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * @desc    Desativar empresa
   * @route   DELETE /empresas/:id
   * @access  Privado (Admin)
   */
  static async desativarEmpresa(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const empresa = await Empresa.findById(req.params.id);

      if (!empresa) {
        return next(new ErrorHandler('Empresa não encontrada', 404));
      }

      // Marca como inativo em vez de deletar
      await Empresa.findByIdAndUpdate(req.params.id, { ativo: false });

      res.status(200).json({
        success: true,
        data: {}
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * @desc    Obter estatísticas das empresas
   * @route   GET /empresas/estatisticas
   * @access  Privado (Admin)
   */
  static async obterEstatisticas(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const estatisticas = await Empresa.aggregate([
        {
          $match: { ativo: true }
        },
        {
          $group: {
            _id: null,
            totalEmpresas: { $sum: 1 },
            empresasCadastradasUltimoMes: {
              $sum: {
                $cond: [
                  { $gte: ["$dataCadastro", new Date(new Date().setMonth(new Date().getMonth() - 1))] },
                  1,
                  0
                ]
              }
            }
          }
        }
      ]);

      res.status(200).json({
        success: true,
        data: estatisticas[0] || { totalEmpresas: 0, empresasCadastradasUltimoMes: 0 }
      });
    } catch (err) {
      next(err);
    }
  }
}

export default EmpresaController;