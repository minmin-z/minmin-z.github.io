
//此文件是用来配置开发环境和生产环境的配置参数
'use strict'//严格模式
const path = require('path')//node的path模块 用来统一路径
 
module.exports = {
    dev:{//开发环境
        //定义静态资源根目录的子目录static
       assetsSubDirectory:'static',
       //静态资源的公开路径
       assetsPublicPath:'',
       //代理表，用来建一个虚拟api服务器来代理本机的请求，只用于开发模式
       proxyTable:{
           //下面是例子
           "/api":{
               //设置调用的接口域名和端口
               target:"http://123.45.678.123/api/user",
               //可跨域
               changeOrigin:true,
               pathRewrite:{
                   "^api":""//用/api代替http://123.45.678.123/api/user
               }
           }
       },
       //主机
       host:'localhost',
       //域名
       port:8080,
       //是否在浏览器中自动打开
       autoOpenBrowser:false,
       //是否查询错误
       errorOverlay:true,
       //是否通知错误
       notifyOnErrors:true,
       poll:false,
       //开发工具,不每个模块使用 eval() 执行，并且 SourceMap 转换为 DataUrl 后添加到 eval() 中。"低开销"是因为它没有生成列映射(column map)，只是映射行数，作用是当js抛出异常时，显示报错的是第几行
       devtool:'cheap-module-eval-source-map',
       //是否缓存破坏
       cacheBusting:true,
       //记录压缩的代码，用来找到源码位置
       cssSourceMap:true
    },
    build:{//生产环境
        //编译输入的index.html文件,path.resolve(__dirname,'')是获取其完整的绝对路径
        index:path.resolve(__dirname,'../dist/index.html'),
        //编译输出的静态资源路径
        assetsRoot:path.resolve(__dirname,'../dist'),
        //编译输出的静态资源路径的子目录
        assetsSubDirectory:'static',
        //编译输出的根目录
        assetsPublicPath:'/',
        //是否开启sourceMap
        productionSourceMap:true,
        //开发工具 用来调试
        devtool:'#source-map',
        //是否开启gzip压缩
        productionGzip:false,
        //使用gzip压缩的文件扩展名
        productionGzipExtensions:['js','css'],
        //性能优化 打包文件分析工具 process是node.js的进程的有关信息以及控制进程
        bundleAnalyzerReport:process.env.npm_config_report
    }
}