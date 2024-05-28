import { Request, Response } from 'express';
import { UserModel } from '../../models/UserModel';
import { ImageModel } from '../../models/ImageModel';
import mongoose from 'mongoose';
import { CommentModel } from '../../models/CommentsModel';

export const deleteUserController = async (req: Request, res: Response) => {
    if (req.admin) {
        const userID = req.body.userID;

        await UserModel.findByIdAndDelete(userID);
        await ImageModel.deleteMany({
            userID: new mongoose.Types.ObjectId(userID as string),
        });
        await CommentModel.deleteMany({
            userCreatedPost: new mongoose.Types.ObjectId(userID as string),
        });
    }

    return res.redirect('/users');
};
