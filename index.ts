import express, { Request, Response, NextFunction } from 'express';
import { urlencoded } from 'body-parser';
import mongoose from 'mongoose';
import session from 'express-session';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import flash from 'connect-flash';

require('dotenv').config();

import { AuthMiddleware } from './middleware/auth';
import { validationErrors } from './types/validationError';
import { IndexRouter } from './router/index-router';
import { ProfileRouter } from './router/profile-router';
import { ImagesRouter } from './router/images-router';
import { UsersRouter } from './router/users-router';
import { ContactRouter } from './router/contact-router';
import { AuthRouter } from './router/auth-router';
import { CommentRouter } from './router/comment-router';
import { SuccessRouter } from './router/success-router';
import { MulterMiddleware } from './middleware/use-multer';
import { UserModel } from './models/UserModel';
import renderOptions from './helpers/render-options';
import { csrfProtection } from './middleware/csrf';
import { ForgotPasswordRequestRouter } from './router/forgot-password-request-router';
import { InsertData } from './helpers/insert-data';

// TODO add csrf

// Declartion merging
declare global {
    namespace Express {
        export interface Request {
            user: string;
            username: string;
            admin: boolean;
        }
    }
}

declare module 'express-session' {
    export interface SessionData {
        userID: string;
        username: string;
        validationErrors: validationErrors;
        isAdmin: boolean;
        sendedEmail: boolean;
    }
}

const app = express();

// app.use(
//     cors({
//         origin: 'http://localhost:4000',
//     })
// );
app.use(
    urlencoded({
        extended: false,
    })
);
app.use(cookieParser());

// Use multer
const useMulter = new MulterMiddleware([
    'image/jpg',
    'image/jpeg',
    'image/png',
]);
useMulter.use(app);
app.use(csrfProtection);
app.use(flash());

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
    })
);

// Auth middleware
AuthMiddleware.checkAuthentication(app);

// Middlewares for static folders
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes
app.use('/', IndexRouter);
app.use('/auth', AuthRouter);
app.use('/images', ImagesRouter);
app.use('/profile', ProfileRouter);
app.use('/comments', CommentRouter);
app.use('/users', UsersRouter);
app.use('/contact', ContactRouter);
app.use('/success', SuccessRouter);
app.use('/password-requests', ForgotPasswordRequestRouter);

// Error handling
app.use('*', (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err.message);

    return res.render(
        'pages/404',
        renderOptions(req, {
            msg: err.message || 'Error!',
        })
    );
});

const init = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        // await mongoose.connect('mongodb://127.0.0.1:27017/images');

        // Insert admins
        let admins: string | string[] =
            process.env.ADMINS_USERNAME!.split('----');

        const checkForAdmins = await UserModel.find({
            username: {
                $in: admins,
            },
        });

        if (checkForAdmins.length === 0) {
            const adminPasswords: string | string[] =
                process.env.ADMINS_PASSWORD!.split('----');

            for (let i = 0; i < admins.length; i++) {
                const admin = new UserModel({
                    username: admins[i],
                    password: adminPasswords[i],
                    isAdmin: true,
                });
                await admin.save();
            }
        }

        // Bulk Insert if the issued command is: npm start bulk
        if (process.argv.slice().pop() === 'bulk') {
            const insertData = new InsertData(20);
            insertData.bulkInsert();
        }

        app.listen(4000, () => {
            console.log('Server running!');
        });
    } catch (err) {
        console.error(err);
    }
};

init();
