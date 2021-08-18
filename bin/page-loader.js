#!/usr/bin/env node

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
            .then((filePath) => console.log(filePath))
            .catch((error) => {
                console.error(error.message)
                process.exit(1)
            })
    })

program.parse(process.argv)
