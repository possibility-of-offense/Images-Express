import { Request, Response } from 'express';
import { CommentModel } from '../../models/CommentsModel';

export const deleteCommentController = async (req: Request, res: Response) => {
    const redirectToImageUrl = req.body.imageID;
    const commentID = req.body.commentID;

    if (req.admin) {
        await CommentModel.findByIdAndDelete(commentID);
    }

    return res.redirect('/images/' + redirectToImageUrl);
};
