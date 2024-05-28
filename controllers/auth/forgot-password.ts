import { Request, Response } from 'express';
import renderOptions from '../../helpers/render-options';
import { saveDoc } from '../../helpers/mongoose-build';
import { ForgotPasswordModel } from '../../models/ForgotPasswordModel';
import { PasswordHashManager } from '../../helpers/password-hash';

export const forgotPasswordControllerView = async (
    req: Request,
    res: Response
) => {
    if (req.user) {
        return res.redirect('/');
    }

    return res.render('pages/forgot-password', renderOptions(req));
};

export const forgotPasswordController = async (req: Request, res: Response) => {
    if (req.admin) {
        return res.redirect('/');
    }

    const { username, password } = req.body;

    const getRequest = await ForgotPasswordModel.findOne({
        username,
    });

    if (getRequest) {
        return res.redirect('/?error=' + encodeURI('Request already sent!'));
    }

    await saveDoc(
        ForgotPasswordModel.build({
            username,
            password: await PasswordHashManager.hash(password),
        })
    );

    return res.redirect('/');
};
