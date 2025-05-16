import { Router } from 'express';
import UsuarioController from '../controllers/usuarioController';
import { proteger } from '../middlewares/auth';

const router = Router();

router.post('/registrar', UsuarioController.registrar);
router.post('/login', UsuarioController.login);
router.get('/', proteger, UsuarioController.obterTodos);

export default router;