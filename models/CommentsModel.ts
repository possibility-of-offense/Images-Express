import mongoose, { Types } from 'mongoose';
import { IDoc, IModel, DecorateModel } from '../helpers/mongoose-build';

// Interface for properties when creating a new document
interface ICommentAttrs {
    commentBody: string;
    userID: Types.ObjectId;
    imageID: string;
}

// Interface for properties in User document
interface ICommentDoc extends IDoc, ICommentAttrs {}

// Interface for properties in User model
type ICommentModel = IModel<ICommentAttrs, ICommentDoc> & {};

const commentSchema = new mongoose.Schema(
    {
        commentBody: {
            type: String,
            required: true,
        },
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        imageID: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// https://stackoverflow.com/questions/53113031/how-to-see-a-fully-expanded-typescript-type-without-n-more-and
const CommentModel = new DecorateModel<
    ICommentAttrs,
    typeof commentSchema,
    ICommentDoc,
    ICommentModel
>('Comment', commentSchema).getModel();

export { CommentModel };