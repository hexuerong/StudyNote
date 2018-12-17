const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');

const server = http.createServer((request,response) => {
    // 解析请求，包括文件名
    let pathname = url.parse(request.url).pathname;
    //application/x-javascript
    // 输出请求的文件名
    // console.log("Request for " + pathname + " received.");
    
    // 从文件系统中读取请求的文件内容
    if(pathname == '/') pathname += 'test.html';
    fs.readFile(pathname.substr(1), function (err, data) {
        if (err) {
            console.log(err);
            // HTTP 状态码: 404 : NOT FOUND
            // Content Type: text/plain
            response.writeHead(404, {'Content-Type': 'text/html'});
        }else{             
            // HTTP 状态码: 200 : OK
            // Content Type: text/plain
            if(pathname.endsWith('.html')){
                response.writeHead(200, {'Content-Type': 'text/html'});   
            }else if(pathname.endsWith('.js')){
                response.writeHead(200, {'Content-Type': 'application/x-javascript'});   
            } 
            
            // 响应文件内容
            response.write(data.toString());        
        }
        //  发送响应数据
        response.end();
    });   
});

server.listen(8088,'localhost',200,res => {
    console.log('HTTP Server is running on: http://localhost:%s', 8088);
});