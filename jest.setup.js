/* eslint-disable */

global.console = {
    log: jest.fn(),
    warn: console.warn,
    error: console.error,
    debug: console.debug,
}
