#! /usr/bin/env node

import { assert } from 'chai'
import { createLogger } from 'bunyan'
import BunyanSlack from 'bunyan-slack'
import BunyanPmx from './BunyanPmx'
import { watch } from 'chokidar'
import pmx from 'pmx'


pmx.scopedAction('app:start-hot', (data, res) => {
  const log = createLogger( { name: 'app:start-hot'
                            , streams: [ { level: 'debug', stream: new BunyanPmx({ data, res }) }
                            level: 'debug' })
  let watcher = watch('.', { persistent: true, usePolling: true, interval: 1000 })
  log.warn('waiting until app is built to start server...')
  let stop = null
  const startServer = () => require('./run').then(x => { stop = x })
  const renewServer = () => (stop ? stop().then(startServer) : startServer()).catch(err => {
    log.error()
  })
  watcher.on('all', path => {
    try {
      log.warn('app changed, starting server')
      if(stop) {
        stop().then(() => {
          log.warn('app stopped')
          require('./run').then(stopServer => {
            stop = stopServer
          })
          log.warn('app restarted')
        })
      } else {
        stop = require('./run')
        log.warn('app started')
      }
    } catch(startErr) {
      log.error(startErr, 'A fatal error occurred starting.')
    }
  })
})
