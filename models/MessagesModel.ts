import mongoose, { Types } from 'mongoose';
import { IDoc, IModel, DecorateModel } from '../helpers/mongoose-build';

// Interface for properties when creating a new document
interface IMessagesAttrs {
    email: string;
    subject: string;
    message: string;
}

// Interface for properties in User document
interface IMessagesDoc extends IDoc, IMessagesAttrs {}

// Interface for properties in User model
type IMessagesModel = IModel<IMessagesAttrs, IMessagesDoc> & {};

const messagesSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
});

const MessagesModel = new DecorateModel<
    IMessagesAttrs,
    typeof messagesSchema,
    IMessagesDoc,
    IMessagesModel
>('Message', messagesSchema).getModel();

export { MessagesModel };
