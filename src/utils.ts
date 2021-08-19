import axios from 'axios'
import 'axios-debug-log'
import path from 'path'
import fsp from 'fs/promises'
import cheerio from 'cheerio'

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

export const loadAsset = (asset: IAsset, dirName: string) => axios
    .get(asset.uri.href, { responseType: 'arraybuffer' })
    .then(({ data }) => {
        const assetPath = path.join(dirName, asset.path)

        return fsp.writeFile(assetPath, data)
    })

const tagSourceMap = {
    img: 'src',
    link: 'href',
    script: 'src',
} as const

export const handleAssets = (html: string, url: URL, assetsDirName: string) => {
    const $ = cheerio.load(html)
    const assetsList: IAsset[] = []
    const tags = Object.keys(tagSourceMap) as (keyof typeof tagSourceMap)[]

    tags.forEach((tag) => {
        $(tag).each((_, el) => {
            const sourceAttrName = tagSourceMap[tag]
            const route = $(el).attr(sourceAttrName)

            if (!route) return

            let ext = '.html'
            ext = path.extname(route) || ext

            const uri = new URL(route, url)
            const assetName = parseUrlName(uri, ext)
            const assetPath = path.join(assetsDirName, assetName)

            if (uri.hostname === url.hostname) {
                assetsList.push({ uri, path: assetPath })
                $(el).attr(sourceAttrName, assetPath)
            }
        })
    })

    return { newHtml: $.html(), assetsList }
}
