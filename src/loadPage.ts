import path from 'path'
import fsp from 'fs/promises'
import axios from 'axios'
import 'axios-debug-log'
import cheerio from 'cheerio'
import debug from 'debug'

import { parseUrlFromString, parseUrlName } from './utils'

const log = debug('page-loader')

interface IAsset {
    uri: URL;
    path: string;
}

const loadAsset = (dirName: string) => (asset: IAsset) => axios
    .get(asset.uri.href, { responseType: 'arraybuffer' })
    .then(({ data }) => {
        const assetPath = path.join(dirName, asset.path)
        console.log(asset.uri.href)
        log('Asset path:', assetPath)

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

    const promise = fsp.mkdir(dirName, { recursive: true })
        .then(() => log('Directory has beed created at path:', dirName))
        .then(() => axios.get(url.href))
        .then((response) => {
            const { data: html } = response
            const meta = handleAssets(html, url, assetsDirName)
            assetsList = meta.assetsList

            log('Assets list:', assetsList.map(({ uri }) => uri.href))

            return fsp.writeFile(htmlPath, meta.newHtml, 'utf-8')
        })
        .then(() => log('Html has beed downloaded from:', url.href, '\nTo path:', htmlPath))
        .then(() => fsp.mkdir(assetsDirPath))
        .then(() => log('Assets directory has been created at path:', assetsDirPath))
        .then(() => {
            const promises = assetsList.map(loadAsset(dirName))
            return Promise.all(promises)
        })
        .then(() => htmlPath)

    return promise
}

export default loadPage
