import express from 'express';
import { UserModel } from '../models/UserModel';
import renderOptions from '../helpers/renderOptions';

const router = express.Router();

router.get('/', async (req, res) => {
    const skip = req.query.q || 0;

    let users = await UserModel.find().skip(+skip).limit(10).lean();

    let isNext = false;
    let isPrevious = false;

    const countDocs = await UserModel.countDocuments();

    if (+skip + 10 < countDocs) {
        isNext = true;
    }

    if (+skip > 0) {
        isPrevious = true;
    }

    users = users.map((user) => {
        // @ts-ignore
        const date = new Date(user.createdAt);

        return {
            ...user,
            createdAt: `${date.getDate()}/${
                date.getMonth() + 1
            }/${date.getFullYear()}`,
        };
    });

    console.log(users);

    return res.render(
        'pages/users',
        renderOptions(req, {
            users,
            isNext,
            isPrevious,
            previousSkip: +skip > 0 && +skip - 10,
            nextSkip: +skip + 10 < countDocs && +skip + 10,
        })
    );
});

export { router as UsersRouter };
