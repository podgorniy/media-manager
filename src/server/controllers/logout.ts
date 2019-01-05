export function logout(req, res) {
    req.logout()
    res.json({
        success: true
    })
}