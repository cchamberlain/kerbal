#! /usr/bin/env node
import 'babel-polyfill'

import { server, log } from '../config'
import createServer, { definePaths } from '../lib'

//if(typeof server.pmx === 'object') require('pmx').init(server.pmx)

module.exports = definePaths()
  .then(paths => {
    log.info({ paths })
    return createServer(paths).get('http').start()
  })
  .catch(err => log.fatal(err, 'A fatal error occurred.'))
