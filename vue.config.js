module.exports = {
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = '方润斯住宿联盟后台'
                return args
            })
    }
}