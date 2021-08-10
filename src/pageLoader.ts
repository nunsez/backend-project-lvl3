import path from 'path'

import parseUrlName from './parseUrlName.js'

const pageLoader = (url: string, dirName: string) => {
    const fileName = parseUrlName(url)
    const filePath = path.join(dirName, fileName)

    return filePath
}

export default pageLoader
