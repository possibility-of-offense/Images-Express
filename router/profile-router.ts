import express from 'express';
import renderOptions from '../helpers/render-options';
import { uploadImageController } from '../controllers/profile/upload-image';
import {
    changeProfileController,
    changeProfileControllerView,
} from '../controllers/profile/change-profile';
import { redirectIfNotLoggedIn } from '../middleware/redirect-if-not-logged-in';

const router = express.Router();

// Upload image view
router.get('/upload-image', redirectIfNotLoggedIn('/'), (req, res) => {
    return res.render('pages/add-image', renderOptions(req));
});

// Upload Image
router.post('/upload-image', redirectIfNotLoggedIn('/'), uploadImageController);

// Change profile
router.get(
    '/change-profile',
    redirectIfNotLoggedIn('/'),
    changeProfileControllerView
);
router.post(
    '/change-profile',
    redirectIfNotLoggedIn('/'),
    changeProfileController
);

export { router as ProfileRouter };
