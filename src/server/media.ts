import {Document, Model, model, Schema} from 'mongoose'
import {IAppMediaItem} from '../common/interfaces'

export interface IMediaDoc {
    owner: string
    uuid: string
    fileExtension: string
    md5: string
    tags: Array<string>
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

export function toClientSideRepresentation(mediaDoc: IMediaDoc): IAppMediaItem {
    return {
        url: `/m/${getFileName(mediaDoc)}`,
        uuid: mediaDoc.uuid,
        tags: mediaDoc.tags,
        selected: false
    }
}
