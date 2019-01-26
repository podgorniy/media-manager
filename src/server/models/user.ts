import {Document, model, Model, Schema} from 'mongoose'

export interface IUserFields {
    _id: any
    name: string
    password: string
}

interface IUser extends IUserFields, Document {}

// https://stackoverflow.com/questions/42448372/typescript-mongoose-static-model-method-property-does-not-exist-on-type
interface IUserModel extends Model<IUser> {}

const UserSchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    },
    {
        collection: 'users'
    }
)

export const UserModel = model<IUser, IUserModel>('user', UserSchema)
