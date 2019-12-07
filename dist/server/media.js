"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var MediaSchema = new mongoose_1.Schema({
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
}, {
    collection: 'media'
});
exports.MediaModel = mongoose_1.model('media', MediaSchema);
function getFileName(_a) {
    var fileExtension = _a.fileExtension, uuid = _a.uuid;
    return uuid + '.' + fileExtension;
}
exports.getFileName = getFileName;
function toApiRepresentation(doc) {
    return {
        uuid: doc.uuid,
        tags: doc.tags,
        originalUrl: "/m/" + getFileName(doc),
        previewUrl: "/p/" + (doc.uuid + '.' + (doc.hasPreview ? 'jpeg' : doc.fileExtension)),
        type: doc.type,
        sharedIndividually: doc.sharedIndividually,
        height: doc.height,
        width: doc.width
    };
}
exports.toApiRepresentation = toApiRepresentation;
//# sourceMappingURL=media.js.map