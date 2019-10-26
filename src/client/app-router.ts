import { action, observable } from 'mobx'
import { parse, stringify } from 'qs'
import { getPathSegments } from '../common/lib'

const equal = require('deep-equal')
const urlParse = require('url-parse')
import deepmerge = require('deepmerge')
import traverse = require('traverse')
import cloneDeep = require('clone-deep')

function isBrowser(): boolean {
    return typeof window !== 'undefined'
}

interface IModifiers {
    with?: {
        queryParams: {
            tags?: Array<string>
        }
    }
    without?: {
        queryParams: {
            tags?: Array<string>
        }
    }
    replace?: {
        queryParams?: {
            tags?: Array<string>
        }
        pathSegments?: Array<string>
    }
}

export class AppRouter {
    constructor(initialUrl: string) {
        if (isBrowser()) {
            const self = this
            window.addEventListener('hashchange', () => {
                this.urlToState(location.href)
            })
            window.addEventListener('popstate', () => {
                this.urlToState(location.href)
            })
            const pushState = history.pushState
            history.pushState = function() {
                setTimeout(() => {
                    self.urlToState(location.href)
                })
                return pushState.apply(this, arguments)
            }
            const replaceState = history.replaceState
            history.replaceState = function() {
                setTimeout(() => {
                    self.urlToState(location.href)
                })
                return replaceState.apply(this, arguments)
            }
        }
        // TODO: figure out why timeout
        setTimeout(() => {
            this.urlToState(initialUrl)
        })
    }

    @action
    urlToState(newUrl: string) {
        const parsed = urlParse(newUrl)
        const protocol = parsed.protocol.replace(/:/g, '')
        const maybePort = parseInt(parsed.port)
        const port = maybePort ? maybePort : {http: 80, https: 443}[protocol]
        const queryString = parsed.query.replace('?', '')
        const hash = parsed.hash.replace('#', '')
        this.assignIfNotEqual('domain', parsed.hostname)
        this.assignIfNotEqual('port', port)
        this.assignIfNotEqual('protocol', protocol)
        // this.assignIfNotEqual('path', parsed.pathname)
        this.assignIfNotEqual('queryString', queryString)
        this.assignIfNotEqual('hash', hash)
        this.assignIfNotEqual('pathSegments', getPathSegments(parsed.pathname))
        this.assignIfNotEqual('queryParams', parse(decodeURIComponent(queryString)))
    }

    @action
    assignIfNotEqual<T>(propName, propValue: T) {
        if (!equal(this[propName], propValue)) {
            this[propName] = propValue
        }
    }

    @observable
    domain: string = ''

    @observable
    port: number | null = null

    @observable
    protocol: string = ''

    @observable
    queryString: string = ''

    @observable
    hash: string = ''

    @observable
    pathSegments: Array<string> = []

    @observable
    queryParams: {[key: string]: any} = {}

    // TODO: think about extracting to a separate lib
    getFullUrl(modifiers: IModifiers): string {
        let newQueryParams = Object.assign({}, cloneDeep(this.queryParams))
        if (modifiers.with && modifiers.with.queryParams) {
            newQueryParams = deepmerge(newQueryParams, modifiers.with.queryParams)
        }
        // TODO: Superugly. Rethink
        if (modifiers.without && modifiers.without.queryParams) {
            newQueryParams = traverse(newQueryParams).map(function(value) {
                for (let key in modifiers.without.queryParams) {
                    if (this.path[0] === key) {
                        let valuesToExclude = modifiers.without.queryParams[key]

                        if (this.path.length === 1 && Array.isArray(value)) {
                            if (value.every((v) => valuesToExclude.indexOf(v) !== -1)) {
                                this.delete()
                            }
                        }
                        if (Array.isArray(valuesToExclude)) {
                            if (valuesToExclude.indexOf(value) !== -1) {
                                this.delete()
                            }
                        }
                    }
                }
            })
        }

        if (modifiers.replace && modifiers.replace.queryParams) {
            newQueryParams = Object.assign({}, newQueryParams, modifiers.replace.queryParams)
        }

        let urlPathSegments = this.pathSegments
        if (modifiers.replace && modifiers.replace.pathSegments) {
            urlPathSegments = modifiers.replace.pathSegments
        }

        let res = `${this.protocol}://${this.domain}`
        if (this.port !== 80 && this.port !== 443) {
            res += ':' + this.port
        }
        res = res + '/' + urlPathSegments.join('/')
        if (Object.keys(newQueryParams).length) {
            res +=
                '?' +
                stringify(newQueryParams, {
                    arrayFormat: 'brackets'
                })
        }
        if (this.hash) {
            res += '#' + this.hash
        }
        return res
    }

    replaceUrl(newUrl: string) {
        history.replaceState({}, document.title, newUrl)
    }

    pushUrl(newUrl: string) {
        history.pushState({}, document.title, newUrl)
    }
}
