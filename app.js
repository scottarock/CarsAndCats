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

// set up the server
var server = http.createServer(function(request, response) {
  console.log(`client requested URL: ${request.url}`);

  // check to see if request is for defined route and handle it
  if ( request.url in routes ) {
    // console.log(`defined route found --> ${request.url}`);
    serveView(routes[request.url], response);

  } else { // check for file request from view and handle it
    // parse the request
    let parsedRequest = request.url.split('/'),
        directory = parsedRequest[1],
        filePath = parsedRequest.slice(2).join('/');
    // console.log(parsedRequest);
    // console.log(`directory = ${directory}`);
    // console.log(`filePath = ${filePath}`);


    if ( directory === 'images' ) {
      // image file from requested
      serveImage(filePath, response);
    } else if ( directory === 'stylesheets' ) {
      // serve css file
      serveTextFile(`${directory}/${filePath}`, response);
    } else {
      response.writeHead(404);
      response.end('File not found!');
    }
  }

});
// start up the server on the port
server.listen(port);
console.log(`server listening on port ${port}`);

function serveView(filePath, response) {
  fs.readFile(`views/${filePath}`, 'utf8', function(error, contents) {
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(contents);
    response.end();
  });
}

function serveImage(filePath, response) {
  let imageType = filePath.slice(filePath.lastIndexOf('.') + 1);
  fs.readFile(`images/${filePath}`, function(error, contents) {
    response.writeHead(200, {'Content-Type': `image/${imageType}`});
    response.write(contents);
    response.end();
  });
}

function serveTextFile(filePath, response) {
  let types = {
    css : 'css',
    js : 'javascript',
  };
  let fileType = types[filePath.slice(filePath.lastIndexOf('.') + 1)];
  fs.readFile(filePath, 'utf8', function(error, contents) {
    response.writeHead(200, {'Content-Type': `text/${fileType}`});
    response.write(contents);
    response.end();
  });
}
