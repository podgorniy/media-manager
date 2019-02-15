"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isDev() {
    return process.env.NODE_ENV !== 'production';
}
exports.isDev = isDev;
function getType(url) {
    if (/mp4|qt/.test(url)) {
        return 'video';
    }
    else {
        return 'img';
    }
}
exports.getType = getType;
//# sourceMappingURL=lib.js.map