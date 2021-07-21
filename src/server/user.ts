import {Document, model, Model, Schema} from 'mongoose'
import {hashString} from './utils'
import {ACCOUNT_NAME, ACCOUNT_PASSWORD} from './env'

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

/**
 * Creates user if not creates
 *
 * @param userName
 * @param password
 */
export async function updateOrCreateUser(userName, password) {
    const recordSelector = {name: userName}
    const existingUserDoc = await UserModel.findOne(recordSelector)
    const passwordHash = await hashString(password)
    if (!existingUserDoc) {
        return new UserModel({
            name: userName,
            password: passwordHash
        }).save()
    } else {
        return UserModel.updateOne(recordSelector, {$set: {password: passwordHash}})
    }
}

export async function createDemoUser() {
    return updateOrCreateUser('demo', '123')
}

export async function validateAndCreateMasterUser() {
    const accountName = (ACCOUNT_NAME || '').trim()
    const accountPassword = (ACCOUNT_PASSWORD || '').trim()
    if (!accountName || !accountPassword) {
        throw Error(`Either both "ACCOUNT_NAME" and "ACCOUNT_PASSWORD" should be specified either none`)
    } else {
        return updateOrCreateUser(accountName, accountPassword)
    }
}
