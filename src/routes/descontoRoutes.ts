import { Router } from "express";
import DescontoController from "../controllers/descontoController";
import { proteger } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Descontos
 *   description: Gerenciamento de cupons de desconto
 */

/**
 * @swagger
 * /descontos:
 *   get:
 *     summary: Lista todos os descontos
 *     tags: [Descontos]
 *     responses:
 *       200:
 *         description: Lista de descontos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Desconto'
 *   post:
 *     summary: Cria um novo desconto (requer autenticação)
 *     tags: [Descontos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DescontoInput'
 *     responses:
 *       201:
 *         description: Desconto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Desconto'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
router
  .route("/")
  .get(DescontoController.listarTodos)
  .post(proteger, DescontoController.criar);

/**
 * @swagger
 * /descontos/proximos-vencimento:
 *   get:
 *     summary: Lista descontos próximos do vencimento
 *     tags: [Descontos]
 *     parameters:
 *       - in: query
 *         name: dias
 *         schema:
 *           type: integer
 *           default: 7
 *         description: Número de dias para considerar como "próximo do vencimento"
 *     responses:
 *       200:
 *         description: Lista de descontos próximos do vencimento
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Desconto'
 */
router.get("/proximos-vencimento", DescontoController.listarProximosVencimento);

/**
 * @swagger
 * /descontos/empresa/{empresaId}:
 *   get:
 *     summary: Lista descontos por empresa
 *     tags: [Descontos]
 *     parameters:
 *       - in: path
 *         name: empresaId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da empresa
 *     responses:
 *       200:
 *         description: Lista de descontos da empresa
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Desconto'
 *       404:
 *         description: Empresa não encontrada
 */
router.get("/empresa/:empresaId", DescontoController.listarPorEmpresa);

/**
 * @swagger
 * /descontos/{id}:
 *   get:
 *     summary: Obtém um desconto específico
 *     tags: [Descontos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do desconto
 *     responses:
 *       200:
 *         description: Dados do desconto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Desconto'
 *       404:
 *         description: Desconto não encontrado
 *
 *   put:
 *     summary: Atualiza um desconto (requer autenticação)
 *     tags: [Descontos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do desconto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DescontoInput'
 *     responses:
 *       200:
 *         description: Desconto atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Desconto'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Desconto não encontrado
 *
 *   delete:
 *     summary: Remove um desconto (requer autenticação)
 *     tags: [Descontos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do desconto
 *     responses:
 *       204:
 *         description: Desconto removido com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Desconto não encontrado
 */
router
  .route("/:id")
  .get(DescontoController.obterPorId)
  .put(proteger, DescontoController.atualizar)
  .delete(proteger, DescontoController.deletar);

/**
 * @swagger
 * components:
 *   schemas:
 *     DescontoInput:
 *       type: object
 *       required:
 *         - codigo
 *         - valor
 *         - dataValidade
 *         - empresaId
 *       properties:
 *         codigo:
 *           type: string
 *           example: "VERAO20"
 *           description: Código promocional
 *         descricao:
 *           type: string
 *           example: "Desconto de verão"
 *         valor:
 *           type: number
 *           format: float
 *           minimum: 0.01
 *           example: 20.5
 *           description: Valor do desconto (pode ser percentual ou absoluto)
 *         tipo:
 *           type: string
 *           enum: [percentual, absoluto]
 *           default: "percentual"
 *         dataValidade:
 *           type: string
 *           format: date-time
 *           example: "2023-12-31T23:59:59"
 *         empresaId:
 *           type: string
 *           format: uuid
 *           example: "5f8d04b3ab35de3d342acd4a"
 *         ativo:
 *           type: boolean
 *           default: true
 *         limiteUsos:
 *           type: integer
 *           minimum: 1
 *           example: 100
 *           description: Número máximo de usos (opcional)
 *
 *     Desconto:
 *       allOf:
 *         - $ref: '#/components/schemas/DescontoInput'
 *         - type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               example: "5f8d04b3ab35de3d342acd4b"
 *             criadoEm:
 *               type: string
 *               format: date-time
 *             atualizadoEm:
 *               type: string
 *               format: date-time
 *             usos:
 *               type: integer
 *               minimum: 0
 *               example: 10
 *               description: Quantidade de vezes que foi utilizado
 *             empresa:
 *               $ref: '#/components/schemas/Empresa'
 */

export default router;
