import { NextFunction, Request, Response } from 'express';

export const notEqualPasswords = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (
        req.body.password.toLowerCase() !==
        req.body['confirm-password'].toLowerCase()
    ) {
        req.session.validationErrors = [
            {
                type: 'generic',
                value: 'Passwords do not match',
            },
        ];

        return res.redirect('/');
    } else {
        return next();
    }
};
