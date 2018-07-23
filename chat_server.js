const http = require('http');
const mime = require('mime-types');
const Assistant = require('./assistant');
const port = process.env.PORT || 5000;

http.createServer(handleRequest).listen(port);
console.log('Listening on port:' + port);

function handleRequest(request, response) {
	console.log('request.url = ' + request.url);

	let assistant = new Assistant(request, response);
    let path = assistant.path;
    let messages = [];

	try {
		if (path === '/') {
			assistant.sendFile('index.html');
		} else if (path === '/chat') {
			console.log('Parsing the POST');
			assistant.parsePostParams((params) => {
				let message = {
					name: 'Anonymous',
					body: params.body,
					when: new Date().toISOString()
				};
                messages.push(message);
                let data = JSON.stringify(messages)
                let type = mime.lookup('json');
                assistant.finishResponse(type, data)
			});
		} else {
            let fileName = request.url.slice(1);
            assistant.sendFile(fileName);
		}
	} catch (error) {
        assistant.sendError(404, 'Error: ' + error.toString())
	}
}
