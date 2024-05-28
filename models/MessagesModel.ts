import mongoose, { Types } from 'mongoose';
import { IDoc, IModel, DecorateModel } from '../helpers/mongoose-build';

// Interface for properties when creating a new document
interface IMessagesAttrs {
    name: string;
    email: string;
    message: string;
}

// Interface for properties in User document
interface IMessagesDoc extends IDoc, IMessagesAttrs {}

// Interface for properties in User model
type IMessagesModel = IModel<IMessagesAttrs, IMessagesDoc> & {};

const messagesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
});

// https://stackoverflow.com/questions/53113031/how-to-see-a-fully-expanded-typescript-type-without-n-more-and
const MessagesModel = new DecorateModel<
    IMessagesAttrs,
    typeof messagesSchema,
    IMessagesDoc,
    IMessagesModel
>('Message', messagesSchema).getModel();

export { MessagesModel };
