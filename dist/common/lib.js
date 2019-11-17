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
// copy from mdn: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.getRandomIntInclusive = getRandomIntInclusive;
//# sourceMappingURL=lib.js.map