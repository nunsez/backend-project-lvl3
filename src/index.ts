import path from 'path'
import fsp from 'fs/promises'
import axios from 'axios'

import parseUrlName from './parseUrlName.js'

const pageLoader = async (url: string, dirName: string) => {
    const fileName = parseUrlName(url)
    const filePath = path.join(dirName, fileName)

    const response = await axios.get(url)
    const data = response.data

    await fsp.writeFile(filePath, data, 'utf-8')

    return filePath
}

export default pageLoader
