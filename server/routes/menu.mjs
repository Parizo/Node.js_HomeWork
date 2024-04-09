import express from 'express';
import menuController from '../controller/menuController.mjs';

const router = express.Router();

router.get('/', menuController.getMenu);

router.get('/:id', menuController.getMenuById);

router.post('/create', menuController.createMenu);

router.put('/:id', menuController.updateMenu);

router.delete('/:id', menuController.deleteMenu);


export default router;