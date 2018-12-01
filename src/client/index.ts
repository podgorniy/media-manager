require('./client.less')
import {isDev} from '../common/lib'

if (isDev()) {
    console.log('Welcome dev')
} else {
    console.log('Welcome user')
}
