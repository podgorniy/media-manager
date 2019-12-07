import {Document, Model, model, Schema} from 'mongoose'
import {IUserMediaItem, MediaType} from '../common/interfaces'

export interface IMediaDoc {
    owner: string
    uuid: string
    fileExtension: string
    md5: string
    tags: Array<string>
    type: MediaType
    sharedIndividually: boolean
    width: number
    height: number
    hasPreview: boolean
}

interface IMedia extends Document, IMediaDoc {}

interface IMediaModel extends Model<IMedia> {}

const MediaSchema = new Schema(
    {
        owner: {
            type: String,
            required: true
        },
        uuid: {
            type: String,
            unique: true,
            required: true
        },
        fileExtension: {
            type: String,
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
        },
        type: {
            type: String,
            default: null
        },
        sharedIndividually: {
            type: Boolean,
            default: false
        },
        width: {
            type: Number,
            required: true
        },
        height: {
            type: Number,
            required: true
        },
        hasPreview: {
            type: Boolean,
            default: false
        }
    },
    {
        collection: 'media'
    }
)

export const MediaModel = model<IMedia, IMediaModel>('media', MediaSchema)

export function getFileName({fileExtension, uuid}: IMediaDoc): string {
    return uuid + '.' + fileExtension
}

export function toApiRepresentation(doc: IMediaDoc): IUserMediaItem {
    return {
        uuid: doc.uuid,
        tags: doc.tags,
        originalUrl: `/m/${getFileName(doc)}`,
        previewUrl: `/p/${doc.uuid + '.' + (doc.hasPreview ? 'jpeg' : doc.fileExtension)}`,
        type: doc.type,
        sharedIndividually: doc.sharedIndividually,
        height: doc.height,
        width: doc.width
    }
}
