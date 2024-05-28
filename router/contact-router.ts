import express from 'express';
import renderOptions from '../helpers/renderOptions';

import nodemailer from 'nodemailer';
import { saveDoc } from '../helpers/mongoose-build';
import { MessagesModel } from '../models/MessagesModel';

var transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: 'dejah25@ethereal.email',
        pass: 'QzNu3CSZTuGtdXbMfp',
    },
});

var mailOptions = {
    from: 'ultimatemeaning90@gmail.com',
    to: 'dejah25@ethereal.email',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!',
};

const router = express.Router();

router.get('/', (req, res) => {
    return res.render('pages/contact', renderOptions(req));
});

router.post('/send-message', async (req, res) => {
    const { name, email, message } = req.body;

    transporter.sendMail(mailOptions, async function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);

            await saveDoc(
                MessagesModel.build({
                    name,
                    email,
                    message,
                })
            );
        }
    });

    return res.redirect('/success');
});

export { router as ContactRouter };
