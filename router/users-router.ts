import express from 'express';
import { getUsersController } from '../controllers/user/get-users';
import { deleteUserController } from '../controllers/user/delete-user';

const router = express.Router();

// Get users
router.get('/', getUsersController);

// Delete user
router.post('/delete-user', deleteUserController);

export { router as UsersRouter };
