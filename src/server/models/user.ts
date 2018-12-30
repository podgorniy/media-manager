import {model, Schema, Document, Model} from 'mongoose'
import {compare, hash} from 'bcrypt'

const saltRounds = 10

export interface IUserFields {
    _id: any
    name: string
    password: string
}

interface IUser extends IUserFields, Document {
    passwordMatches: (password: string) => Promise<boolean>
}

// https://stackoverflow.com/questions/42448372/typescript-mongoose-static-model-method-property-does-not-exist-on-type
interface IUserModel extends Model<IUser> {
    hashString(password: string): Promise<string>
}

const UserSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
}, {
    collection: 'users'
})

UserSchema.method('passwordMatches', async function (password) {
    return compare(password, this.password)
})

UserSchema.static('hashString', async function (password) {
    return hash(password, saltRounds)
})

export const UserModel = model<IUser, IUserModel>('user', UserSchema)
