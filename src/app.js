const http = require('http');
const chalk = require('chalk');
const path = require('path');
const conf = require('./config/defaultConfig');//默认配置放入defaultConfig
const route = require('./helper/route');

//创建server
const server = http.createServer((req, res) => {
    const filePath = path.join(conf.root,req.url);
    route(req, res, filePath);
});
server.listen(conf.port, conf.hostname, () => {
    const addr = `http://${conf.hostname}:${conf.port}`;//监听地址
    console.info(`Server started at ${chalk.green(addr)}`)//返回通知，输出addr为绿色
});
