var fs = require('fs'),
    http = require('http'),
    port = 7077;

// define the routes to the views we want to use
let routes = {
  '/' : 'index.html',
  '/cars' : 'cars.html',
  '/cats' : 'cats.html',
  '/cars/new' : 'add_car.html',
}

var server = http.createServer(function(request, response) {
  console.log(`client requested URL: ${request.url}`);


  if ( request.url in routes ) {
    console.log(`defined route found --> ${request.url}`);
    serveView(routes[request.url], response);
  } else {
    // parse the request
    let urlParts = request.url.split('/');
    console.log(urlParts);

    if ( request.url === '/stylesheets/style.css' ) {
      fs.readFile('stylesheets/style.css', 'utf8', function(error, contents) {
        response.writeHead(200, {'Content-Type': 'text/css'});
        response.write(contents);
        response.end();
      })

    } else {
      response.writeHead(404);
      response.end('File not found!');
    }
  }

});

server.listen(port);
console.log(`server listening on port ${port}`);

function serveView(filename, response) {
  fs.readFile(`views/${filename}`, 'utf8', function(error, contents) {
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(contents);
    response.end();
  });

}
