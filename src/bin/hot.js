#! /usr/bin/env node

import { resolveRoot } from '../config'
import { assert } from 'chai'
import { createLogger } from 'bunyan'
import BunyanSlack from 'bunyan-slack'
import BunyanPmx from './BunyanPmx'
import { watch } from 'chokidar'
import pmx from 'pmx'
import http from 'http'

pmx.http()

const createPmxLogger = ({ data, res, reply }) => {
  return createLogger({ name: 'app:start-hot'
                      , streams:  [ { level: 'trace'
                                    , stream: new BunyanPmx({ data, res })
                                    , reemitErrorEvents: true
                                    }
                                  , { level: 'trace'
                                    , path: resolveRoot('trace.log')
                                    }
                                  ]
                      })
}

pmx.scopedAction('lib:compile', (data, res) => {
  const log = createPmxLogger({ data, res })
  try {

    //log.info(Object.keys(npm).join(', '))

/*
    require('npm').load({ parseable: true }, (err, npm) => {
      if(err) return log.error(err, 'error occurred loading npm')
      log.info(`running npm script => ${Object.keys(npm.commands).join(', ')}`)
      try {
        npm.commands.run(['build-lib'], err => {
          if(err) return log.error(err, 'error occurred running npm script')
          log.info('script ran successful')
        })
      } catch(err) {
        log.error(err, 'error occurred while running script')
      }
    })
    */
    /*
    const command = 'npm run build-lib'
    let x = 0
    const loopLog = () => {
      while(x < 1000)
        setImmediate(() => {
          x++
          log.info(`looping => ${x}`)
        })
    }
    log.info('running npm run build-lib')
    const child = npmRunScript(command, { stdio: 'ignore' })
    child.once('error', err => {
      log.error(err, 'error occurred')
    })
    child.once('exit', exitCode => {
      log.info(`finished running script with exit code ${exitCode}`)
    })
    const { pid, output, stdout, stderr, status, error } = spawnSync('npm.cmd', ['run', 'build-lib'], { shell: true, encoding: 'utf8' } )

    if(stderr)
      log.error(error, 'stderr')
    if(stdout)
      log.info(stdout)
    if(error) {
      log.error(error)
    }
    log.info(`pid => ${pid}, status => ${status}, output => ${output}`)

*/
/*
      if(error) {
        log.error(error)
        return res.end()
      }
      log.info({ stdout }, 'completed compiling lib')
    }*/

  } catch(err) {
    log.error(err, 'an error occurred during lib compile')
  }

})
pmx.scopedAction('app:start-hot', (data, res) => {
  const log = createPmxLogger({ data, res })

  let watcher = watch('.', { persistent: true, usePolling: true, interval: 1000 })
  log.warn('waiting until app is built to start server...')
  let stop = null
  const startServer = () => require('./run').then(x => { stop = x })
  const renewServer = () => (stop ? stop().then(startServer) : startServer()).catch(err => log.error(err, 'an error occurred renewing the server'))
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
  startServer()
})



