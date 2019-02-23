export function objToQueryString(obj: Object): string {
    let res = ''
    for (let key in obj) {
        if (res) {
            res += '&'
        }
        res = res + (encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
    }
    return res
}
