"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = __importStar(require("express"));
var path = __importStar(require("path"));
var passport_1 = require("./passport");
var lib_1 = require("../common/lib");
var session = require("express-session");
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var connectMongo = require('connect-mongo');
var MongoStore = connectMongo(session);
function initMiddleware(app) {
    app.use(express.static(path.resolve(__dirname, '../static')));
    app.use(function (req, res, next) {
        if (lib_1.isDev()) {
            setTimeout(next, Math.random() * 999 + 500); // 500 - 1500ms of delay
        }
        else {
            next();
        }
    });
    app.use(session({
        // Session will persist on server restarts during development
        // and will reset on every production restart
        secret: lib_1.isDev() ? '123' : Math.random().toString(),
        store: new MongoStore({
            mongooseConnection: mongoose.connection,
            collection: 'sessions'
        }),
        resave: true,
        saveUninitialized: false,
        cookie: {
            // TODO: figure out
            // secure: !isDev()
            secure: false
        }
    }));
    app.use(bodyParser.json());
    passport_1.configurePassport(app);
}
exports.initMiddleware = initMiddleware;
//# sourceMappingURL=middleware.js.map