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
function toClientSideRepresentation(mediaDoc) {
    return {
        url: "/m/" + getFileName(mediaDoc),
        uuid: mediaDoc.uuid,
        tags: mediaDoc.tags,
        selected: false
    };
}
exports.toClientSideRepresentation = toClientSideRepresentation;
//# sourceMappingURL=media.js.map