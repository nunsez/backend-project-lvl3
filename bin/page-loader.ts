#!/usr/bin/env node

import { Command } from 'commander'

const CWD = process.cwd()
const program = new Command()

program
    .version('0.0.1')
    .description('Page loader utility')
    .option('-o, --output [dir]', 'output dir', CWD)

program
    .argument('url')
    .action((url, options) => {
        console.log('url', url)
        console.log('options', options)

    })

program.parse(process.argv)
