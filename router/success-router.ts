import express from 'express';
import renderOptions from '../helpers/render-options';

const router = express.Router();

router.get('/', (req, res) => {
    if (req.session.sendedEmail) {
        delete req.session.sendedEmail;
        return res.render('pages/success', renderOptions(req));
    }

    return res.redirect('/');
});

export { router as SuccessRouter };
