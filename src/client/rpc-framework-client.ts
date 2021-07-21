const axios = require('axios')

export type IRpcClient<T> = Record<keyof T, (params?: any) => Promise<any>>

export function createRpcClient<T>(config: T): IRpcClient<T> {
    return Object.keys(config).reduce(
        (res, methodName) => {
            res[methodName] = async function(params) {
                let resp = await axios({
                    method: 'post',
                    url: '/rpc',
                    data: {
                        method: methodName, // TODO: validate properly according to config
                        params: params
                    }
                })
                if (resp.data.success) {
                    return resp.data.data // TODO: validate properly according to config
                } else {
                    throw Error(`RPC failed: ${resp.data.reason}`)
                }
            }
            return res
        },
        {} as IRpcClient<T>
    )
}
