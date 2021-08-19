import path from 'path'
import fsp from 'fs/promises'
import debug from 'debug'

import * as utils from './utils'

const log = debug('page-loader')

const loadPage = (urlStr: string, rootDirName: string): Promise<string> => {
    const url = utils.parseUrlFromString(urlStr)
    const htmlName = utils.parseUrlName(url)
    const htmlPath = path.join(rootDirName, htmlName)

    let assetsDirName: string
    let assetsDirPath: string
    let assetsList: IAsset[]

    return utils.loadHtml(url, rootDirName)
        .then((meta) => {
            [assetsDirName, assetsList] = meta
            assetsDirPath = path.join(rootDirName, assetsDirName)

            log('Html has beed downloaded from:', url.href, '\nTo path:', htmlPath)
            log('Assets list:', assetsList.map(({ uri }) => uri.href))
        })
        .then(() => fsp.mkdir(assetsDirPath))
        .then(() => log('Assets directory has been created at path:', assetsDirPath))
        .then(() => utils.getTasksFromAssets(assetsList, rootDirName).run())
        .then(() => htmlPath)
}

export default loadPage
