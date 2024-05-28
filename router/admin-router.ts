import express from 'express';
import renderOptions from '../helpers/renderOptions';
import { UserModel } from '../models/UserModel';
import { ImageModel } from '../models/ImageModel';

const router = express.Router();

router.get('/', async (req, res) => {
    const getLastFiveUsers = await UserModel.find()
        .limit(5)
        .sort({ createdAt: 'desc' })
        .lean();
    const getLastFivePhotos = await ImageModel.find()
        .limit(5)
        .sort({ createdAt: 'desc' })
        .populate('userID', '_id username');

    return res.render(
        'pages/admin/index',
        renderOptions(req, {
            users: getLastFiveUsers,
            photos: getLastFivePhotos,
        })
    );
});

export { router as AdminRouter };
