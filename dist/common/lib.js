"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
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
/**
 * Throttles func to 60 fps. Calls with params passed on latest call
 */
function throttleTo60Fps(func) {
    var _this = this;
    var animationFrameRequested = false;
    var params;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        params = __spreadArrays(args);
        if (!animationFrameRequested) {
            animationFrameRequested = true;
            requestAnimationFrame(function () {
                animationFrameRequested = false;
                func.apply(_this, params); // call with latest params passed
            });
        }
    };
}
exports.throttleTo60Fps = throttleTo60Fps;
//# sourceMappingURL=lib.js.map