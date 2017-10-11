const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const config = require('../config/defaultConfig');
const mime = require('./mime');
const compress = require('./compress');
const range = require('./range');
const isFresh = require('./cache');

const tplPath = path.join(__dirname, '../template/dir.tpl');
const source = fs.readFileSync(tplPath, 'utf-8');//只执行一次,默认读取为buffer，需要声明为utf8
const template = Handlebars.compile(source);
//包裹async时，异步调用前必须加await
module.exports = async function (req, res, filePath) {
    try {
        const stats = await stat(filePath);
        if (stats.isFile()){
            const contentType = mime(filePath);
            res.setHeader('Content-Type', contentType);

            if (isFresh(stats, req, res)){
                res.statusCode = 304;
                res.end();
                return;
            }

            let rs;
            const {code, start, end} = range(stats.size, req, res);
            if (code === 200) {
              res.statusCode = 200;
              rs = fs.createReadStream(filePath);
            } else {
              res.statusCode = 206;
              rs = fs.createReadStream(filePath, {start, end});
            }
            //通过createReadStream将filePath路径文件生成，用过pipe一点点返回客户端

            if (filePath.match(config.compress)){
              rs = compress(rs, req, res);
            }
            rs.pipe(res);
        } else if (stats.isDirectory()){
            const files = await readdir(filePath);//加await异步调用
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            const dir = path.relative(config.root,filePath);
            const data = {
                title: path.basename(filePath),
                dir: dir ? `/${dir}` : '',
                files: files
            }
            res.end(template(data));
        }
    }
    catch(ex) {
        console.error(ex);
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`${filePath} is not a directory or file\n ${ex.toString()}`);
}
}
