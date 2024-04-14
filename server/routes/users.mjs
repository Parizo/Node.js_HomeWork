import express from 'express';
import userController from '../controller/usersController.mjs';

import { validate } from '../middleware/schemaValidator.mjs';
import { userValidationSchema, validateUserId } from '../validators/userValidator.mjs';

const router = express.Router();

router.post('/register',validate(userValidationSchema) , userController.createUser);

router.get('/', userController.getUsers);

router.get('/:id',validate(validateUserId), userController.getUserById);

router.put('/:id', userController.updateUser);

router.delete('/:id', userController.deleteUser);

router.post(':userId/orders', userController.createOrderUser);

router.post('/login', userController.login);

router.post('/logout', userController.logout);

export default router;