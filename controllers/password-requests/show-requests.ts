import { Request, Response } from 'express';
import renderOptions from '../../helpers/render-options';
import { ForgotPasswordModel } from '../../models/ForgotPasswordModel';
import { Paginator } from '../../helpers/paginator';
import { UserModel } from '../../models/UserModel';

export const showRequestsControllerView = async (
    req: Request,
    res: Response
) => {
    if (!req.admin) {
        return res.redirect('/');
    }

    const skip = req.query.q || 0;

    const passwords = await ForgotPasswordModel.find()
        .skip(+skip)
        .limit(+process.env.FORGOT_PASSWORD_QUERY!)
        .lean();

    const pagination = new Paginator(
        +skip,
        +process.env.FORGOT_PASSWORD_QUERY!,
        ForgotPasswordModel
    );
    const { isPrevious, isNext, previousSkip, nextSkip } =
        await pagination.buildPagination();

    return res.render(
        'pages/show-password-requests',
        renderOptions(req, {
            passwords,
            isNext,
            isPrevious,
            previousSkip,
            nextSkip,
        })
    );
};

export const approvePasswordRequestController = async (
    req: Request,
    res: Response
) => {
    if (!req.admin) {
        return res.redirect('/');
    }

    const { id } = req.body;

    const getRequest = await ForgotPasswordModel.findById(id);
    await UserModel.findOneAndUpdate(
        {
            username: getRequest?.username,
        },
        {
            password: getRequest?.password,
        }
    );
    await ForgotPasswordModel.findByIdAndDelete(getRequest?._id);

    return res.redirect('/password-requests');
};

export const removePasswordRequestController = async (
    req: Request,
    res: Response
) => {
    if (!req.admin) {
        return res.redirect('/');
    }

    const { id } = req.body;

    await ForgotPasswordModel.findByIdAndDelete(id);

    return res.redirect('/password-requests');
};
