import { Request, Response } from 'express';
import { UserModel } from '../../models/UserModel';
import { checkIfLoginIsValid } from '../../helpers/check-if-login-is-valid';
import { PasswordHashManager } from '../../helpers/password-hash';

export const signinController = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const { valid, additionalInfo = null } = await checkIfLoginIsValid(
        UserModel,
        username,
        password,
        PasswordHashManager.compare
    );

    if (!valid) {
        return res.redirect(
            '/?error=' +
                encodeURI('You have provided invalid login credentials!')
        );
    }

    let user = {};
    if (additionalInfo && Object.keys(additionalInfo).length > 0) {
        user = additionalInfo;

        req.session.userID = additionalInfo.id;
        req.session.username = additionalInfo.username;

        if (
            username === process.env.ADMIN_USERNAME! &&
            password === process.env.ADMIN_PASSWORD!
        ) {
            req.session.isAdmin = true;
        }
    }

    return res.redirect('/');
};
