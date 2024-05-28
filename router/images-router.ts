import express from 'express';
import { ImageModel } from '../models/ImageModel';
import renderOptions from '../helpers/render-options';
import { CommentModel } from '../models/CommentsModel';
import mongoose from 'mongoose';
import { Paginator } from '../helpers/paginator';
import { getImagesController } from '../controllers/images/get-images';
import { deleteImageController } from '../controllers/images/delete-image';
import { getImagesByAuthor } from '../controllers/images/image-by-author';
import { getImageController } from '../controllers/images/get-image';
import { moreCommentsController } from '../controllers/images/more-comments';

const router = express.Router();

// Get images
router.get('/', getImagesController);

// Delete image (the image can be deleted if admin is deleting it)
router.post('/delete-image', deleteImageController);

// Get images by author
router.get('/by-author/:authorId', getImagesByAuthor);

// Get single image
router.get('/:imageID', getImageController);

// More comments
router.get('/:imageID/more-comments', moreCommentsController);

export { router as ImagesRouter };
