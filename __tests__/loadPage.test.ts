import nock from 'nock'
import path from 'path'
import os from 'os'
import fsp from 'fs/promises'

import loadPage from '../src'

const host = 'https://ru.hexlet.io'
const route = '/courses'
const htmlFileNameBefore = 'https.ru.hexlet.io.courses.html'
const htmlFileNameAfter = 'ru-hexlet-io-courses.html'

const getFixturePath = (...fileNames: string[]): string => {
    const projectDir = path.resolve()

    return path.join(projectDir, '__fixtures__', ...fileNames)
}

let htmlContentBefore: string
let htmlContentAfter: string

beforeAll(async () => {
    const htmlBeforePath = getFixturePath(htmlFileNameBefore)
    const htmlAfterPath = getFixturePath(htmlFileNameAfter)

    htmlContentBefore = await fsp.readFile(htmlBeforePath, 'utf-8')
    htmlContentAfter = await fsp.readFile(htmlAfterPath, 'utf-8')

    nock.disableNetConnect()
})

const dirNamePrefix = 'page-loader-'
let tempDirName: string

beforeEach(async () => {
    const prefixPath = path.join(os.tmpdir(), dirNamePrefix)

    tempDirName = await fsp.mkdtemp(prefixPath)

    nock(host).get(route).reply(200, htmlContentBefore)
})

it('only html', async () => {
    const url = host.concat(route)
    const filePath = await loadPage(url, tempDirName)
    const html = await fsp.readFile(filePath, 'utf-8')

    expect(html).toEqual(htmlContentBefore)
})

it('test asserts: png', async () => {
    const url = host.concat(route)
    const filePath = await loadPage(url, tempDirName)
    const html = await fsp.readFile(filePath, 'utf-8')

    expect(html).toEqual(htmlContentAfter)

    const assetsFolderName = filePath.slice(0, -5).concat('_files')
    const pngFileName = 'ru-hexlet-io-assets-professions-nodejs.png'

    const pngFilePath = path.join(assetsFolderName, pngFileName)
    const isPngExist = await fsp.access(pngFilePath)

    expect(isPngExist).toBeUndefined()
})
