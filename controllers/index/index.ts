import { Request, Response } from 'express';
import { validationErrors } from '../../types/validationError';
import renderOptions from '../../helpers/render-options';
import { ImageModel } from '../../models/ImageModel';
import { UserModel } from '../../models/UserModel';
import mongoose from 'mongoose';

export const indexController = async (req: Request, res: Response) => {
    const { error } = req.query;
    let errors: validationErrors | null = null;

    let users: Array<mongoose.Document> = [];
    let images: Array<mongoose.Document> = [];

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

    // If it is admin on the home page
    if (req.admin) {
        users = await UserModel.find({ isAdmin: false })
            .limit(+process.env.HOME_PAGE_ADMIN_LIMIT_RESULTS!)
            .sort({ createdAt: 'desc' })
            .lean();
        images = await ImageModel.find()
            .limit(+process.env.HOME_PAGE_ADMIN_LIMIT_RESULTS!)
            .sort({ createdAt: 'desc' })
            .populate('userID', '_id username');
    } else {
        images = await ImageModel.find()
            .limit(+process.env.HOME_PAGE_USER_LIMIT_RESULTS!)
            .sort({ createdAt: 'desc' })
            .lean();
    }

    return res.render(
        'pages/home',
        renderOptions(req, {
            errors: Array.isArray(errors) ? errors : [],
            images,
            users,
            flashMessage: req.flash('info'),
        })
    );
};
