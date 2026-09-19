const { Router } = require('express')
const { autenticar } = require('../../../middlewares/auth.middleware')
const { autorizar } = require('../../../middlewares/rbac.middleware')
const controller = require('./expensas.controller')

const router = Router()

const GESTION = autorizar('ADMINISTRADOR')
const CONSULTA = autorizar('ADMINISTRADOR', 'DIRECTORIO', 'CONSULTA')

/**
 * @openapi
 * /api/financiero/expensas:
 *   get:
 *     summary: Lista todas las expensas generadas
 *     tags: [Financiero]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: OK }
 *   post:
 *     summary: Genera una expensa para un inmueble (monto calculado segun su tipo)
 *     tags: [Financiero]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               inmuebleId: { type: string }
 *               periodo: { type: string, example: "2026-09" }
 *               fechaVencimiento: { type: string, example: "2026-09-30" }
 *     responses:
 *       201: { description: Expensa generada }
 *       404: { description: Inmueble no encontrado }
 *       409: { description: Inmueble inactivo }
 */
router.get('/', autenticar, CONSULTA, controller.listar)
router.post('/', autenticar, GESTION, controller.generar)

module.exports = router
