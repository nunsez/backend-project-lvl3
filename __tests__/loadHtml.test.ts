import nock from 'nock'

import loadHtml from '../src/loadHtml'

nock.disableNetConnect()

const url = 'http://www.example.com'

const testsList = [
    {
        name: 'http request 200 root',
        path: '/',
        status: 200,
        response: '<h1>Hello, Nock!</h1>',
    },
    {
        name: 'http request 200 path',
        path: '/bye',
        status: 200,
        response: '<h1>Bye, Nock!</h1>',
    },
]

testsList.forEach((opts) => {
    const { path, status, response } = opts

    nock(url).get(path).reply(status, response)
})

it.each(testsList)('$name', async ({ path, response }) => {
    const uri = url.concat(path)
    const html = await loadHtml(uri)

    expect(html).toEqual(response)
})
