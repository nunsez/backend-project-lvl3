#!/usr/bin/env node

import { Command, CommandOptions as DefaultCommandOptions } from 'commander'

import pageLoader from '../src/index.js'

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
    .action(async (url: string, options: CommandOptions) => {
        const filePath = await pageLoader(url, options.output)

        console.log(filePath)
    })

program.parse(process.argv)
