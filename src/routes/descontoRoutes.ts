import { Router } from 'express';
import DescontoController from '../controllers/descontoController';
import { proteger } from '../middlewares/auth';

const router = Router();

router
  .route('/')
  .get(DescontoController.listarTodos)
  .post(proteger, DescontoController.criar);

router.get('/proximos-vencimento', DescontoController.listarProximosVencimento);
router.get('/empresa/:empresaId', DescontoController.listarPorEmpresa);

router
  .route('/:id')
  .get(DescontoController.obterPorId)
  .put(proteger, DescontoController.atualizar)
  .delete(proteger, DescontoController.deletar);

export default router;