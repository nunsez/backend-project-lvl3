#!/usr/bin/env node

import { Command, CommandOptions as DefaultCommandOptions } from 'commander'

import loadPage from '../src/index.js'

const CWD = process.cwd()
const program = new Command()

program
    .version('0.0.1')
    .description('Page loader utility')
    .option('-o, --output [dir]', 'output dir', CWD)

interface CommandOptions extends DefaultCommandOptions {
    output: string
}

program
    .argument('url')
    .action((url: string, options: CommandOptions) => {
        loadPage(url, options.output)
            .then((filePath) => console.log(filePath))
            .catch((error) => console.log(error.message))
    })

program.parse(process.argv)
