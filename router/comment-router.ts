import express from 'express';
import { CommentModel } from '../models/CommentsModel';
import { saveDoc } from '../helpers/mongoose-build';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/add-comment', async (req, res) => {
    const userID = req.session.userID;

    if (!userID) {
        return res.redirect('/?error=' + encodeURI('You must be login!'));
    }

    const { comment, imageID } = req.body;

    await saveDoc(
        CommentModel.build({
            commentBody: comment,
            userID: new mongoose.Types.ObjectId(userID),
            imageID,
        })
    );

    return res.redirect('/images/' + imageID);
});

export { router as CommentRouter };
