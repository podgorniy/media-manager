"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var MediaSchema = new mongoose_1.Schema({
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
}, {
    collection: 'media'
});
exports.MediaModel = mongoose_1.model('media', MediaSchema);
