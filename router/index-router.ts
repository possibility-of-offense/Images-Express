import express from 'express';
import { validationErrors } from '../types/validationError';
import renderOptions from '../helpers/renderOptions';
import { ImageModel } from '../models/ImageModel';
import { UserModel } from '../models/UserModel';

const router = express.Router();

router.get('/', async (req, res) => {
    const { error } = req.query;
    let errors: validationErrors | null = null;

    const getLastFiveUsers = await UserModel.find()
        .limit(5)
        .sort({ createdAt: 'desc' })
        .lean();
    const getLastFivePhotos = await ImageModel.find()
        .limit(5)
        .sort({ createdAt: 'desc' })
        .populate('userID', '_id username');

    if (error) {
        errors = [
            {
                type: 'generic',
                value: String(error),
            },
        ];
    } else {
        errors = req.session.validationErrors as unknown as validationErrors;
        delete req.session.validationErrors;
    }

    const images = await ImageModel.find()
        .limit(10)
        .sort({ createdAt: 'desc' })
        .lean();

    return res.render(
        'pages/home',
        renderOptions(req, {
            errors: Array.isArray(errors) ? errors : [],
            images,
            users: getLastFiveUsers,
            photos: getLastFivePhotos,
            activeLink: 'home',
        })
    );
});

export { router as IndexRouter };
