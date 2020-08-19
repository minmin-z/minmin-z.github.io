
//严格模式
'use strict'
// 引入的是webpack的merge插件，该插件是用来合并对象，也就是配置文件用的，
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

// let params = process.argv[4]
// let baseUrl = ''
// switch (params) {
//     case '--env=test':
//       baseUrl = '"http://a.com"'
//       break
//     case '--env=prod':
//       baseUrl = '"http://b.com"'
//       break
//     default:
//       baseUrl = '"http://c.com"'
// }

module exports = merge(prodEnv,{
  NODE_ENV:'"development"',
  BASE_url:'"http://172.16.26.26:8072/msc-webapp"'
})

