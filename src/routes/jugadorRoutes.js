import { Router } from 'express';
import { jugadorController } from '../controllers/jugadorController.js';

const router = Router();

router.get('/', jugadorController.getAll);
router.get('/:id', jugadorController.getById);
router.post('/', jugadorController.create);
router.put('/:id', jugadorController.update);
router.delete('/:id', jugadorController.delete);

export default router;