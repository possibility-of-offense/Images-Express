import mongoose from 'mongoose';
import { ImageModel } from '../models/ImageModel';
import { UserModel } from '../models/UserModel';
import { saveDoc } from './mongoose-build';
import { CommentModel } from '../models/CommentsModel';

export class InsertData {
    private users: Array<string> = [];

    // The count will insert these many users, images and comments
    constructor(private count: number) {}

    public async insertUsers() {
        for (let i = 0; i < this.count; i++) {
            let user;

            try {
                user = await saveDoc(
                    UserModel.build({
                        username: 'Username ' + (i + 1),
                        password: 'password-' + Math.random(),
                        isAdmin: false,
                    })
                );
            } catch (err) {
                console.log(err);
            }
            this.users.push(user?.id);
        }
    }

    public async insertImages() {
        for (let i = 0; i < this.count; i++) {
            const image = await saveDoc(
                ImageModel.build({
                    userID: new mongoose.Types.ObjectId(this.users[i]),
                    imageURL: 'images\\desert.jpg',
                })
            );

            await saveDoc(
                CommentModel.build({
                    userID: new mongoose.Types.ObjectId(
                        this.users[
                            Math.floor(Math.random() * this.users.length)
                        ]
                    ),
                    imageID: image.id,
                    userCreatedPost: new mongoose.Types.ObjectId(this.users[i]),
                    commentBody: 'Nice comment',
                })
            );
        }
    }

    public async bulkInsert() {
        await this.insertUsers();
        await this.insertImages();
    }
}
