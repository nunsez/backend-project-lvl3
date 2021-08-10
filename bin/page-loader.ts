#!/usr/bin/env node

import { Command } from 'commander'

import pageLoader from '../src/pageLoader.js'

const CWD = process.cwd()
const program = new Command()

program
    .version('0.0.1')
    .description('Page loader utility')
    .option('-o, --output [dir]', 'output dir', CWD)

program
    .argument('url')
    .action((url, options) => {
        const filePath = pageLoader(url, options.output)

        console.log(filePath)
    })

program.parse(process.argv)
