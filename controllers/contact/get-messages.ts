import { Request, Response } from 'express';
import { MessagesModel } from '../../models/MessagesModel';
import { Paginator } from '../../helpers/paginator';
import renderOptions from '../../helpers/render-options';

export const getMessagesController = async (req: Request, res: Response) => {
    if (!req.admin) {
        return res.redirect('/');
    }

    const skip = req.query.q || 0;

    const messages = await MessagesModel.find()
        .skip(+skip)
        .limit(+process.env.MESSAGES_QUERY!)
        .lean();

    const pagination = new Paginator(
        +skip,
        +process.env.MESSAGES_QUERY!,
        MessagesModel
    );
    const { isPrevious, isNext, previousSkip, nextSkip } =
        await pagination.buildPagination();

    return res.render(
        'pages/messages',
        renderOptions(req, {
            messages,
            isNext,
            isPrevious,
            previousSkip,
            nextSkip,
        })
    );
};
