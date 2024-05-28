import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { signupController } from '../controllers/auth/signup';
import { notEqualPasswords } from '../middleware/not-equal-passwords';
import { signinController } from '../controllers/auth/signin';
import {
    forgotPasswordControllerView,
    forgotPasswordController,
} from '../controllers/auth/forgot-password';

const router = express.Router();

// Signup
router.post(
    '/signup',
    notEqualPasswords,
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
    signupController
);

// Signin
router.post('/signin', signinController);

// Forgot password
router.get('/forgot-password', forgotPasswordControllerView);
router.post('/forgot-password', notEqualPasswords, forgotPasswordController);

// Signout
router.get('/signout', (req: Request, res: Response) => {
    delete req.session.userID;
    delete req.session.username;
    delete req.session.isAdmin;
    delete req.session.validationErrors;

    return res.redirect('/');
});

export { router as AuthRouter };
