const path = require('path')
module.exports = {
    lintOnSave:false,//关闭代码严格模式
    chainWebpack: config => {
        //删除vue cli脚手架中默认的入口点配置 main.js
        config.entryPoints.delete('app')
        config.when(process.env.NODE_ENV == 'production', config => {
            console.log('生产环境')
            config.entry('app').add('./src/main-prod.js')
            config
                .plugin('html')
                .tap(args => {
                    args[0].template = path.join(__dirname, '/public/index-prod.html')
                    return args
                })
            //设置忽略文件
            config.set('externals', {
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
                lodash: '_',
                echarts: 'echarts',
                nprogress: 'NProgress',
                'vue-quill-editor': 'VueQuillEditor'
            })
        })
        config.when(process.env.NODE_ENV == 'development', config => {
            console.log('开发环境')
            config.entry('app').add('./src/main-dev.js')
            config
                .plugin('html')
                .tap(args => {
                    args[0].template = path.join(__dirname, '/public/index-dev.html')
                    return args
                })
        })
    }
}


