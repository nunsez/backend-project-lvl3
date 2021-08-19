import axios from 'axios'
import 'axios-debug-log'
import path from 'path'
import fsp from 'fs/promises'
import cheerio from 'cheerio'
import Listr, { ListrContext } from 'listr'

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

const loadAsset = (asset: IAsset, dirName: string): Promise<void> => axios
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

type TagKey = keyof typeof tagSourceMap
type TagAttrib = typeof tagSourceMap[TagKey]

const handleAssets = (htmlContent: string, url: URL, assetsDirName: string)
: [string, IAsset[]] => {
    const $ = cheerio.load(htmlContent)
    const assetsList: IAsset[] = []
    const entries = Object.entries(tagSourceMap) as [TagKey, TagAttrib][]

    entries.forEach(([tagName, attrName]) => {
        $(tagName).each((_, el) => {
            const route = $(el).attr(attrName)

            if (!route) return

            let ext = '.html'
            ext = path.extname(route) || ext

            const uri = new URL(route, url)
            const assetName = parseUrlName(uri, ext)
            const assetPath = path.join(assetsDirName, assetName)

            if (uri.hostname === url.hostname) {
                assetsList.push({ uri, path: assetPath })
                $(el).attr(attrName, assetPath)
            }
        })
    })

    return [$.html(), assetsList]
}

export const loadHtml = (url: URL, rootDirName: string)
: Promise<[string, IAsset[]]> => axios.get(url.href).then((response) => {
    const { data: html } = response

    const htmlFileName = parseUrlName(url, '.html')
    const htmlFilePath = path.join(rootDirName, htmlFileName)
    const assetsDirName = parseUrlName(url, '_files')

    const [newHtml, assetsList] = handleAssets(html, url, assetsDirName)

    return fsp.writeFile(htmlFilePath, newHtml, 'utf-8')
        .then(() => [assetsDirName, assetsList])
})

export const getTasksFromAssets = (assetsList: IAsset[], rootDirName: string)
: Listr<ListrContext> => {
    const tasks = new Listr(assetsList.map((asset) => {
        const title = asset.uri.href
        const task = () => loadAsset(asset, rootDirName)

        return { title, task }
    }))

    return tasks
}
