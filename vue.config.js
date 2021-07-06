const path = require('path');
const resolve = (dir) => path.join(__dirname, dir);
const CompressionPlugin = require('compression-webpack-plugin');//引入compression-webpack-plugin

module.exports = {
  // 公共文件路径
  publicPath: './',
  lintOnSave: false,
  runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
  chainWebpack: config => {
    config.resolve.symlinks(true); // 修复热更新失效
    config.resolve.alias // 添加别名
      .set('@', resolve('src'))
      .set('@assets', resolve('src/assets'))
      .set('@components', resolve('src/components'))
      .set('@views', resolve('src/views'))
      .set('@store', resolve('src/store'));
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {//生产环境
      config.plugins.push(
        new CompressionPlugin({
          /* [file]被替换为原始资产文件名。
             [path]替换为原始资产的路径。
             [dir]替换为原始资产的目录。
             [name]被替换为原始资产的文件名。
             [ext]替换为原始资产的扩展名。
             [query]被查询替换。*/
          filename: '[path].gz[query]',
          //压缩算法
          algorithm: 'gzip',
          //匹配文件
          test: /\.js$|\.css$|\.html$/,
          //压缩超过此大小的文件,以字节为单位
          threshold: 10240,
          minRatio: 0.8,
          //删除原始文件只保留压缩后的文件
          //deleteOriginalAssets: false
        })
      )
    }
  },
  // proxy跨域
  devServer: {
    overlay: { // 让浏览器 overlay 同时显示警告和错误
      warnings: true,
      errors: true
    },
    open: false,
    port: "8888",
    hotOnly: true, // 热更新
    proxy: {
      "/api": {
        target: "http://172.11.11.11:7071",
        changeOrigin: true,
        // ws: true,//websocket支持
        secure: false,
        pathRewrite: {
          "^/api": "/"
        }
      }
    }
  },
}