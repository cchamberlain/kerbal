import { assert } from 'chai'
import util from 'util'
import { EventEmitter } from 'events'

const LEVEL_MAP = { 10: 'trace'
                  , 20: 'debug'
                  , 30: 'info'
                  , 40: 'warn'
                  , 50: 'error'
                  , 60: 'fatal'
                  }
const defaultFormatter = (record, levelName) => `${levelName.toUpperCase()} | ${record.msg}${record.err ? ` | ${record.err.name}: ${record.err.message}\n${record.err.stack}` : ''}`
//({ text: util.format('[%s] %s', levelName.toUpperCase(), record.msg) })

export default class BunyanPmx extends EventEmitter {
  constructor({ data, res, formatter = defaultFormatter }) {
    assert.ok(data, 'pmx data is a required parameter.')
    assert.ok(res, 'pmx res is a required parameter.')
    super()
    this.data = data
    this.res = res
    this.formatter = formatter
  }
  write = input => {
    try {
      let record = typeof input === 'string' ? JSON.parse(input) : input
      const { level } = record
      let levelName = LEVEL_MAP[level]
      let message = this.formatter(record, levelName)
      this.res.send(JSON.stringify(message))
    } catch(err) {
      return this.emit('error', err)
    }
  };
  end = () => {
    this.emit('shutdown')
  };
  destroy = () => {
    this.emit('shutdown')
  };


/*

  write(s, callback) {
        var length = writeQueue.push(s, callback);
        base.emit('perf-queued', length);
    }

    function end(s) {
        writeQueue.pause();
        rotator.end(function () {
            base.emit('shutdown');
        });
    };

    function destroy(s) {
        writeQueue.pause();
        rotator.end();
        base.emit('shutdown');
    };
    */

}
