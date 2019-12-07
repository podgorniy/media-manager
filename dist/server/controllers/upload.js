"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var media_1 = require("../media");
var path = __importStar(require("path"));
var mime_1 = require("mime");
var fluent_ffmpeg_1 = require("fluent-ffmpeg");
var util_1 = require("util");
var sizeOf = require("image-size");
var sharp = require("sharp");
var md5file = require('md5-file/promise');
var uuidv4 = require('uuid/v4');
var fs = require('fs-extra');
var KNOWN_TYPES = {
    img: ['image/gif', 'image/jpeg', 'image/png', 'image/svg+xml'],
    video: ['video/x-ms-wmv', 'video/x-msvideo', 'video/mp4', 'video/x-flv']
};
function getTypeOfDoc(mimeType) {
    var i;
    for (i in KNOWN_TYPES) {
        if (KNOWN_TYPES[i].some(function (s) { return s === mimeType; })) {
            return i;
        }
    }
    console.error("Unknown mime type " + mimeType);
}
function getTags(extension) {
    var tags = ['new'];
    if (['gif', 'mp4'].indexOf(extension) !== -1) {
        tags.push('animation');
    }
    tags.push(extension);
    return tags;
}
// Returns mongo doc of corresponding file
function registerFile(sourcePath, ownerId) {
    return __awaiter(this, void 0, void 0, function () {
        var md5, sameFileForCurrentUser, uuid, fileExtensionWithDot, fileMimeType, fileType, extension, fileName, fileTargetPath, mediaSize, shouldHavePreview, size, previewFilePath, videoMetaInfo, _a, width, height, tags, docObj, res;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, md5file(sourcePath)];
                case 1:
                    md5 = _b.sent();
                    return [4 /*yield*/, media_1.MediaModel.findOne({
                            owner: ownerId,
                            md5: md5
                        })];
                case 2:
                    sameFileForCurrentUser = _b.sent();
                    if (sameFileForCurrentUser) {
                        return [2 /*return*/, sameFileForCurrentUser];
                    }
                    uuid = uuidv4().replace(/-/g, '');
                    fileExtensionWithDot = path.extname(sourcePath) // with dot
                    ;
                    fileMimeType = mime_1.getType(fileExtensionWithDot);
                    fileType = getTypeOfDoc(fileMimeType);
                    extension = mime_1.getExtension(fileMimeType);
                    fileName = uuid + fileExtensionWithDot;
                    fileTargetPath = utils_1.getFilePathForPersistence(fileName, 'upload');
                    mediaSize = {
                        width: 0,
                        height: 0
                    };
                    shouldHavePreview = false;
                    return [4 /*yield*/, fs.copy(sourcePath, fileTargetPath)];
                case 3:
                    _b.sent();
                    if (!(fileType === 'img')) return [3 /*break*/, 6];
                    size = sizeOf(sourcePath);
                    mediaSize.width = size.width;
                    mediaSize.height = size.height;
                    shouldHavePreview = (mediaSize.width > THUMBNAIL_WIDTH) || (extension === 'gif');
                    previewFilePath = path.resolve(utils_1.THUMBNAILS_FOLDER_PATH, uuid + '.jpeg');
                    if (!shouldHavePreview) return [3 /*break*/, 5];
                    return [4 /*yield*/, generateThumbnail({ sourceFilePath: fileTargetPath, thumbnailFilePath: previewFilePath })];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5: return [3 /*break*/, 8];
                case 6:
                    if (!(fileType === 'video')) return [3 /*break*/, 8];
                    return [4 /*yield*/, util_1.promisify(fluent_ffmpeg_1.ffprobe)(sourcePath)];
                case 7:
                    videoMetaInfo = _b.sent();
                    _a = videoMetaInfo.streams[0], width = _a.width, height = _a.height;
                    mediaSize.width = width;
                    mediaSize.height = height;
                    _b.label = 8;
                case 8:
                    tags = getTags(extension);
                    docObj = {
                        owner: ownerId,
                        uuid: uuid,
                        fileExtension: extension,
                        md5: md5,
                        type: fileType,
                        tags: tags,
                        sharedIndividually: false,
                        width: mediaSize.width,
                        height: mediaSize.height,
                        hasPreview: shouldHavePreview
                    };
                    res = new media_1.MediaModel(docObj);
                    return [4 /*yield*/, res.save()];
                case 9:
                    _b.sent();
                    return [2 /*return*/, res];
            }
        });
    });
}
var THUMBNAIL_WIDTH = 350;
function generateThumbnail(params) {
    return __awaiter(this, void 0, void 0, function () {
        var sourceFilePath, thumbnailFilePath;
        return __generator(this, function (_a) {
            sourceFilePath = params.sourceFilePath, thumbnailFilePath = params.thumbnailFilePath;
            return [2 /*return*/, sharp(sourceFilePath)
                    .resize(THUMBNAIL_WIDTH)
                    .toFile(thumbnailFilePath)];
        });
    });
}
exports.upload = utils_1.asyncHandler(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var filesMongoDocs, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Promise.all(req.files.map(function (file) {
                        return registerFile(file.path, req.user._id);
                    }))];
            case 1:
                filesMongoDocs = _a.sent();
                res.json({
                    success: true,
                    files: filesMongoDocs
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                res.json({
                    success: false,
                    reason: error_1.toString()
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=upload.js.map