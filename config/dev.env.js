
'use strict'
var merge = require('webpack-merge')
// 导入prod.env.js配置文件
var prodEnv = require('./prod.env')
// 将两个配置对象合并，最终结果是 NODE_ENV: '"development"'

module.exports = merge(prodEnv,{
  NODE_ENV:'"development"',
  BASE_API:'"http://172.16.26.26:8072/msc-webapp"'
})