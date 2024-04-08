// Create web server 
// Load the http module to create an HTTP server.
var http = require('http');
var fs = require('fs');
var url = require('url');

var comments = require('./comments.json');

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
  var url_parts = url.parse(request.url, true);
  var query = url_parts.query;
  var path = url_parts.pathname;
  console.log(path);
  if (path === '/comments' && request.method === 'GET') {
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.end(JSON.stringify(comments));
  } else if (path === '/comments' && request.method === 'POST') {
    var body = '';
    request.on('data', function (data) {
      body += data;
    });
    request.on('end', function () {
      var newComment = JSON.parse(body);
      comments.push(newComment);
      fs.writeFile('./comments.json', JSON.stringify(comments), function (err) {
        if (err) throw err;
        response.writeHead(201, {'Content-Type': 'application/json'});
        response.end(JSON.stringify(newComment));
      });
    });
  } else {
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.end('Not Found');
  }
});

// Listen on port 8000, IP defaults to