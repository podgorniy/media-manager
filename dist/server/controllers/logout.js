"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function logout(req, res) {
    req.logout();
    res.json({
        success: true
    });
}
exports.logout = logout;
//# sourceMappingURL=logout.js.map