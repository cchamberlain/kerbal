import { assert } from 'chai'
import { EventEmitter } from 'events'

const LEVEL_MAP = { 10: 'TRACE'
                  , 20: 'DEBUG'
                  , 30: 'INFO'
                  , 40: 'WARN'
                  , 50: 'ERROR'
                  , 60: 'FATAL'
                  }

export const createPrettySerializer = ( { showName = false
                                        , showHostname = false
                                        , showPid = true
                                        , showTime = true
                                        , showError = true
                                        , showSilly = false
                                        } = {}) => x => {
  try {
    let record = x
    try {
      record = typeof x === 'string' ? JSON.parse(x) : x
    } catch(err) {
      return `INTERNAL|UNPARSEABLE=${record}`
    }
    const { name, hostname, pid, level, msg, time, v, err } = record
    let levelName = level ? LEVEL_MAP[level] : 'UNKNOWN'
    let output = `${levelName}`
    if(showName && name)
      output += `|NAME=${name}`
    if(showHostname && hostname)
      output += `|HOSTNAME=${hostname}`
    if(showPid && pid)
      output += `|PID=${pid}`
    if(showTime && time)
      output += `|${time}`
    if(v)
      output += `|V=${v}`
    output += `|${msg}`

    if(showError && err) {
      const { message, stack } = err
      output += `|ERR=${message}\n${stack}`
    }
    if(showSilly)
      output += `\nSILLY => KEYS=[${Object.keys(record).join(', ')}]`
    return output
  } catch(err) {
    return `INTERNAL|ERR=an error occurred formatting output => ${err.message || err}`
  }
}

export default class BunyanPmx extends EventEmitter {
  constructor({ data, res, serializer = createPrettySerializer(), hijackLogs = [] } = {}) {
    super()
    assert.ok(data, 'pmx data is a required parameter.')
    assert.ok(res, 'pmx res is a required parameter.')
    this.data = data
    this.res = res
    this.serializer = serializer
    this.writable = true
    this.writeStreams = (hijackLogs
      .map(log => log.streams.map(({ type, stream, closeOnExit, level, raw }) => stream)))
      .reduce((streams, x, i, arr) => {
        return [...streams, ...arr[i] ]
      }, [])
    this.hijackStreams()
  }
  hijackStreams = () => {
    try {
      this.writeStreams.forEach(stream => {
        stream._originalWrite = stream.write.bind(stream)
        stream.write = (...args) => {
          try {
            stream._originalWrite(...args)
          } catch(err) {
            this.write({ level: 50, err, msg: `error occurred writing to original stream with args ${[...args].join(', ')}`})
          }
          this.write(...args)
          return true
        }
      })
    } catch(err) {
      this.write({ err, level: 50, msg: 'an error occurred hijacking stream' })
    }
  };
  write = x => {
    try {
      this.res.send(this.serializer(x))
    } catch(err) {
      this.error(err)
      return false
    }
    return true
  };
  error = err => {
    this.emit('error', err)
  };
  end = (...args) => {
    if(args.length > 0)
      this.write(...args)
    this.writable = false
  };
  destroy = () => {
    this.writable = false
    this.res.end()
    this.emit('close')
  };
  destroySoon = () => {
    this.destroy()
  };
}
