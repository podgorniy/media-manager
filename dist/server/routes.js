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
var utils_1 = require("./utils");
var upload_1 = require("./controllers/upload");
var uploader_1 = require("./uploader");
var send_media_1 = require("./controllers/send-media");
var logout_1 = require("./controllers/logout");
var check_1 = require("./controllers/check");
var provide_media_1 = require("./controllers/provide-media");
var provide_tags_1 = require("./controllers/provide-tags");
var add_tags_1 = require("./controllers/add-tags");
var remove_tags_1 = require("./controllers/remove-tags");
var provide_collections_1 = require("./controllers/provide-collections");
var add_to_collection_1 = require("./controllers/add-to-collection");
var create_collection_1 = require("./controllers/create-collection");
var remove_from_collection_1 = require("./controllers/remove-from-collection");
var delete_collection_1 = require("./controllers/delete-collection");
var rename_collection_1 = require("./controllers/rename-collection");
var share_media_1 = require("./controllers/share-media");
var un_share_media_1 = require("./controllers/un-share-media");
var share_collection_1 = require("./controllers/share-collection");
var un_share_collection_1 = require("./controllers/un-share-collection");
var checkCollection_1 = require("./controllers/checkCollection");
var update_collection_1 = require("./controllers/update-collection");
var passport = require('passport');
// https://stackoverflow.com/a/47448486
// declare global {
//     namespace Express {
//         interface Request {
//             user?: IUserFields
//         }
//
//         interface Response {
//             locals: {
//                 initialState: IAppInitialState
//             }
//         }
//     }
// }
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        res.status(401).json({
            success: false,
            reason: 'unauthorized'
        });
    }
}
function initRoutes(app) {
    var _this = this;
    app.post('/api/v1/login', passport.authenticate('local'), function (req, res) {
        res.send({
            success: true,
            userName: req.user.name
        });
    });
    app.post('/api/v1/logout', logout_1.logout);
    app.post('/api/v1/upload', isAuthenticated, uploader_1.uploader.array('uploads'), upload_1.upload);
    app.get('/api/v1/check', isAuthenticated, check_1.check);
    app.get('/api/v1/media', provide_media_1.provideMedia);
    app.get('/api/v1/tags', isAuthenticated, provide_tags_1.provideTags);
    app.post('/api/v1/add-tags', isAuthenticated, add_tags_1.addTags);
    app.patch('/api/v1/remove-tags', isAuthenticated, remove_tags_1.removeTags);
    app.get('/api/v1/collections', isAuthenticated, provide_collections_1.provideCollections);
    app.post('/api/v1/create-collection', isAuthenticated, create_collection_1.createCollection);
    app.post('/api/v1/rename-collection', isAuthenticated, rename_collection_1.renameCollection);
    app.post('/api/v1/delete-collection', isAuthenticated, delete_collection_1.deleteCollection);
    app.post('/api/v1/add-to-collection', isAuthenticated, add_to_collection_1.addToCollection);
    app.post('/api/v1/remove-from-collection', isAuthenticated, remove_from_collection_1.removeFromCollection);
    app.post('/api/v1/update-collection', isAuthenticated, update_collection_1.updateCollection);
    app.post('/api/v1/share-media', isAuthenticated, share_media_1.shareMedia);
    app.post('/api/v1/un-share-media', isAuthenticated, un_share_media_1.unShareMedia);
    app.post('/api/v1/share-collection', isAuthenticated, share_collection_1.shareCollection);
    app.post('/api/v1/un-share-collection', isAuthenticated, un_share_collection_1.unShareCollection);
    app.get('/api/v1/check-collection', checkCollection_1.checkCollection);
    app.get('/m/:fileName', send_media_1.sendMedia);
    app.get('*', utils_1.asyncHandler(function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            res.locals.title = 'Media Manager';
            res.locals.isAuthenticated = !!req.user;
            res.render('default');
            return [2 /*return*/];
        });
    }); }));
}
exports.initRoutes = initRoutes;
//# sourceMappingURL=routes.js.map