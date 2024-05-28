import express from 'express';
import { urlencoded } from 'body-parser';
import mongoose from 'mongoose';
import session from 'express-session';
import cors from 'cors';
import path from 'path';

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

app.use(
    cors({
        origin: 'http://localhost:4000',
    })
);
app.use(
    urlencoded({
        extended: false,
    })
);

// Use multer
const useMulter = new MulterMiddleware([
    'image/jpg',
    'image/jpeg',
    'image/png',
]);
useMulter.use(app);

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

const init = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/images');

        const checkForAdmin = await UserModel.findOne({
            username: process.env.ADMIN_USERNAME!,
        });

        if (!checkForAdmin) {
            const admin = new UserModel({
                username: process.env.ADMIN_USERNAME!,
                password: process.env.ADMIN_PASSWORD!,
                isAdmin: true,
            });
            await admin.save();
        }

        app.listen(4000, () => {
            console.log('Server running!');
        });
    } catch (err) {
        console.error(err);
    }
};

init();
