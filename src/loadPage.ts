import path from 'path'
import fsp from 'fs/promises'
import axios from 'axios'
import cheerio from 'cheerio'

import { parseUrlFromString, parseUrlName } from './utils'

interface IAsset {
    route: string
    uri: URL
    path: string
}

const loadAsset = (dirName: string) => (asset: IAsset) => axios
    .get(asset.uri.href, { responseType: 'arraybuffer' })
    .then(({ data }) => {
        const assetPath = path.join(dirName, asset.path)
        console.log(asset.uri)

        return fsp.writeFile(assetPath, data)
    })

const handleAssets = (
    html: string, url: URL, htmlName: string, assetsDirName: string,
): [string, IAsset[]] => {
    const routes: string[] = []
    const $ = cheerio.load(html)
    let newHtml = html

    $('img').each((_, el) => {
        const { src } = (el as cheerio.TagElement).attribs
        routes.push(src)
    })
    console.log($.html())

    const assetsList: IAsset[] = routes.map((route) => {
        const ext = path.extname(route)
        const uri = new URL(route, url)
        const assetName = parseUrlName(uri, ext)
        const assetPath = path.join(assetsDirName, assetName)

        return { route, uri, path: assetPath }
    })

    assetsList.forEach((asset) => {
        newHtml = newHtml.replace(asset.route, asset.path)
    })

    return [newHtml, assetsList]
}

const loadPage = (urlStr: string, dirName: string): Promise<string> => {
    const url = parseUrlFromString(urlStr)

    const htmlName = parseUrlName(url, '.html')
    const htmlPath = path.join(dirName, htmlName)
    const assetsDirName = parseUrlName(url, '_files')
    const assetsDirPath = path.join(dirName, assetsDirName)

    let newHtml: string
    let assetsList: IAsset[]

    const promise = axios.get(url.href)
        .then((response) => {
            const { data: html } = response;
            [newHtml, assetsList] = handleAssets(html, url, htmlName, assetsDirName)

            return fsp.writeFile(htmlPath, newHtml, 'utf-8')
        })
        .then(() => fsp.mkdir(assetsDirPath))
        .then(() => {
            const promises = assetsList.map(loadAsset(dirName))
            return Promise.all(promises)
        })
        .then(() => htmlPath)

    return promise
}

export default loadPage
