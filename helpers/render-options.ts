import { Request } from 'express';
import { StringManipulator } from './string-manipulator';

export default function renderOptions(
    req: Request,
    otherOptions?: { [key: string]: any }
) {
    const link = new StringManipulator(
        StringManipulator.removeTrailingSlash(req.baseUrl + req.path)
    );

    return {
        userID: req.user,
        username: req.username,
        isAdmin: Boolean(req.admin),
        title: link.buildNameByUrlSegment('Home'),
        activeLink: StringManipulator.removeTrailingSlash(
            req.baseUrl + req.path
        ),
        ...otherOptions,
    };
}
