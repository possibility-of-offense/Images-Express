import { Express, NextFunction, Request, Response } from 'express';

export class AuthMiddleware {
    /**
     *
     * @param app Express
     * @description Append new property to the Request object if the user is authenticated or admin
     */
    static checkAuthentication(app: Express) {
        app.use((req: Request, res: Response, next: NextFunction) => {
            if (req.session.userID) {
                req.username = req.session.username!;
                req.user = req.session.userID;
            }
            if (req.session.isAdmin) {
                req.admin = Boolean(req.session.isAdmin);
            } else {
                req.admin = false;
            }

            next();
        });
    }
}
