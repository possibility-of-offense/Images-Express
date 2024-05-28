import express from 'express';
import { ImageModel } from '../models/ImageModel';
import renderOptions from '../helpers/renderOptions';
import { CommentModel } from '../models/CommentsModel';

const router = express.Router();

router.get('/', async (req, res) => {
    const skip = req.query.q || 0;

    const images = await ImageModel.find().skip(+skip).limit(10).lean();

    let isNext = false;
    let isPrevious = false;

    const countDocs = await ImageModel.countDocuments();

    if (+skip + 10 < countDocs) {
        isNext = true;
    }

    if (+skip > 0) {
        isPrevious = true;
    }

    return res.render(
        'pages/images',
        renderOptions(req, {
            images: images.map((img) => {
                return {
                    ...img,
                    id: img._id.toHexString(),
                };
            }),
            isNext,
            isPrevious,
            previousSkip: +skip > 0 && +skip - 10,
            nextSkip: +skip + 10 < countDocs && +skip + 10,
            isAdmin: true,
        })
    );
});

router.post('/delete-image', async (req, res) => {
    const { imageID } = req.body;
    const userID = req.session.userID;
    const isAdmin = req.session.isAdmin;

    if (isAdmin) {
        await ImageModel.findByIdAndDelete({ _id: imageID });

        await CommentModel.deleteMany({
            userID,
        });
    }
    await ImageModel.findByIdAndDelete({ _id: imageID });

    await CommentModel.deleteMany({
        userID,
    });

    return res.redirect('/');
});

router.get('/:imageID', async (req, res) => {
    const findImage = await ImageModel.findById(req.params.imageID);

    const findComments = await CommentModel.find({
        imageID: req.params.imageID,
    })
        .limit(10)
        .populate('userID', 'username')
        .lean();

    const comments = findComments.map((el) => {
        // @ts-ignore
        const date = new Date(el.createdAt);

        return {
            ...el,
            createdAt: `${date.getDate()}/${
                date.getMonth() + 1
            }/${date.getFullYear()}`,
        };
    });

    return res.render(
        'pages/image',
        renderOptions(req, {
            image: findImage,
            isOwnImage: findImage?.userID.toHexString() === req.session.userID,
            isLoggedIn: req.session.userID ? true : false,
            comments,
        })
    );
});

router.get('/:imageID/more-comments', async (req, res) => {
    const skip = req.query.q || 0;

    const getMoreComments = await CommentModel.find({
        _id: req.params.imageID,
    })
        .skip(+skip)
        .limit(10);

    return res.json({
        comments: getMoreComments,
    });
});

export { router as ImagesRouter };
