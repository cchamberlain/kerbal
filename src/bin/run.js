#! /usr/bin/env node
import 'babel-polyfill'

import { server, log } from '../config'
import createServer, { definePaths } from '../lib'

if(typeof server.pmx === 'object') require('pmx').init(server.pmx)

definePaths().then(paths => {
    log.info({ paths })
    const server = createServer(paths)
    server.get('https').start()
    server.get('http').start()
  })
  .catch(err => {
    log.error(err, 'A fatal error occurred.')
    process.exit(1)
  })
