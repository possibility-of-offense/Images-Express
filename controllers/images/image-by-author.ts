import { Request, Response } from 'express';
import { ImageModel } from '../../models/ImageModel';
import renderOptions from '../../helpers/render-options';
import mongoose from 'mongoose';
import { Paginator } from '../../helpers/paginator';

export const getImagesByAuthor = async (req: Request, res: Response) => {
    const skip = req.query.q || 0;
    const { authorId } = req.params;

    const images = await ImageModel.find({
        userID: new mongoose.Types.ObjectId(authorId),
    })
        .skip(+skip)
        .limit(+process.env.IMAGES_QUERY!)
        .lean();

    const pagination = new Paginator(
        +skip,
        +process.env.IMAGES_QUERY!,
        ImageModel
    );
    const { isPrevious, isNext, previousSkip, nextSkip } =
        await pagination.buildPagination(false, {
            userID: authorId,
        });

    return res.render(
        'pages/images-by-author',
        renderOptions(req, {
            images: images.map((img) => {
                return {
                    ...img,
                    id: img._id.toHexString(),
                };
            }),
            isNext,
            isPrevious,
            previousSkip,
            nextSkip,
            authorId,
        })
    );
};
