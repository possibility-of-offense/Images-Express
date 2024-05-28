import { Request, Response } from 'express';
import { ImageModel } from '../../models/ImageModel';
import renderOptions from '../../helpers/render-options';
import { Paginator } from '../../helpers/paginator';

export const getImagesController = async (req: Request, res: Response) => {
    const skip = req.query.q || 0;

    const images = await ImageModel.find()
        .skip(+skip)
        .limit(+process.env.IMAGES_QUERY!)
        .lean();

    const pagination = new Paginator(
        +skip,
        +process.env.IMAGES_QUERY!,
        ImageModel
    );
    const { isPrevious, isNext, previousSkip, nextSkip } =
        await pagination.buildPagination();

    return res.render(
        'pages/images',
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
        })
    );
};
