const http = require('http');
const chalk = require('chalk');
const path = require('path');
const conf = require('./config/defaultConfig');//默认配置放入defaultConfig
const route = require('./helper/route');
const openUrl = require('./helper/openUrl')

class Server {
    constructor (config) {
      this.conf = Object.assign({}, conf, config);
    }

    start() {
      //创建server
      const server = http.createServer((req, res) => {
        const filePath = path.join(this.conf.root,req.url);
        route(req, res, filePath,this.conf);
      });
      server.listen(this.conf.port, this.conf.hostname, () => {
        const addr = `http://${this.conf.hostname}:${this.conf.port}`;//监听地址
        console.info(`Server started at ${chalk.green(addr)}`)//返回通知，输出addr为绿色
        openUrl(addr);
      });

    }
}

module.exports = Server;
