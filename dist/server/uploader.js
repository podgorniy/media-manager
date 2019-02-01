"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var os = __importStar(require("os"));
var mime_1 = require("mime");
var multer = require("multer");
function genRandomName(ext) {
    return (Math.random()
        .toString()
        .split('.')[1] +
        '-' +
        Date.now() +
        '.' +
        ext);
}
var multerDiskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, os.tmpdir());
    },
    filename: function (req, file, cb) {
        var ext = mime_1.getExtension(file.mimetype); // without dot
        cb(null, genRandomName(ext));
    }
});
exports.uploader = multer({
    storage: multerDiskStorage
});
