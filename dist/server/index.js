"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var web_1 = require("./web");
web_1.startServer().catch(function (err) {
    console.error(err);
});
