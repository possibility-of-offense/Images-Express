import express from 'express';
import { urlencoded } from 'body-parser';
import mongoose from 'mongoose';
import session from 'express-session';
import cors from 'cors';
import path from 'path';
import multer from 'multer';

import { validationErrors } from './types/validationError';
import { IndexRouter } from './router/index-router';
import { ProfileRouter } from './router/profile-router';
import { ImagesRouter } from './router/images-router';
import { UsersRouter } from './router/users-router';
import { ContactRouter } from './router/contact-router';
import { AuthRouter } from './router/auth-router';
import { CommentRouter } from './router/comment-router';
import { SuccessRouter } from './router/success-router';
import { AdminRouter } from './router/admin-router';

// import MongoDBStore from 'connect-mongodb-session';

// TODO add csrf

declare module 'express-session' {
    export interface SessionData {
        userID: string;
        validationErrors: validationErrors;
        isAdmin: boolean;
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
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images/');
    },
    filename: function (req: any, file: any, cb: any) {
        cb(null, file.originalname);
    },
});
const fileFilter = (req: any, file: any, cb: any) => {
    if (
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png'
    ) {
        cb(null, true);
    } else {
        cb(new Error('Image uploaded is not of type jpg/jpeg or png'), false);
    }
};
app.use(multer({ storage, fileFilter }).single('image'));

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        // store: store,
    })
);

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
// app.use('/admin', AdminRouter);

const init = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/images');

        app.listen(4000, () => {
            console.log('Server running!');
        });
    } catch (err) {
        console.error(err);
    }
};

init();
