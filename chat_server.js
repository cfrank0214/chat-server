const http = require('http');
const Assistant = require('./lib/assistant');
const House = require('./lib/house');
const port = process.env.PORT || 5000;
let house = new House();

http.createServer(handleRequest).listen(port);
console.log('Listening on port:' + port);

function handleRequest(request, response) {
	let url = require('url').parse(request.url);
	let path = url.pathname;

	console.log('Finding ' + path);
	let assistant = new Assistant(request, response);

	// "routing" happens here (not very complicated)
	let pathParams = parsePath(path);
	if (isChatAction(pathParams)) {
		handleChatAction(request, assistant);
	} else if (assistant.isRootPathRequested()) {
		assistant.sendFile('./public/index.html');
	} else {
		assistant.handleFileRequest();
	}
}

function isChatAction(pathParams) {
	return pathParams.action === 'chat';
}

function handleChatAction(request, handler) {
	if (request.method === 'GET') {
		
		if (handler.url.query) {
			let params = handler.decodeParams(handler.url.query)
			since = params.since
			sinceAsDate = new Date(since)
			sendChatMessages(handler, sinceAsDate);
		}
		
	} else if (request.method === 'POST') {
		handler.parsePostParams((params) => {
			let messageOptions = {
				username: 'Anonymous',
				body: params.body,
				when: new Date(Date.now()).toISOString()
			};
			house.sendMessageToRoom('general', messageOptions);
			let oneHour = (1000 * 60 * 60);
			let since = new Date(Date.now() - oneHour);
			sendChatMessages(handler, since);
		});
	} else {
		handler.sendError(405, "Method '" + request.method + "' Not Allowed");
	}
}

function sendChatMessages(handler, since) {
	console.log(since)
	let messages = house.roomWithId('general').messagesSince(since);
	let data = JSON.stringify(messages);
	let contentType = 'text/json';
	handler.finishResponse(contentType, data);
}

function parsePath(path) {
	let format;
	if (path.endsWith('.json')) {
		path = path.substring(0, path.length - 5);
		format = 'json';
	}
	let pathParts = path.slice(1).split('/');
	let action = pathParts.shift();
	let id = pathParts.shift();
	let pathParams = { action: action, id: id, format: format };
	return pathParams;
}
