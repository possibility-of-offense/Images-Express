import { CommentModel } from '../../models/CommentsModel';
import { saveDoc } from '../../helpers/mongoose-build';
import mongoose from 'mongoose';
import { Request, Response } from 'express';

export const addCommentController = async (req: Request, res: Response) => {
    const userID = req.user;

    if (!userID) {
        return res.redirect('/?error=' + encodeURI('You must be login!'));
    }

    const { comment, imageID, userCreatedPost } = req.body;

    await saveDoc(
        CommentModel.build({
            commentBody: comment,
            userID: new mongoose.Types.ObjectId(userID),
            userCreatedPost,
            imageID,
        })
    );

    return res.redirect('/images/' + imageID);
};
