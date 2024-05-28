import { Request } from 'express';

export default function renderOptions(
    req: Request,
    otherOptions?: { [key: string]: any }
) {
    return {
        userID: req.session.userID,
        isAdmin: false,
        // isAdmin: true,
        ...otherOptions,
    };
}
