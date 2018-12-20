import {NODE_ENV} from './config'

export function isDev() {
    return NODE_ENV !== 'production'
}
