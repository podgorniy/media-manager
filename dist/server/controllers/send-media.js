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
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var media_1 = require("../media");
var collection_1 = require("../collection");
var lib_1 = require("../../common/lib");
var urlParse = require('url-parse');
exports.sendMedia = utils_1.asyncHandler(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var fileName, fileUUID, fileExtension, refererUrl, parsedReferred, pathSegments, _, refererCollectionUri, matchedDoc, sharedCollectionsWithThisDoc, mediaIsSharedIndividually, mediaBelongsToRequestedSharedCollection, mediaBelongsToAuthenticatedUser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                fileName = req.params.fileName;
                fileUUID = utils_1.getName(fileName);
                fileExtension = utils_1.getExtension(fileName);
                refererUrl = req.headers.referer || '';
                parsedReferred = urlParse(refererUrl);
                pathSegments = lib_1.getPathSegments(parsedReferred.pathname);
                _ = pathSegments[0], refererCollectionUri = pathSegments[1];
                return [4 /*yield*/, media_1.MediaModel.findOne({
                        uuid: fileUUID,
                        fileExtension: fileExtension
                    })];
            case 1:
                matchedDoc = _a.sent();
                if (!!matchedDoc) return [3 /*break*/, 2];
                return [2 /*return*/, res.status(404).send("Not found or don't have permissions to view")];
            case 2: return [4 /*yield*/, collection_1.CollectionsModel.findOne({
                    media: matchedDoc.uuid,
                    uri: refererCollectionUri,
                    public: true
                })];
            case 3:
                sharedCollectionsWithThisDoc = _a.sent();
                mediaIsSharedIndividually = matchedDoc.sharedIndividually;
                mediaBelongsToRequestedSharedCollection = !!sharedCollectionsWithThisDoc;
                mediaBelongsToAuthenticatedUser = req.isAuthenticated() && req.user._id.toString() === matchedDoc.owner;
                if (mediaIsSharedIndividually || mediaBelongsToRequestedSharedCollection || mediaBelongsToAuthenticatedUser) {
                    return [2 /*return*/, res.sendFile(utils_1.getFilePathForPersistence(media_1.getFileName(matchedDoc), 'upload'))];
                }
                else {
                    return [2 /*return*/, res.status(404).send("Not found or don't have permissions to view")];
                }
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.sendPreview = utils_1.asyncHandler(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var fileName, fileUUID, refererUrl, parsedReferred, pathSegments, _, refererCollectionUri, matchedDoc, sharedCollectionsWithThisDoc, mediaIsSharedIndividually, mediaBelongsToRequestedSharedCollection, mediaBelongsToAuthenticatedUser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                fileName = req.params.fileName;
                fileUUID = utils_1.getName(fileName);
                refererUrl = req.headers.referer || '';
                parsedReferred = urlParse(refererUrl);
                pathSegments = lib_1.getPathSegments(parsedReferred.pathname);
                _ = pathSegments[0], refererCollectionUri = pathSegments[1];
                return [4 /*yield*/, media_1.MediaModel.findOne({
                        uuid: fileUUID
                    })];
            case 1:
                matchedDoc = _a.sent();
                if (!!matchedDoc) return [3 /*break*/, 2];
                return [2 /*return*/, res.status(404).send("Not found or don't have permissions to view")];
            case 2: return [4 /*yield*/, collection_1.CollectionsModel.findOne({
                    media: matchedDoc.uuid,
                    uri: refererCollectionUri,
                    public: true
                })];
            case 3:
                sharedCollectionsWithThisDoc = _a.sent();
                mediaIsSharedIndividually = matchedDoc.sharedIndividually;
                mediaBelongsToRequestedSharedCollection = !!sharedCollectionsWithThisDoc;
                mediaBelongsToAuthenticatedUser = req.isAuthenticated() && req.user._id.toString() === matchedDoc.owner;
                if (mediaIsSharedIndividually || mediaBelongsToRequestedSharedCollection || mediaBelongsToAuthenticatedUser) {
                    if (matchedDoc.hasPreview) {
                        return [2 /*return*/, res.sendFile(utils_1.getFilePathForPersistence(matchedDoc.uuid + '.jpeg', 'preview'))];
                    }
                    else {
                        return [2 /*return*/, res.sendFile(utils_1.getFilePathForPersistence(media_1.getFileName(matchedDoc), 'upload'))];
                    }
                }
                else {
                    return [2 /*return*/, res.status(404).send("Not found or don't have permissions to view")];
                }
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=send-media.js.map