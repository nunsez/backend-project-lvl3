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
const defaultScriptContent = '(() => {})()'
const defaultStyleContent = 'body {}'

const dirNamePrefix = 'page-loader-'
let tempDirName: string

beforeAll(async () => {
    const defaultHtmlPath = getFixturePath('default.html')
    const imagePath = getFixturePath('image.png')

    defaultHtmlContent = await fsp.readFile(defaultHtmlPath, 'utf-8')
    defaultImageContent = await fsp.readFile(imagePath)

    nock.disableNetConnect()
})

beforeEach(async () => {
    const prefixPath = path.join(os.tmpdir(), dirNamePrefix)
    tempDirName = await fsp.mkdtemp(prefixPath)
})

describe('http workflow', () => {
    it('status 200', async () => {
        nock('https://ru.hexlet.io')
            .get('/courses')
            .twice()
            .reply(200, defaultHtmlContent)
            .get('/assets/professions/nodejs.png')
            .reply(200, defaultImageContent)
            .get('/assets/application.css')
            .reply(200, defaultStyleContent)
            .get('/packs/js/runtime.js')
            .reply(200, defaultScriptContent)

        const expectedHtmlFileName = 'ru-hexlet-io-courses.html'
        const expectedAssetsDirName = 'ru-hexlet-io-courses_files'

        const expectedHtmlContent = await fsp.readFile(getFixturePath(expectedHtmlFileName), 'utf-8')

        const expectedHtmlFilePath = path.join(tempDirName, expectedHtmlFileName)
        const expectedAssetsDirPath = path.join(tempDirName, expectedAssetsDirName)

        const expectedImageFilePath = path.join(expectedAssetsDirPath, 'ru-hexlet-io-assets-professions-nodejs.png')
        const expectedStyleFilePath = path.join(expectedAssetsDirPath, 'ru-hexlet-io-assets-application.css')
        const expectedScriptFilePath = path.join(expectedAssetsDirPath, 'ru-hexlet-io-packs-js-runtime.js')

        const actualHtmlFilePath = await loadPage('https://ru.hexlet.io/courses', tempDirName)
        const actualHtmlContent = await fsp.readFile(actualHtmlFilePath, 'utf-8')
        const actualImageContent = await fsp.readFile(expectedImageFilePath)
        const actualStyleContent = await fsp.readFile(expectedStyleFilePath, 'utf-8')
        const actualScriptContent = await fsp.readFile(expectedScriptFilePath, 'utf-8')

        expect(actualHtmlFilePath).toEqual(expectedHtmlFilePath)
        expect(actualHtmlContent).toEqual(expectedHtmlContent)
        expect(actualImageContent).toEqual(defaultImageContent)
        expect(actualStyleContent).toEqual(defaultStyleContent)
        expect(actualScriptContent).toEqual(defaultScriptContent)
    })

    it('status 404', async () => {
        nock('https://ru.hexlet.io').get('/').reply(404)

        const promise = loadPage('https://ru.hexlet.io/', tempDirName)

        await expect(promise).rejects.toThrowError()
    })
})

afterAll(() => {
    nock.cleanAll()
    nock.enableNetConnect()
})
