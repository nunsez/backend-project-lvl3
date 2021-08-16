import { parseUrlFromString, parseUrlName } from '../src/utils'

const testsList = [
    {
        testName: 'https protocol',
        urlStr: 'https://ru.hexlet.io/courses',
        expectedFileName: 'ru-hexlet-io-courses.html',
    },
    {
        testName: 'http protocol',
        urlStr: 'http://ru.hexlet.io/courses',
        expectedFileName: 'ru-hexlet-io-courses.html',
    },
    {
        testName: 'special symbol %20',
        urlStr: 'https://ru.hexlet.io/courses%20space',
        expectedFileName: 'ru-hexlet-io-courses-space.html',
    },
    {
        testName: 'without www',
        urlStr: 'https://hexlet.io/courses',
        expectedFileName: 'hexlet-io-courses.html',
    },
    {
        testName: 'without protocol',
        urlStr: 'ru.hexlet.io/courses',
        expectedFileName: 'ru-hexlet-io-courses.html',
    },
    {
        testName: 'hostname',
        urlStr: 'hexlet.io/courses',
        expectedFileName: 'hexlet-io-courses.html',
    },
]

it.each(testsList)('$testName', ({ urlStr, expectedFileName }) => {
    const url = parseUrlFromString(urlStr)
    const actualFileName = parseUrlName(url, '.html')

    expect(actualFileName).toEqual(expectedFileName)
})
