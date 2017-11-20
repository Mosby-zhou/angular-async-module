var http = require('http');
const request = require('request');
var fs = require('fs');
var rootDir = process.cwd();

http.createServer(function (req, resp) {
    var url = req.url;
    console.log('request url : ' + url);
    if (/\/[^\.\/]*$/.test(url)) {
        url = '/index.html';
    }
    var file;
    if(url.startsWith('/node_modules') || url.startsWith('/src')){
        file = rootDir + url;
    }else{
        file = rootDir + '/examples' + url;
    }
    console.log('file url : ' + file);

    fs.readFile(file, function (err, data) {
        if (err) {
            resp.writeHeader(404, {
                'content-type': 'text/html;charset="utf-8"'
            });
            resp.end('<h1>404错误</h1><p>你要找的页面不存在</p>');
        } else {
            if (file.endsWith('.js')) {
                resp.writeHeader(200, {
                    'content-type': 'application/x-javascript'
                });
            } else if (file.endsWith('.html')) {
                resp.writeHeader(200, {
                    'content-type': 'text/html;charset="utf-8"'
                });
            } else if (file.endsWith('.css') || file.endsWith('.scss')) {
                resp.writeHeader(200, {
                    'content-type': 'text/css;charset="utf-8"'
                });
            }
            resp.end(data);
        }
    })
}).listen(8888);

// 终端打印如下信息
console.log('Server running at http://127.0.0.1:8888/');