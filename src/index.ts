import path from 'path'
import fsp from 'fs/promises'

import parseUrlName from './parseUrlName.js'
import loadHtml from './loadHtml.js'

const pageLoader = (url: string, dirName: string) => {
    const fileName = parseUrlName(url)
    const filePath = path.join(dirName, fileName)

    const promise = loadHtml(url)
        .then((html) => fsp.writeFile(filePath, html, 'utf-8'))
        .then(() => filePath)

    return promise
}

export default pageLoader
