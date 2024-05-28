import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { UserModel } from '../../models/UserModel';
import { saveDoc } from '../../helpers/mongoose-build';

export const signupController = async (req: Request, res: Response) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        req.session.validationErrors = result.array().map((error) => {
            return {
                type: error.type === 'field' ? error.path : '',
                value: error.msg,
            };
        });

        return res.redirect('/');
    }

    const { username, password } = req.body;

    const checkIfUserExists = await UserModel.findOne({
        username,
    });

    let user;

    if (checkIfUserExists) {
        res.redirect('/?error=' + encodeURI('The user is already registered!'));
        return;
    } else {
        user = await saveDoc(
            UserModel.build({
                username,
                password,
                isAdmin:
                    username === process.env.ADMIN_USERNAME! &&
                    password === process.env.ADMIN_PASSWORD!,
            })
        );
    }

    if (user) {
        req.session.userID = (user as { _id: any })._id;
        req.session.username = user.username;
    }

    return res.redirect('/');
};
