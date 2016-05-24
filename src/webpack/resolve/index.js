import { __rootname, resolveRoot } from '../../config.js'
import getAlias from './alias'

export default name => {
  return  { modules: [ __rootname, resolveRoot('node_modules') ]
          , descriptionFiles: [ 'package.json' ]
          , mainFields: [ 'main', 'browser' ]
          , mainFiles: [ 'index' ]
          , aliasFields: [ 'browser' ]
          , extensions: ['.js', '.jsx', '.json']
          , enforceExtension: false
          , moduleExtensions: [ '-loader' ]
          , enforceModuleExtension: false
          , alias: getAlias(name)
          }
}
