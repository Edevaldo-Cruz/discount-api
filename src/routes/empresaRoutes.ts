import { Router } from 'express';
import EmpresaController from '../controllers/empresaController';
import { proteger, autorizar } from '../middlewares/auth';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Empresas
 *   description: Gestão de empresas
 */

/**
 * @swagger
 * /empresas:
 *   get:
 *     summary: Lista todas as empresas
 *     tags: [Empresas]
 *     responses:
 *       200:
 *         description: Lista de empresas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Empresa'
 *   post:
 *     summary: Cria uma nova empresa (apenas admin)
 *     tags: [Empresas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmpresaInput'
 *     responses:
 *       201:
 *         description: Empresa criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Empresa'
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado (requer role admin)
 */
router
  .route('/')
  .get(EmpresaController.obterTodasEmpresas)
  .post(proteger, autorizar('admin'), EmpresaController.criarEmpresa);

/**
 * @swagger
 * /empresas/estatisticas:
 *   get:
 *     summary: Obtém estatísticas das empresas (apenas admin)
 *     tags: [Empresas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas das empresas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalEmpresas:
 *                   type: integer
 *                 empresasAtivas:
 *                   type: integer
 *                 empresasPorSetor:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       setor:
 *                         type: string
 *                       count:
 *                         type: integer
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 */
router.get('/estatisticas', proteger, autorizar('admin'), EmpresaController.obterEstatisticas);

/**
 * @swagger
 * /empresas/{id}:
 *   get:
 *     summary: Obtém uma empresa específica
 *     tags: [Empresas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da empresa
 *     responses:
 *       200:
 *         description: Dados da empresa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Empresa'
 *       404:
 *         description: Empresa não encontrada
 * 
 *   put:
 *     summary: Atualiza uma empresa (requer autenticação)
 *     tags: [Empresas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da empresa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmpresaInput'
 *     responses:
 *       200:
 *         description: Empresa atualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Empresa'
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Empresa não encontrada
 * 
 *   delete:
 *     summary: Desativa uma empresa (apenas admin)
 *     tags: [Empresas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da empresa
 *     responses:
 *       204:
 *         description: Empresa desativada com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado (requer role admin)
 *       404:
 *         description: Empresa não encontrada
 */
router
  .route('/:id')
  .get(EmpresaController.obterEmpresa)
  .put(proteger, EmpresaController.atualizarEmpresa)
  .delete(proteger, autorizar('admin'), EmpresaController.desativarEmpresa);

/**
 * @swagger
 * components:
 *   schemas:
 *     EmpresaInput:
 *       type: object
 *       required:
 *         - nome
 *         - cnpj
 *         - setor
 *       properties:
 *         nome:
 *           type: string
 *           example: "Tech Solutions LTDA"
 *         cnpj:
 *           type: string
 *           example: "12.345.678/0001-90"
 *         setor:
 *           type: string
 *           enum: [Tecnologia, Saúde, Educação, Financeiro, Varejo]
 *           example: "Tecnologia"
 *         endereco:
 *           type: string
 *           example: "Rua Exemplo, 123"
 *         telefone:
 *           type: string
 *           example: "(11) 99999-9999"
 *         ativa:
 *           type: boolean
 *           default: true
 * 
 *     Empresa:
 *       allOf:
 *         - $ref: '#/components/schemas/EmpresaInput'
 *         - type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               example: "5f8d04b3ab35de3d342acd4a"
 *             criadoEm:
 *               type: string
 *               format: date-time
 *             atualizadoEm:
 *               type: string
 *               format: date-time
 *             usuarioCriador:
 *               type: string
 *               format: uuid
 *               example: "5f8d04b3ab35de3d342acd4b"
 */

export default router;