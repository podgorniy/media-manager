"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isDev() {
    return process.env.NODE_ENV !== 'production';
}
exports.isDev = isDev;
exports.KNOWN_TYPES = {
    img: ['image/gif', 'image/jpeg', 'image/png', 'image/svg+xml'],
    video: ['video/x-ms-wmv', 'video/x-msvideo', 'video/mp4', 'video/x-flv']
};
function getTypeOfDoc(mimeType) {
    var i;
    for (i in exports.KNOWN_TYPES) {
        if (exports.KNOWN_TYPES[i].some(function (s) { return s === mimeType; })) {
            return i;
        }
    }
    console.error("Unknown mime type " + mimeType);
}
exports.getTypeOfDoc = getTypeOfDoc;
//# sourceMappingURL=lib.js.map