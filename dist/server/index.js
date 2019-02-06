"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
require('source-map-support').install();
var web_1 = require("./web");
web_1.startServer().catch(function (err) {
    console.error(err);
});
//# sourceMappingURL=index.js.map