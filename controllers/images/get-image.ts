import { Request, Response } from 'express';
import { ImageModel } from '../../models/ImageModel';
import renderOptions from '../../helpers/render-options';
import { CommentModel } from '../../models/CommentsModel';

export const getImageController = async (req: Request, res: Response) => {
    const findImage = await ImageModel.findById(req.params.imageID).populate(
        'userID',
        'username'
    );

    if (!findImage) {
        return res.redirect('/');
    }

    const findComments = await CommentModel.find({
        imageID: req.params.imageID,
    })
        .limit(+process.env.COMMENTS_QUERY!)
        .populate('userID', 'username')
        .lean();

    const comments = findComments.map((el) => {
        // @ts-ignore
        const date = new Date(el.createdAt);

        return {
            ...el,
            createdAt: `${date.getDate()}/${
                date.getMonth() + 1
            }/${date.getFullYear()}`,
        };
    });

    return res.render(
        'pages/image',
        renderOptions(req, {
            image: findImage,
            isOwnImage: findImage?.userID._id.toHexString() === req.user,
            userCreatedPost: findImage?.userID._id.toHexString(),
            isLoggedIn: req.user ? true : false,
            comments,
        })
    );
};
