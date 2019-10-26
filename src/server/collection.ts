import { Model, model, Schema } from 'mongoose'
import { ICollectionItem } from '../common/interfaces'

interface ICollectionModel extends Model<ICollectionItem> {}
const CollectionSchema = new Schema(
    {
        uri: {
            type: String,
            unique: true,
            required: true
        },
        media: {
            type: [String],
            required: false
        },
        public: {
            type: Boolean,
            required: false,
            default: false
        },
        title: {
            type: String,
            optional: true
        },
        owner: {
            type: String,
            required: true
        }
    },
    {
        collection: 'collections'
    }
)
export const CollectionsModel = model<ICollectionItem, ICollectionModel>('collections', CollectionSchema)
