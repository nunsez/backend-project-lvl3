#!/usr/bin/env node

import { program } from 'commander'

program
    .version('0.0.1')
    .description('Page loader utility')

program.parse(process.argv);
