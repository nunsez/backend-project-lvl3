import path from 'path'
import fsp from 'fs/promises'
import axios from 'axios'
import cheerio from 'cheerio'

import { parseUrlFromString, parseUrlName } from './utils'

interface IAsset {
    uri: URL;
    path: string;
}

const loadAsset = (dirName: string) => (asset: IAsset) => axios
    .get(asset.uri.href, { responseType: 'arraybuffer' })
    .then(({ data }) => {
        const assetPath = path.join(dirName, asset.path)
        console.log(asset.uri.href)

        return fsp.writeFile(assetPath, data)
    })

const handleAssets = (html: string, url: URL, assetsDirName: string) => {
    const $ = cheerio.load(html)
    const assetsList: IAsset[] = []
    const tagSourceMap = {
        img: 'src',
        link: 'href',
        script: 'src',
    } as const

    const tags = Object.keys(tagSourceMap) as (keyof typeof tagSourceMap)[]

    tags.forEach((tag) => {
        $(tag).each((_, el) => {
            const sourceAttrName = tagSourceMap[tag]
            const { [sourceAttrName]: route } = (el as cheerio.TagElement).attribs

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

    const newHtml = $.html()

    return { newHtml, assetsList }
}

const loadPage = (urlStr: string, dirName: string): Promise<string> => {
    const url = parseUrlFromString(urlStr)

    const htmlName = parseUrlName(url, '.html')
    const htmlPath = path.join(dirName, htmlName)
    const assetsDirName = parseUrlName(url, '_files')
    const assetsDirPath = path.join(dirName, assetsDirName)

    let assetsList: IAsset[]

    const promise = axios.get(url.href)
        .then((response) => {
            const { data: html } = response
            const meta = handleAssets(html, url, assetsDirName)
            assetsList = meta.assetsList

            return fsp.writeFile(htmlPath, meta.newHtml, 'utf-8')
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
