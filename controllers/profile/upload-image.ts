import { Request, Response } from 'express';
import { saveDoc } from '../../helpers/mongoose-build';
import { ImageModel } from '../../models/ImageModel';
import mongoose from 'mongoose';

export const uploadImageController = async (req: Request, res: Response) => {
    const image = req.file;
    let img;

    if (!image) {
        return res.redirect('/');
    } else {
        const imageURL = image.path;

        const countImagesByUserId = await ImageModel.countDocuments({
            userID: req.user,
        });

        if (countImagesByUserId === +process.env.MAXIMUM_ALLOW_IMAGES!) {
            return res.redirect(
                '/?error=' +
                    encodeURI('You are allowed to upload only 10 images!')
            );
        }

        img = await saveDoc(
            ImageModel.build({
                imageURL,
                userID: new mongoose.Types.ObjectId(req.user),
            })
        );
    }

    return res.redirect('/images/' + img!._id);
};
