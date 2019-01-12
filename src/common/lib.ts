import {NODE_ENV} from './env'

export function isDev() {
    return NODE_ENV !== 'production'
}
