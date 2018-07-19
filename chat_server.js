// setup requirements
const http = require('http');
const fs = require('fs');
const port = process.env.PORT || 5000;

http.createServer(handleRequest).listen(port);
console.log('Listening on port:' + port);

function handleRequest(request, response) {
    console.log("Request recieved!");
    let fileName = 'index.html';
    let data = fs.readFileSync(fileName)

    response.setHeader('Content-Type',
        'text/html; charset=utf-8'
    )
    response.statusCode = 200;
    response.write(data)
    response.end();
}
