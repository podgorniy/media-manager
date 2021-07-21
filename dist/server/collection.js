"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var CollectionSchema = new mongoose_1.Schema({
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
    },
    publicPassword: {
        type: String,
        required: false
    }
}, {
    collection: 'collections'
});
exports.CollectionsModel = mongoose_1.model('collections', CollectionSchema);
//# sourceMappingURL=collection.js.map