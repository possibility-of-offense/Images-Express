import express from 'express';
import renderOptions from '../helpers/render-options';
import { sendMessageController } from '../controllers/contact/send-message';
import { getMessagesController } from '../controllers/contact/get-messages';

const router = express.Router();

router.get('/', (req, res) => {
    if (req.admin) {
        return res.redirect('/');
    }
    return res.render('pages/contact', renderOptions(req));
});

// Send message
router.post('/send-message', sendMessageController);

// Get all messages
router.get('/messages', getMessagesController);

export { router as ContactRouter };
