import { Express } from 'express';
import multer from 'multer';

export class MulterMiddleware {
    constructor(public allowedFiles: Array<string>) {}

    static isAllowedMimeType(file: any, allowed: Array<string>) {
        return allowed.find((allow) => file.mimetype === allow);
    }

    use(app: Express, imageInputName = 'image', imagesDirectory = 'images') {
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, `./${imagesDirectory}/`);
            },
            filename: function (req: any, file: any, cb: any) {
                cb(null, file.originalname);
            },
        });

        const fileFilter = (req: any, file: any, cb: any) => {
            if (MulterMiddleware.isAllowedMimeType(file, this.allowedFiles)) {
                cb(null, true);
            } else {
                cb(
                    new Error('Image uploaded is not of type jpg/jpeg or png'),
                    false
                );
            }
        };

        app.use(multer({ storage, fileFilter }).single(imageInputName));
    }
}
