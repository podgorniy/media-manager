import {asyncHandler} from './utils'

export function createRpcProvider(rpcConfig, serverImplementation) {
    const configMethods = Object.keys(rpcConfig)
    const serverMethods = Object.keys(serverImplementation)
    const notImplementedMethods = configMethods.filter((m) => serverMethods.indexOf(m) === -1)
    if (notImplementedMethods.length) {
        throw new Error(
            `Not all config methods are implemented by server: ${notImplementedMethods.join(',')}. Terminating`
        )
    }
    return asyncHandler(async (req, res) => {
        const {method, params} = req.body
        const methodConfig = rpcConfig[method]
        if (!methodConfig) {
            res.json({
                success: false,
                reason: `Unrecognized RPC method ${method}`
            })
            return
        }
        if (methodConfig.authRequired && !req.isAuthenticated()) {
            res.json({
                success: false,
                reason: `User is not authenticated`
            })
            return
        }
        try {
            const result = await serverImplementation[method](params, req)
            res.json({
                success: true,
                data: result
            })
        } catch (err) {
            res.json({
                success: false,
                reason: `Server error: ${(err.essage || err).toString()}`
            })
        }
    })
}
