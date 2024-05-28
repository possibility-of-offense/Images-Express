import mongoose, { Types } from 'mongoose';
import { IDoc, IModel, DecorateModel } from '../helpers/mongoose-build';

// Interface for properties when creating a new document
interface IImageAttrs {
    imageURL: string;
    userID: Types.ObjectId;
}

// Interface for properties in User document
interface IImageDoc extends IDoc, IImageAttrs {}

// Interface for properties in User model
type IImageModel = IModel<IImageAttrs, IImageDoc> & {};

const imageSchema = new mongoose.Schema(
    {
        imageURL: {
            type: String,
            required: true,
        },
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const ImageModel = new DecorateModel<
    IImageAttrs,
    typeof imageSchema,
    IImageDoc,
    IImageModel
>('Image', imageSchema).getModel();

export { ImageModel };
