import {model, Schema, Document} from 'mongoose';

interface IImage extends Document {
    url: string
    created: Date
    tags: Array<string>
}

const ImageSchema = new Schema({
    url: {type: String, unique: true},
    created: {type: Date, default: Date.now},
    tags: {
        type: [String],
        default: []
    }
}, {
    collection: 'images'
})

const ImageModel = model<IImage>('image', ImageSchema)
