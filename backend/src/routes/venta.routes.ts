import { Router } from 'express'
import { VentaController } from '../app/controllers'

const router = Router()

router.get('/', VentaController.getAll)
router.get('/by-fecha', VentaController.getVentasByFecha)
router.get('/:id', VentaController.getById)
router.post('/', VentaController.create)
router.put('/:id', VentaController.update)
router.delete('/:id', VentaController.remove)
router.post('/rango', VentaController.getVentasRango)

export default router
