import { Router } from 'express';
import EmpresaController from '../controllers/empresaController';
import { proteger, autorizar } from '../middlewares/auth';

const router = Router();

router
  .route('/')
  .get(EmpresaController.obterTodasEmpresas)
  .post(proteger, autorizar('admin'), EmpresaController.criarEmpresa);

router.get('/estatisticas', proteger, autorizar('admin'), EmpresaController.obterEstatisticas);

router
  .route('/:id')
  .get(EmpresaController.obterEmpresa)
  .put(proteger, EmpresaController.atualizarEmpresa)
  .delete(proteger, autorizar('admin'), EmpresaController.desativarEmpresa);

export default router;