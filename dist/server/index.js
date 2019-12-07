"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
require('source-map-support').install();
var fs = __importStar(require("fs-extra"));
var utils_1 = require("./utils");
var web_1 = require("./web");
fs.ensureDirSync(utils_1.MEDIA_FOLDER_PATH);
fs.ensureDirSync(utils_1.THUMBNAILS_FOLDER_PATH);
web_1.startServer().catch(function (err) {
    console.error(err);
});
//# sourceMappingURL=index.js.map