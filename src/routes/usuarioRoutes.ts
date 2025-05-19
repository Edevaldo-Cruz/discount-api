import { Router } from "express";
import UsuarioController from "../controllers/usuarioController";
import { proteger } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Operações relacionadas a usuários
 */

/**
 * @swagger
 * /usuarios/registrar:
 *   post:
 *     summary: Registrar um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioInput'
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Usuário já existe
 */
router.post("/registrar", UsuarioController.registrar);

/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     summary: Autenticar usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/login", UsuarioController.login);

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Listar todos os usuários (requer autenticação)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 */
router.get("/", proteger, UsuarioController.obterTodos);

/**
 * @swagger
 * components:
 *   schemas:
 *     UsuarioInput:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *         - senha
 *       properties:
 *         nome:
 *           type: string
 *           example: João Silva
 *         email:
 *           type: string
 *           format: email
 *           example: joao@exemplo.com
 *         senha:
 *           type: string
 *           format: password
 *           example: Senha@123
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           default: user
 *
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - senha
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: joao@exemplo.com
 *         senha:
 *           type: string
 *           format: password
 *           example: Senha@123
 *
 *     Usuario:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 5f8d04b3ab35de3d342acd4a
 *         nome:
 *           type: string
 *           example: João Silva
 *         email:
 *           type: string
 *           format: email
 *           example: joao@exemplo.com
 *         role:
 *           type: string
 *           enum: [user, admin]
 *         criadoEm:
 *           type: string
 *           format: date-time
 *         atualizadoEm:
 *           type: string
 *           format: date-time
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

export default router;
