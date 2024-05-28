import mongoose, { Types } from 'mongoose';
import { IDoc, IModel, DecorateModel } from '../helpers/mongoose-build';
import { PasswordHashManager } from '../helpers/password-hash';

// Interface for properties when creating a new document
interface IUserAttrs {
    username: string;
    password: string;
    isAdmin: boolean;
}

// Interface for properties in User document
interface IUserDoc extends IDoc, IUserAttrs {}

// Interface for properties in User model
type IUserModel = IModel<IUserAttrs, IUserDoc> & {};

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            required: true,
        },
        profileImage: {
            type: String,
            required: true,
            default: '/user.png',
        },
    },
    {
        timestamps: true,
    }
);

// Middleware pre
userSchema.pre('save', async function () {
    if (this.isModified('password')) {
        const hashed = await PasswordHashManager.hash(this.get('password'));

        this.set('password', hashed);
    }
});

// https://stackoverflow.com/questions/53113031/how-to-see-a-fully-expanded-typescript-type-without-n-more-and
const UserModel = new DecorateModel<
    IUserAttrs,
    typeof userSchema,
    IUserDoc,
    IUserModel
>('User', userSchema).getModel();

export { UserModel };
