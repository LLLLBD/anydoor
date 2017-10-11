// 模块输出主机，端口号,正则选定压缩的扩展名，缓存
module.exports = {
    root: process.cwd(),
    hostname: '127.0.0.1',
    port: 9527,
    compress: /\.(html|js|css|md)/,
    cache: {
      maxAge: 600,
      expires: true,
      cacheControl: true,
      lastModified: true,
      etag: true
    }
};
