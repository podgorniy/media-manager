"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isDev() {
    return process.env.NODE_ENV !== 'production';
}
exports.isDev = isDev;
function getPathSegments(path) {
    path = path.replace(/^\/*|\/*$/g, '');
    path = path.replace(/\/{2,}/g, '/');
    return path.split('/');
}
exports.getPathSegments = getPathSegments;
//# sourceMappingURL=lib.js.map