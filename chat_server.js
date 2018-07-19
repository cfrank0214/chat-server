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
    let data
    let type = 'plain';

    try {
        if (request.url === '/') {
            fileName = 'index.html'

        } else {
            fileName = request.url.slice(1)
        }
        data = fs.readFileSync(fileName)
        type = fileName.split('.')[1];
        response.statusCode = 200;
    } catch (error) {
        console.log(error);
        data = "Error: " + error.toString();
        response.statusCode = 404;
    }

    let contentType = `text/${type}; charset=utf-8`

    response.setHeader('Content-Type', contentType)

    response.write(data)
    response.end();
}
