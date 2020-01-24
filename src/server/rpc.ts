import {Express} from 'express'
import {RPCConfig} from '../common/rpc'
import {createRpcProvider} from './rpc-framework-server'
import {MediaModel} from './media'
import {CollectionsModel} from './collection'

export function initRpc(app: Express) {
    const rpcHandler = createRpcProvider(new RPCConfig(), {
        deleteMedia: async (uuids, req) => {
            const userId = req.user._id
            if (!userId) {
                throw Error(`No user id`)
            }
            const mediaBelongingToUser = await MediaModel.find({
                owner: userId,
                uuid: {
                    $in: uuids
                }
            })
            if (mediaBelongingToUser.length !== uuids.length) {
                throw Error(`Can't delete list of provided media. Not all items are found belonging to user`)
            }
            await CollectionsModel.update(
                {
                    owner: userId
                },
                {
                    $pull: {
                        media: {
                            $in: uuids
                        }
                    }
                }
            )
            await MediaModel.deleteMany({
                owner: userId,
                uuid: {
                    $in: uuids
                }
            })
            // TODO: consider deleting files on fs
        },
        ping: async (timeStamp) => {
            return Date.now() - timeStamp
        }
    })
    app.post('/rpc', rpcHandler)
}
