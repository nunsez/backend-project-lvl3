const parseUrlName = (str: string) => {
    const delimiter = '-'
    const decoded = decodeURI(str)

    const pureStr = decoded
        .replace(/^https?:\/\//, '')
        .replace(/.html$/, '')

    const result = pureStr.split(/_|[^\w]/).filter(Boolean)

    return result.join(delimiter).concat('.html')
}

export default parseUrlName
