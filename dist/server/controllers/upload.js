"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var media_1 = require("../media");
var path = __importStar(require("path"));
var md5file = require('md5-file/promise');
var uuidv4 = require('uuid/v4');
var fs = require('fs-extra');
// Returns mongo doc of corresponding file
function registerFile(sourcePath, ownerId) {
    return __awaiter(this, void 0, void 0, function () {
        var md5, sameFileForCurrentUser, uuid, fileExtensionWithDot, fileExtensionWithoutDot, fileName, fileTargetPath, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, md5file(sourcePath)];
                case 1:
                    md5 = _a.sent();
                    return [4 /*yield*/, media_1.MediaModel.findOne({
                            owner: ownerId,
                            md5: md5
                        })];
                case 2:
                    sameFileForCurrentUser = _a.sent();
                    if (sameFileForCurrentUser) {
                        return [2 /*return*/, sameFileForCurrentUser];
                    }
                    uuid = uuidv4();
                    fileExtensionWithDot = path.extname(sourcePath) // with dot
                    ;
                    fileExtensionWithoutDot = utils_1.trimDot(fileExtensionWithDot);
                    fileName = uuid + fileExtensionWithDot;
                    fileTargetPath = utils_1.filePathForPersistence(fileName);
                    return [4 /*yield*/, fs.copy(sourcePath, fileTargetPath)];
                case 3:
                    _a.sent();
                    res = new media_1.MediaModel({
                        owner: ownerId,
                        uuid: uuid,
                        fileExtension: fileExtensionWithoutDot,
                        md5: md5
                    });
                    return [4 /*yield*/, res.save()];
                case 4:
                    _a.sent();
                    return [2 /*return*/, res];
            }
        });
    });
}
exports.upload = utils_1.asyncHandler(function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var filesMongoDocs;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.all(req.files.map(function (file) {
                    return registerFile(file.path, req.user._id);
                }))];
            case 1:
                filesMongoDocs = _a.sent();
                res.json({
                    success: true,
                    files: filesMongoDocs
                });
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=upload.js.map