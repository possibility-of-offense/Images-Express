import { Request, Response } from 'express';
import renderOptions from '../../helpers/render-options';
import { UserModel } from '../../models/UserModel';

export const changeProfileControllerView = async (
    req: Request,
    res: Response
) => {
    const userInfo = await UserModel.findById(req.user);

    return res.render(
        'pages/change-profile',
        renderOptions(req, {
            username: userInfo?.username,
            profileImage: userInfo?.profileImage,
        })
    );
};

export const changeProfileController = async (req: Request, res: Response) => {
    const { username } = req.body;
    const image = req.file;

    await UserModel.findByIdAndUpdate(req.user, {
        username,
        profileImage: image ? image.path : '',
    });

    return res.redirect('/profile/change-profile');
};
