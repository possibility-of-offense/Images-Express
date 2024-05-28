import { Model } from 'mongoose';

export interface UserPayload {
    id: string;
    username: string;
    name: string;
}

export async function checkIfLoginIsValid(
    model: typeof Model,
    email: string,
    password: string,
    comparator: (
        suppliedPassword: string,
        storedPassword: string
    ) => Promise<boolean>
): Promise<{
    valid: boolean;
    additionalInfo?: {
        [Property in keyof UserPayload]?: UserPayload[Property];
    };
}> {
    const user = await model.findOne({ email });

    if (user) {
        return await Promise.resolve({
            valid: await comparator(password, user.password),
            additionalInfo: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    }

    return await Promise.resolve({
        valid: false,
    });
}
