import { Request, Response } from 'express';
import { ImageModel } from '../../models/ImageModel';
import { CommentModel } from '../../models/CommentsModel';

export const deleteImageController = async (req: Request, res: Response) => {
    const { imageID } = req.body;
    const userID = req.session.userID;
    const isAdmin = req.admin;

    const getImage = await ImageModel.findOne({ _id: imageID });

    if (
        (getImage && getImage.userID.toHexString() === userID!.toString()) ||
        isAdmin
    ) {
        await ImageModel.findByIdAndDelete({ _id: imageID });

        await CommentModel.deleteMany({
            userID,
        });
    }

    return res.redirect('/images');
};
