export const parseUrlFromString = (str: string): URL => {
    const re = /^https?:\/\//
    const newStr = re.test(str) ? str : `https://${str}`

    return new URL(newStr)
}

export const parseUrlName = (url: URL, extra = ''): string => {
    const { hostname, pathname } = url
    const delimiter = '-'

    const hn = hostname.split('.').filter(Boolean)
    const pn = decodeURI(pathname).replace(/\.[a-z]+$/, '').split(/_|[^\w]/).filter(Boolean)

    const result = hn.concat(...pn).join(delimiter).concat(extra ?? '')

    return result
}
