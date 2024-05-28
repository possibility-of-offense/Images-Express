import mongoose, { Types } from 'mongoose';
import { IDoc, IModel, DecorateModel } from '../helpers/mongoose-build';

// Interface for properties when creating a new document
interface IForgoPasswordtAttrs {
    username: string;
    password: string;
}

// Interface for properties in User document
interface IForgotPasswordDoc extends IDoc, IForgoPasswordtAttrs {}

// Interface for properties in User model
type IForgotPasswordModel = IModel<
    IForgoPasswordtAttrs,
    IForgotPasswordDoc
> & {};

const forgotPasswordSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const ForgotPasswordModel = new DecorateModel<
    IForgoPasswordtAttrs,
    typeof forgotPasswordSchema,
    IForgotPasswordDoc,
    IForgotPasswordModel
>('ForgotPassword', forgotPasswordSchema).getModel();

export { ForgotPasswordModel };
