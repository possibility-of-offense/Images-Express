import { Request, Response } from 'express';
import { CommentModel } from '../../models/CommentsModel';

// This controller is for eventual AJAX fetching through client JS
export const moreCommentsController = async (req: Request, res: Response) => {
    const skip = req.query.q || 0;

    const getMoreComments = await CommentModel.find({
        _id: req.params.imageID,
    })
        .skip(+skip)
        .limit(+process.env.COMMENTS_QUERY!);

    return res.json({
        comments: getMoreComments,
    });
};
