export function check(req, res) {
    res.json({
        user: req.user
    })
}