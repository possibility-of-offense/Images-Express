import express from 'express';
import {
    approvePasswordRequestController,
    showRequestsControllerView,
    removePasswordRequestController,
} from '../controllers/password-requests/show-requests';

const router = express.Router();

router.get('/', showRequestsControllerView);
router.post('/', approvePasswordRequestController);
router.post('/remove', removePasswordRequestController);

export { router as ForgotPasswordRequestRouter };
