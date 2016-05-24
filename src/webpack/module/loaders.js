import { server, resolveRoot } from '../../config'
import { extractText } from '../plugins'

//const getImageLoader = () => server.flags.hot ? 'url-loader?limit=8192' : 'file?hash=sha512&digest=hex&name=[hash].[ext]!image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
const getImageLoader = name => ({ test: /\.(gif|png|jpe?g|svg)$/i
                                , loader: 'url'
                                , query:  { limit: 8192 }
                                })

const getJsLoader = name => {
  return  { test: /\.jsx?$/
          , loaders: [ 'babel-loader' ]
          , exclude: /node_modules/
          }
}

const getJsonLoader = name => ({ test: /\.json$/, loader: 'json' })

const inlineStyleLoader = preLoaders => `style!${preLoaders}`
const getStyleLoaders = name => {
  const useExtract = true //process.env.NODE_ENV !== 'hot' || name === 'server'

  const cssLoader = 'css!postcss'
  const lessLoader = `${cssLoader}!less`
  return  [ { test: /\.css$/
            , loaders: [ 'style', 'css', 'postcss' ]
            }
          , { test: /\.less$/
            , loaders: [ 'style', 'css', 'postcss', 'less' ]
            }
/*
          , { test: /\.css$/, loader: useExtract ? extractText(cssLoader) : inlineStyleLoader(cssLoader) }
          , { test: /\.less$/, loader: useExtract ? extractText(lessLoader) : inlineStyleLoader(lessLoader) }
          */
          ]
}

const getFontLoader = name => ( { test: /\.(otf|eot|woff|woff2|ttf|svg)$/i
                                , loader: 'url'
                                , query:  { name: '[name].[ext]'
                                          , limit: 100000
                                          }
                                } )

export default name => {
  const jsLoader = getJsLoader(name)
  switch(name) {
    case 'server':
      return  [ jsLoader
              , getJsonLoader(name)
              , ...getStyleLoaders(name)
              , getImageLoader(name)
              , getFontLoader(name)
              ]
    case 'static':
      return [ jsLoader ]
    default:
      return  [ jsLoader
              , getJsonLoader(name)
              , ...getStyleLoaders(name)
              , { test: /\.png$/
                , loader: 'url'
                , query:  { name: '[name].[ext]'
                          , mimetype: 'image/png'
                          , limit: 100000
                          }
                }
              , getImageLoader(name)
              , getFontLoader(name)
              ]
  }
}

