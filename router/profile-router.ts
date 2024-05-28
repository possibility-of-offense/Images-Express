import express from 'express';
import { saveDoc } from '../helpers/mongoose-build';
import { ImageModel } from '../models/ImageModel';
import mongoose from 'mongoose';
import renderOptions from '../helpers/renderOptions';

const router = express.Router();

router.get('/upload-image', (req, res) => {
    return res.render('pages/add-image', renderOptions(req));
});

// router.post('')

router.post('/upload-image', async (req, res) => {
    //
    const image = req.file;
    console.log(req.file);

    let img;

    if (!image) {
        // TODO
    } else {
        const imageURL = image.path;

        img = await saveDoc(
            ImageModel.build({
                imageURL,
                userID: new mongoose.Types.ObjectId(req.session.userID),
            })
        );

        console.log(imageURL);
    }

    return res.redirect('/images/' + img!._id);
});

export { router as ProfileRouter };
