#!/usr/bin/env node
/* eslint-disable */

import { Command } from 'commander'

import loadPage from '../dist/index.js'

const CWD = process.cwd()
const program = new Command()

program
    .version('0.0.1')
    .description('Page loader utility')
    .option('-o, --output [dir]', 'output dir', CWD)

program
    .argument('url')
    .action((url, options) => {
        loadPage(url, options.output)
            .then((filePath) => {
                const message = `Page was successfully downloaded into '${filePath}'`
                process.stdout.write(`${message}\n`)
                process.exit(0)
            })
            .catch((error) => {
                const { message } = error
                process.stderr.write(`${message}\n`)
                process.exit(1)
            })
    })

program.parse(process.argv)
