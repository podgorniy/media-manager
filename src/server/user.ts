import { Document, model, Model, Schema } from 'mongoose'
import { hashString } from './utils'

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

async function createDemoUser() {
    const DEMO_USERNAME = 'demo'
    const DEMO_USERNAME_PASSWORD = '123'
    const defaultUser = await UserModel.findOne({name: DEMO_USERNAME})
    if (!defaultUser) {
        return new UserModel({
            name: DEMO_USERNAME,
            password: await hashString(DEMO_USERNAME_PASSWORD)
        }).save()
    }
}

;(async function() {
    // TODO: figure out
    // Need user for demonstration, create it at all times
    await createDemoUser()
})()
