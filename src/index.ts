import path from 'path'
import fsp from 'fs/promises'

import parseUrlName from './parseUrlName'
import loadHtml from './loadHtml'

const pageLoader = (url: string, dirName: string): Promise<string> => {
    const fileName = parseUrlName(url)
    const filePath = path.join(dirName, fileName)

    const promise = loadHtml(url)
        .then((html) => fsp.writeFile(filePath, html, 'utf-8'))
        .then(() => filePath)

    return promise
}

export default pageLoader
