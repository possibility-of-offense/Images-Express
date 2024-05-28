import nodemailer from 'nodemailer';
import { Request, Response } from 'express';
import { saveDoc } from '../../helpers/mongoose-build';
import { MessagesModel } from '../../models/MessagesModel';

var transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST!,
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: process.env.NODEMAIL_USERNAME!,
        pass: process.env.NODEMAIL_PASSWORD!,
    },
});

export const sendMessageController = async (req: Request, res: Response) => {
    const { email, subject, message } = req.body;

    var mailOptions = {
        from: email,
        to: process.env.NODEMAIL_USERNAME!,
        subject,
        text: message,
    };

    transporter.sendMail(mailOptions, async function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);

            await saveDoc(
                MessagesModel.build({
                    subject,
                    email,
                    message,
                })
            );
        }
    });

    req.session.sendedEmail = true;
    return res.redirect('/success');
};
