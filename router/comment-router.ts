import express from 'express';
import { addCommentController } from '../controllers/comment/add-comment';
import { deleteCommentController } from '../controllers/comment/delete-comment';

const router = express.Router();

// Add comment
router.post('/add-comment', addCommentController);

// Delete comment
router.post('/delete-comment', deleteCommentController);

export { router as CommentRouter };
