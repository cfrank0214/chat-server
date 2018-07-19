// setup requirements
const http = require('http');
const fs = require('fs');
const port = process.env.PORT || 5000;

http.createServer(handleRequest).listen(port);
console.log('Listening on port:' + port);

function handleRequest(request, response) {
    console.log("Request recieved!");
    console.log(request.url)
    let fileName;
    if (request.url === '/') {
        fileName = 'index.html'

    } else {
        fileName = request.url.slice(1)
    }

    let data = fs.readFileSync(fileName)
    let type = fileName.split('.')[1];
    let contentType = `text/${type}; charset=utf-8`

    response.setHeader('Content-Type', contentType)
    response.statusCode = 200;
    response.write(data)
    response.end();
}
