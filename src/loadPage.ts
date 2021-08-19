import path from 'path'
import fsp from 'fs/promises'
import axios from 'axios'
import 'axios-debug-log'
import debug from 'debug'
import Listr from 'listr'

import * as utils from './utils'

const log = debug('page-loader')

const loadPage = (urlStr: string, dirName: string): Promise<string> => {
    const url = utils.parseUrlFromString(urlStr)

    const htmlName = utils.parseUrlName(url, '.html')
    const htmlPath = path.join(dirName, htmlName)
    const assetsDirName = utils.parseUrlName(url, '_files')
    const assetsDirPath = path.join(dirName, assetsDirName)

    let assetsList: IAsset[]

    const promise = fsp.mkdir(dirName, { recursive: true })
        .then(() => log('Directory has beed created at path:', dirName))
        .then(() => axios.get(url.href))
        .then((response) => {
            const { data: html } = response
            const meta = utils.handleAssets(html, url, assetsDirName)
            assetsList = meta.assetsList

            log('Assets list:', assetsList.map(({ uri }) => uri.href))

            return fsp.writeFile(htmlPath, meta.newHtml, 'utf-8')
        })
        .then(() => log('Html has beed downloaded from:', url.href, '\nTo path:', htmlPath))
        .then(() => fsp.mkdir(assetsDirPath))
        .then(() => log('Assets directory has been created at path:', assetsDirPath))
        .then(() => {
            const tasks = new Listr(assetsList.map((asset) => {
                const title = asset.uri.href
                const task = () => utils.loadAsset(asset, dirName)

                return { title, task }
            }))

            return tasks.run()
        })
        .then(() => htmlPath)

    return promise
}

export default loadPage
