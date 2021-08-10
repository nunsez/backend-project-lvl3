import ParseUrlName from '../src/parseUrlName'

const urlList = [
    [
        'https protocol',
        'https://ru.hexlet.io/courses',
        'ru-hexlet-io-courses.html'
    ],
    [
        'http protocol',
        'http://ru.hexlet.io/courses',
        'ru-hexlet-io-courses.html'
    ],
    [
        'ends with .html',
        'https://ru.hexlet.io/courses.html',
        'ru-hexlet-io-courses.html'
    ],
    [
        'ends with dot-something',
        'https://ru.hexlet.io/courses.php',
        'ru-hexlet-io-courses-php.html'
    ],
    [
        'special symbol %20',
        'https://ru.hexlet.io/courses%20space',
        'ru-hexlet-io-courses-space.html'
    ],
    [
        'special symbols ?, =, -, +, _',
        'https://ru.hexlet.io/?c=o-urses+sp_ace',
        'ru-hexlet-io-c-o-urses-sp-ace.html'
    ],
    [
        'without www',
        'https://hexlet.io/courses',
        'hexlet-io-courses.html'
    ],
    [
        'without protocol',
        'ru.hexlet.io/courses',
        'ru-hexlet-io-courses.html'
    ],
    [
        'hostname',
        'hexlet.io/courses',
        'hexlet-io-courses.html'
    ],
]

test.each(urlList)('%s', (_, url, expected) => {
    const actual = ParseUrlName(url)

    expect(actual).toBe(expected)
})
