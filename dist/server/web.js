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
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var middleware_1 = require("./middleware");
var routes_1 = require("./routes");
var path = __importStar(require("path"));
var mongoose_1 = require("mongoose");
var env_1 = require("./env");
var utils_1 = require("./utils");
var user_1 = require("./models/user");
var lib_1 = require("../common/lib");
function createDefaultUser() {
    return __awaiter(this, void 0, void 0, function () {
        var DEFAULT_USERNAME, DEFAULT_PASSWORD, defaultUser, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    DEFAULT_USERNAME = 'user';
                    DEFAULT_PASSWORD = '123';
                    return [4 /*yield*/, user_1.UserModel.findOne({ name: DEFAULT_USERNAME })];
                case 1:
                    defaultUser = _c.sent();
                    if (!!defaultUser) return [3 /*break*/, 3];
                    _a = user_1.UserModel.bind;
                    _b = {
                        name: DEFAULT_USERNAME
                    };
                    return [4 /*yield*/, utils_1.hashString(DEFAULT_PASSWORD)];
                case 2: return [2 /*return*/, new (_a.apply(user_1.UserModel, [void 0, (_b.password = _c.sent(),
                            _b)]))().save()];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function startServer() {
    return __awaiter(this, void 0, void 0, function () {
        var app;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app = express();
                    app.set('view engine', 'pug');
                    app.set('views', path.resolve(__dirname, '../', 'server-views'));
                    return [4 /*yield*/, mongoose_1.connect(env_1.MONGO_URL, 
                        // @ts-ignore
                        { useNewUrlParser: true })
                        // Create user
                    ];
                case 1:
                    _a.sent();
                    if (!lib_1.isDev()) return [3 /*break*/, 3];
                    return [4 /*yield*/, createDefaultUser()];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    middleware_1.initMiddleware(app);
                    routes_1.initRoutes(app);
                    app.listen(env_1.WEB_PORT);
                    console.log("App started at http://localhost:" + env_1.WEB_PORT);
                    return [2 /*return*/];
            }
        });
    });
}
exports.startServer = startServer;
