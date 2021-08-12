import nock from 'nock'
import path from 'path'
import os from 'os'
import fsp from 'fs/promises'

import loadPage from '../src'

const host = 'https://ru.hexlet.io'

const testsList = [
    {
        testName: 'courses page',
        url: 'https://ru.hexlet.io/courses',
        path: '/courses',
        expectedHTML: 'ru-hexlet-io-courses.html',
        status: 200,
    },
    {
        testName: 'content page',
        url: 'https://ru.hexlet.io/content',
        path: '/content',
        expectedHTML: 'content page',
        status: 200,
    },
]

beforeAll(() => {
    nock.disableNetConnect()

    testsList.forEach(({ path, status, expectedHTML }) => {
        nock(host).get(path).reply(status, expectedHTML)
    })
})

const dirNamePrefix = 'page-loader-'
let tempDirName: string;

beforeEach(async () => {
    const prefixPath = path.join(os.tmpdir(), dirNamePrefix)

    tempDirName = await fsp.mkdtemp(prefixPath)
})

it.each(testsList)('$testName', async ({ url, expectedHTML }) => {
    const filePath = await loadPage(url, tempDirName)
    const html = await fsp.readFile(filePath, 'utf-8')

    expect(html).toEqual(expectedHTML)
})
