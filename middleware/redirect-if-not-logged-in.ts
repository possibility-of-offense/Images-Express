import { NextFunction, Request, Response } from 'express';

export const redirectIfNotLoggedIn = (redirectTo: string = '/') => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.redirect(redirectTo);
        }

        return next();
    };
};
