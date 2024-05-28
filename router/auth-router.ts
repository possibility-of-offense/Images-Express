import express, { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { UserModel } from '../models/UserModel';
import { saveDoc } from '../helpers/mongoose-build';
import { checkIfLoginIsValid } from '../helpers/check-if-login-is-valid';
import { PasswordHashManager } from '../helpers/password-hash';

const router = express.Router();

// Signup
router.post(
    '/signup',
    // (req: Request, res: Response, next: NextFunction) => {
    //     if (
    //         req.body.password.toLowerCase() !==
    //         req.body['confirm-password'].toLowerCase()
    //     ) {
    //         req.session.validationErrors = [
    //             {
    //                 type: 'generic',
    //                 value: 'Passwords do not match',
    //             },
    //         ];

    //         return res.redirect('/');
    //     } else {
    //         return next();
    //     }
    // },
    [
        body('username')
            .notEmpty()
            .isLength({
                min: 5,
            })
            .withMessage('The username should be at least 5 characters long!'),
        body('password')
            .notEmpty()
            .isLength({
                min: 10,
            })
            .withMessage(
                'The password should be 10 characters long and include at least 1 uppercase letter and 1 special character!'
            ),
    ],
    async (req: Request, res: Response) => {
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
            res.redirect(
                '/?error=' + encodeURI('The user is already registered!')
            );
            return;
        } else {
            user = await saveDoc(
                UserModel.build({
                    username,
                    password,
                    isAdmin: false,
                })
            );
        }

        if (user) {
            req.session.userID = (user as { _id: any })._id;
        }

        res.redirect('/');
    }
);

// Signin
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    const { valid, additionalInfo = null } = await checkIfLoginIsValid(
        UserModel,
        email,
        password,
        PasswordHashManager.compare
    );

    let user = {};
    if (additionalInfo && Object.keys(additionalInfo).length > 0) {
        user = additionalInfo;

        req.session.userID = additionalInfo.id;
    }

    return res.redirect('/');
});

// Signout
router.get('/signout', (req, res) => {
    delete req.session.userID;

    return res.redirect('/');
});

export { router as AuthRouter };
