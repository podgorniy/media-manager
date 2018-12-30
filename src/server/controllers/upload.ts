import {asyncHandler} from '../utils'

export const upload = asyncHandler(async (req, res) => {
    console.log(req.files) // provided by uploader.ts
    res.json({
        success: true
    })
})
