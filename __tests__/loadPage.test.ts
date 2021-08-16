import nock from 'nock'
import path from 'path'
import os from 'os'
import fsp from 'fs/promises'

import loadPage from '../src'

const getFixturePath = (...fileNames: string[]): string => {
    const projectDir = path.resolve()

    return path.join(projectDir, '__fixtures__', ...fileNames)
}

let defaultHtmlContent: string
let defaultImageContent: Buffer

beforeAll(async () => {
    const defaultHtmlPath = getFixturePath('default.html')
    const imagePath = getFixturePath('image.png')

    defaultHtmlContent = await fsp.readFile(defaultHtmlPath, 'utf-8')
    defaultImageContent = await fsp.readFile(imagePath)

    nock.disableNetConnect()
})

const dirNamePrefix = 'page-loader-'
let tempDirName: string

beforeEach(async () => {
    const prefixPath = path.join(os.tmpdir(), dirNamePrefix)
    tempDirName = await fsp.mkdtemp(prefixPath)
})

it('http status 200', async () => {
    nock('https://ru.hexlet.io')
        .get('/courses')
        .reply(200, defaultHtmlContent)
        .get('/assets/professions/nodejs.png')
        .reply(200, defaultImageContent)

    const expectedHtmlFileName = 'ru-hexlet-io-courses.html'
    const expectedAssetsDirName = 'ru-hexlet-io-courses_files'
    const expecetImageFileName = 'ru-hexlet-io-assets-professions-nodejs.png'

    const imageFilePath = path.join(tempDirName, expectedAssetsDirName, expecetImageFileName)
    const expectedHtmlFilePath = path.join(tempDirName, expectedHtmlFileName)

    const expectedHtmlContent = await fsp.readFile(getFixturePath(expectedHtmlFileName), 'utf-8')
    const actualHtmlFilePath = await loadPage('https://ru.hexlet.io/courses', tempDirName)
    const actualHtmlContent = await fsp.readFile(actualHtmlFilePath, 'utf-8')
    const actualImageContent = await fsp.readFile(imageFilePath)

    expect(actualHtmlFilePath).toEqual(expectedHtmlFilePath)
    expect(actualHtmlContent).toEqual(expectedHtmlContent)
    expect(actualImageContent).toEqual(defaultImageContent)
})
