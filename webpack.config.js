const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ProgressBarWebpackPlugin = require('progress-bar-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const GetRepoInfo = require('git-repo-info')
const moment = require('moment')
const HappyPack = require('happypack')
const os = require('os')
const mock = require('cf-mock-server/express-mw')
const envConfig = require('./my.env.config') // 读取 env.***.json 中的内容





const target = 'https://dev3.fe-iu.com/' // 接口地址

const htmlPlugin = new HtmlWebpackPlugin({
  title: 'FEIU-BI',
  template: path.join(__dirname, 'public/index.html'),
  filename: './index.html'
})
const cssPlugin = new MiniCssExtractPlugin({
  filename: 'css/[name]-[chunkhash:8].css',
  chunkFilename: 'css/[name]-[chunkhash:8].css'
})
const cleanPlugin = new CleanWebpackPlugin(['dist'])
const copyPlugin = new CopyWebpackPlugin([
  {
    from: path.join(__dirname, './public/favicon.ico'), to: './'
  }
])
const progressPlugin = new ProgressBarWebpackPlugin({
  format: 'building [:bar] :percent (:elapsed seconds)',
  clear: false,
  width: 30
})

const publishEnv = process.env.npm_lifecycle_event.replace('build:', '') // 读取打包环境，根据环境加载 env.***.json 文件
// const { branch } = GetRepoInfo()
const envObj = publishEnv ? envConfig[publishEnv] : {}
// const RELEASE = `${envObj.ENV}__${branch.replace('/', '_')}__${moment().format('MMDDHHmm')}`

// const serverHost = 'http://localhost:8080'
// const apiPrex = ''

// 注意local才是本地开发环境，dev是develop分支环境, 读取 env.***.json 中的内容，将其中的变量定义为全局变量
const definePlugin = new webpack.DefinePlugin({
  NODE_ENV: JSON.stringify(envObj.ENV),
  CDN_URL: JSON.stringify(envObj.CDN_URL),
  AUTH_SERVICE: JSON.stringify(envObj.AUTH_SERVICE),
  RELEASE: JSON.stringify('')
})

const providePlugin = new webpack.ProvidePlugin({ // 将 axios 和 momrnt 引入为全局，这样不用每次使用时都 import 或 require
  axios: 'axios',
  moment: 'moment',
})

// const uglifyjsPlugin = new UglifyJsPlugin({
//   test: /\.js($|\?)/i,
//   exclude: /node_modules/,
//   parallel: true,
//   sourceMap: true
// })
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })
const happyPack = new HappyPack({ // 多线程处理编译文件
  id: 'babel',
  loaders: [{
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      presets: ['@babel/preset-env', '@babel/preset-react'],
      plugins: [
        ['@babel/plugin-proposal-decorators', { "legacy": true }],
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-transform-runtime',
      ],
    }
  }],

  threadPool: happyThreadPool,  //  共享进程池
  verbose: true,  //  允许 HappyPack 输出日志
})

module.exports = (env, argv) => { //
  const devMode = argv.mode !== 'production'
  return {
    entry: {
      main: [
        '@babel/polyfill',
        path.join(__dirname, './public/index.js')
      ],
      vendor: ['react', 'react-dom']
    },
    output: {
      path: path.join(__dirname, './dist/'),
      // publicPath: envObj.CDN_URL, // 配置cdn地址
      filename: 'js/[name]-[chunkhash:8].js',
      chunkFilename: 'js/[name]-[chunkhash:8].js'
    },
    module: {
      rules: [{
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loaders: ['happypack/loader?id=babel'],
      }, {
        test: /\.(css|less)$/,
        include: /src|public/,
        use: [
          {
            loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[local]-[hash:8]',
            }
          }, {
            loader: 'less-loader',
            options: {
              modules: true,
              localIdentName: '[local]-[hash:8]',
              javascriptEnabled: true,
            }
          }, {
            loader: 'postcss-loader'
          }
        ]
      }, {
        test: /\.(less|css)$/,
        include: /node_modules/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader'
        }, {
          loader: 'less-loader',
          options: {
            modifyVars: {
              'primary-color': '#F5222D',
              'border-radius-base': '2px'
            },
            javascriptEnabled: true
          }
        }]
      }, {
        test: /\.(png|jpeg|jpg|gif|svg|woff|eot|ttf)$/i,
        use: [{
          loader: 'url-loader',
          options: {
            name: 'img/[name].[ext]',
            limit: 10240,
          }
        }]
      }]
    },
    devtool: publishEnv !== 'prod' ? 'source-map' : '', // 不同的打包模式
    plugins: [
      htmlPlugin,
      cssPlugin,
      cleanPlugin,
      copyPlugin,
      progressPlugin,
      definePlugin,
      happyPack,
      providePlugin,
    ],
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 30000, // 大于30K才会抽离到公共模块
        minChunks: Infinity,
        name: 'vendor'
      }
    },
    resolve: {
      alias: {
        '@comm': path.join(__dirname, 'src/comm'),
        '@src': path.join(__dirname, 'src'),
        '@components': path.join(__dirname, 'src/components'),
        '@utils': path.join(__dirname, 'src/utils'),
        '@router': path.join(__dirname, 'src/router')
      },
      extensions: ['.js', '.jsx', '.html', '.css', '.less']
    },
    performance: {
      hints: false
    },
    stats: {
      entrypoints: false,
      children: false,
      modules: false,
      errors: true,
      errorDetails: true,
      warnings: true
    },
    devServer: { // 服务器设置
      open: true, // 服务器启动后自动打开浏览器
      port: 9700,
      useLocalIp: true, // 使用本地IP地址
      host: '0.0.0.0', //host地址
      stats: { // 打包信息显示配置
        assets: false,
        entrypoints: false,
        children: false,
        modules: false,
        errors: true,
        errorDetails: true,
        warnings: true
      },
      proxy: {
        // '/': { // 代理所有的请求，这时候不会走mock
        //   target: target,
        //   changeOrigin: true,
        //   secure: false, // 接受运行在 HTTPS 上，且使用了无效证书的后端服务器
        //   pathRewrite: {
        //     '^/': '/' // 因为 服务器环境有对应的ng配置
        //   }
        // }
        // '/feiu_api': { // 代理所有的请求，这时候不会走mock
        //   target: target,
        //   changeOrigin: true,
        //   secure: false, // 接受运行在 HTTPS 上，且使用了无效证书的后端服务器
        //   pathRewrite: {
        //     '^/feiu_api': '/feiu_api' // 因为 服务器环境有对应的ng配置
        //   }
        // },
        '/bi': {
          target: 'http://172.16.10.137:8080/', // 马成
          // target: 'http://172.16.10.115:8080/', // 李朋朋
          // target: 'http://172.16.0.133:7773/',
          changeOrigin: true,
          secure: false, // 接受运行在 HTTPS 上，且使用了无效证书的后端服务器
          pathRewrite: {
            '^/bi': '' // 因为 服务器环境有对应的ng配置
          }
        }
      },
      after: (app, server) => {
        app.use(mock({
          config: path.join(__dirname, './mock-server/config.js')
        }))
      },
    }
  }
}
