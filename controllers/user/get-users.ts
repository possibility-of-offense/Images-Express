import { Request, Response } from 'express';
import { UserModel } from '../../models/UserModel';
import renderOptions from '../../helpers/render-options';
import { Paginator } from '../../helpers/paginator';

export const getUsersController = async (req: Request, res: Response) => {
    const skip = req.query.q || 0;

    let users = await UserModel.find({ isAdmin: false })
        .skip(+skip)
        .limit(+process.env.USERS_QUERY!)
        .lean();

    const pagination = new Paginator(
        +skip,
        +process.env.USERS_QUERY!,
        UserModel
    );
    const { isPrevious, isNext, previousSkip, nextSkip } =
        await pagination.buildPagination(req.admin);

    users = users.map((user) => {
        // @ts-ignore
        const date = new Date(user.createdAt);

        return {
            ...user,
            createdAt: `${date.getDate()}/${
                date.getMonth() + 1
            }/${date.getFullYear()}`,
        };
    });

    return res.render(
        'pages/users',
        renderOptions(req, {
            users,
            isNext,
            isPrevious,
            previousSkip,
            nextSkip,
        })
    );
};
