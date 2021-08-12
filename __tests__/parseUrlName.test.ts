import ParseUrlName from '../src/parseUrlName'

const testsList = [
    {
        testName: 'https protocol',
        url: 'https://ru.hexlet.io/courses',
        expectedFileName: 'ru-hexlet-io-courses.html',
    },
    {
        testName: 'http protocol',
        url: 'http://ru.hexlet.io/courses',
        expectedFileName: 'ru-hexlet-io-courses.html',
    },
    {
        testName: 'ends with .html',
        url: 'https://ru.hexlet.io/courses.html',
        expectedFileName: 'ru-hexlet-io-courses.html',
    },
    {
        testName: 'ends with dot-something',
        url: 'https://ru.hexlet.io/courses.php',
        expectedFileName: 'ru-hexlet-io-courses-php.html',
    },
    {
        testName: 'special symbol %20',
        url: 'https://ru.hexlet.io/courses%20space',
        expectedFileName: 'ru-hexlet-io-courses-space.html',
    },
    {
        testName: 'special symbols ?, =, -, +, _',
        url: 'https://ru.hexlet.io/?c=o-urses+sp_ace',
        expectedFileName: 'ru-hexlet-io-c-o-urses-sp-ace.html',
    },
    {
        testName: 'without www',
        url: 'https://hexlet.io/courses',
        expectedFileName: 'hexlet-io-courses.html',
    },
    {
        testName: 'without protocol',
        url: 'ru.hexlet.io/courses',
        expectedFileName: 'ru-hexlet-io-courses.html',
    },
    {
        testName: 'hostname',
        url: 'hexlet.io/courses',
        expectedFileName: 'hexlet-io-courses.html',
    },
]

it.each(testsList)('$testName', ({ url, expectedFileName }) => {
    const actualFileName = ParseUrlName(url)

    expect(actualFileName).toEqual(expectedFileName)
})
