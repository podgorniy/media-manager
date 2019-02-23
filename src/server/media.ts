import {Document, model, Schema} from 'mongoose'

interface IMedia extends Document {
    owner: string
    fileName: string
    md5: string
    tags: Array<string>
}

const MediaSchema = new Schema(
    {
        owner: {
            type: String,
            required: true
        },
        fileName: {
            type: String,
            unique: true,
            required: true
        },
        md5: {
            type: String,
            required: true
        },
        created: {
            type: Date,
            default: Date.now
        },
        tags: {
            type: [String],
            default: []
        }
    },
    {
        collection: 'media'
    }
)

export const MediaModel = model<IMedia>('media', MediaSchema)
