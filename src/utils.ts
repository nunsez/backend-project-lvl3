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

export const loadHtml = (url: URL, rootDirName: string)
: Promise<[string, IAsset[]]> => axios.get(url.href).then((response) => {
    const { data: html } = response

    const htmlFileName = parseUrlName(url, '.html')
    const htmlFilePath = path.join(rootDirName, htmlFileName)
    const assetsDirName = parseUrlName(url, '_files')

    const { newHtml, assetsList } = handleAssets(html, url, assetsDirName)

    //

    return fsp.writeFile(htmlFilePath, newHtml, 'utf-8').then(() => [assetsDirName, assetsList])
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

export const loadAsset = (asset: IAsset, dirName: string): Promise<void> => axios
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

export const handleAssets = (htmlContent: string, url: URL, assetsDirName: string)
: { newHtml: string, assetsList: IAsset[] } => {
    const $ = cheerio.load(htmlContent)
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
