// const http = require('node:http');

// const express = require('express');
// const app = express();


// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   app.get('/', function(request, response){
//     response.sendFile('/Users/cheesestick/Desktop/InvestorHeaven/HTML/index.html');
//   });
// });




var http = require('http');
const hostname = '127.0.0.1';
const port = 8000;
var url = require('url');
var fs = require('fs');
var server = http.createServer(function(request, response) {
    var path = url.parse(request.url).pathname;
    switch (path) {
        case '/index.html':
            fs.readFile('/Users/cheesestick/Desktop/InvestorHeaven/HTML/index.html', function(error, data) {
                if (error) {
                    response.writeHead(404);
                    response.write(error);
                    response.end();
                } else {
                    response.writeHead(200, {
                        'Content-Type': 'text/html'
                    });
                    response.write(data);
                    response.end();
                }
            });
            break;
        case '/index.html':
          fs.readFile('/Users/cheesestick/Desktop/InvestorHeaven/HTML/index.html', function(error, data) {
              if (error) {
                  response.writeHead(404);
                  response.write(error);
                  response.end();
              } else {
                  response.writeHead(200, {
                      'Content-Type': 'text/html'
                  });
                  response.write(data);
                  response.end();
              }
          });
          break;
        default:
            response.writeHead(404);
            response.write("Webpage Does Not Exist - 404");
            response.end();
            break;
    }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});