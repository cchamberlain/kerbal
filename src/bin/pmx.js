#! /usr/bin/env node

import Promise from 'bluebird'
import { assert } from 'chai'
import { createLogger } from 'bunyan'

import { resolveRoot, log as hijackLog } from '../config'

//import BunyanSlack from 'bunyan-slack'
import BunyanPmx from 'bunyan-pmx'
import { watch } from 'chokidar'
import pmx from 'pmx'
import fs from 'fs'
import { fork } from 'child_process'
const readFile = Promise.promisify(fs.readFile)
const writeFile = Promise.promisify(fs.writeFile)

pmx.http()

const createPmxLogger = ({ name = 'pmx', level = 'info', streams = [], data, res } = {}) => {
  const stream = new BunyanPmx({ data, res, hijackLoggers: [hijackLog] })
  const pmxStream = { level, stream }
  return createLogger({ name, streams: [pmxStream, ...streams] })
}


let forked = null

let startServer = ({ log }) => {
  if(forked)
    stopServer({ log })
  forked = fork('bin/run.js')
  forked.on('close', () => log.info('server emitted close event'))
  forked.on('disconnect', () => log.info('server emitted disconnect event'))
  forked.on('error', err => log.error(err, 'server emitted error event'))
  forked.on('exit', () => log.info('server emitted exit event'))
  forked.on('message', (...args) => log.info({ args }, 'server emitted message event'))
  log.info('process forked')
}

let stopServer = ({ log }) => {
  log.warn('sending SIGHUP signal to kill server')
  if(forked)
    forked.kill('SIGHUP')
}

pmx.scopedAction('app:start', (data, res) => {
  const log = createPmxLogger({ data, res, level: 'trace'})
  /*
  readFile('run.lock', 'utf8')
    .then(pidStr => {
      const pid = parseInt(pidStr)
      log.info(`could not start server because of lock, exiting... => ${parseInt}`)
    })
    .catch(err => {
      writeFile('run.lock', process.pid, 'utf8')

        .then(() => {
          */
            log.info('starting server')
            startServer({ log })
            /*
              .then(() => {
                log.info('server started')
              })
              .catch(err => {
                log.error(err, 'fatal error occurred')
                res.end()
              })
              */

/*
        })
    })
    */

})

pmx.scopedAction('app:start-hot', (data, res) => {
  const log = createPmxLogger({ data, res })

  let watcher = watch(['.', '../lib/**'], { persistent: true, usePolling: true, interval: 1000 })
  log.warn('waiting until app is built to start server...')
  let stop = null
  const startServer = () => require('./run').then(x => { stop = x })
  const renewServer = () => (stop ? stop().then(startServer) : startServer()).catch(err => {
    log.error(err, 'could not renew server')
  })
  watcher.on('all', path => {
    try {
      log.warn('app changed, starting server')
      renewServer()
    } catch(startErr) {
      log.error(startErr, 'A fatal error occurred starting.')
    }
  })
})


let probe = pmx.probe()
let measure = probe.histogram({ name        : 'Mean Save'
                              , unit        : 'ms'
                              , measurement : 'mean'
                              , alert : { mode     : 'threshold-avg'
                                        , value    : 500
                                        , interval : 30
                                        }
                              })
setInterval(() => measure.update(Math.floor(Math.random() * 1000)), 1000)
