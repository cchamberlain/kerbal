import { assert } from 'chai'
import util from 'util'
import request from 'request'
import extend from 'extend.js'

const LEVEL_MAP = { 10: 'trace'
                  , 20: 'debug'
                  , 30: 'info'
                  , 40: 'warn'
                  , 50: 'error'
                  , 60: 'fatal'
                  }

export default class BunyanPmx {
  constructor({ data, res, error = () => {}, customFormatter }) {
    assert.ok(data, 'pmx data is a required parameter.')
    assert.ok(res, 'pmx res is a required parameter.')
    this.data = data
    this.res = res
    this.customFormatter = options.customFormatter
  }
  write = record => {
    try {
      let record = typeof record === 'string' ? JSON.parse(record) : record
      let levelName = nameFromLevel[record.level]
      let message = this.customFormatter ? this.customFormatter(record, levelName) : { text: util.format('[%s] %s', levelName.toUpperCase(), record.msg) }
      this.res.send(JSON.stringify(message))
    } catch(err) {
      return this.error(err)
    }
  };
  error = err => {
    this.res.error(err)
    return err
  };
}
