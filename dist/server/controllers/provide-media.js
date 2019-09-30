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
var DEFAULT_LIMIT = 20;
var MAX_LIMIT = 100;
exports.provideMedia = utils_1.asyncHandler(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, skip, limit, tags, collectionUri, intLimit, normalizedCount, querySkipItems, isAuthenticated, queryLimitItems, query, matchingCollection, itemsCountForQuery, canProvideMoreItems, userMediaItems, respData, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.query, skip = _a.skip, limit = _a.limit, tags = _a.tags, collectionUri = _a.collectionUri;
                intLimit = parseInt(limit);
                normalizedCount = !intLimit || intLimit <= 0 ? DEFAULT_LIMIT : intLimit;
                querySkipItems = parseInt(skip) || 0;
                isAuthenticated = req.isAuthenticated();
                queryLimitItems = void 0;
                if (normalizedCount > MAX_LIMIT) {
                    // impose max limit rule for non-authenticated users only
                    queryLimitItems = isAuthenticated ? normalizedCount : MAX_LIMIT;
                }
                else {
                    queryLimitItems = normalizedCount;
                }
                query = {};
                if (req.isAuthenticated()) {
                    query.owner = req.user._id;
                }
                if (tags && tags.length) {
                    query.tags = { $all: tags };
                }
                if (!collectionUri) return [3 /*break*/, 2];
                return [4 /*yield*/, collection_1.CollectionsModel.findOne({ uri: collectionUri })];
            case 1:
                matchingCollection = _b.sent();
                if (!matchingCollection) {
                    res.send({
                        success: false,
                        items: []
                    });
                    return [2 /*return*/];
                }
                // non public collections are visible to owners only
                if (!matchingCollection.public && !req.isAuthenticated()) {
                    res.send({
                        success: false,
                        items: []
                    });
                    return [2 /*return*/];
                }
                query.uuid = {
                    $in: matchingCollection.media
                };
                _b.label = 2;
            case 2: return [4 /*yield*/, media_1.MediaModel.find(query).count()];
            case 3:
                itemsCountForQuery = _b.sent();
                canProvideMoreItems = querySkipItems + queryLimitItems < itemsCountForQuery;
                return [4 /*yield*/, media_1.MediaModel.find(query, null, {
                        skip: querySkipItems,
                        limit: queryLimitItems,
                        sort: {
                            created: -1
                        }
                    })];
            case 4:
                userMediaItems = _b.sent();
                respData = {
                    items: userMediaItems.map(media_1.toApiRepresentation),
                    success: true,
                    hasMore: canProvideMoreItems
                };
                res.send(respData);
                return [3 /*break*/, 6];
            case 5:
                err_1 = _b.sent();
                res.send({
                    success: false
                });
                console.error(err_1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=provide-media.js.map