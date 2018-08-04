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

	let assistant = new Assistant(request, response);

	// "routing" happens here (not very complicated)
	let pathParams = parsePath(path);
	if (isChatAction(pathParams)) {
		handleChatAction(request, assistant, pathParams);
	} else if (isRoomAction(pathParams)) {
		handleRoomAction(request, assistant, pathParams);
	} else if (assistant.isRootPathRequested()) {
		assistant.sendFile('./public/index.html');
	} else {
		assistant.handleFileRequest();
	}
}

function isChatAction(pathParams) {
	return pathParams.action === 'chat';
}

function isRoomAction(pathParams) {
	return pathParams.action === 'room';
}

function handleChatAction(request, handler, pathParams) {
	if (request.method === 'GET') {
		if (handler.url.query) {
			let params = handler.decodeParams(handler.url.query);
			since = params.since;
			if (!since) {
				since = 0;
			}
			let room = pathParams.id;
			sinceAsDate = new Date(since);
			console.log(`Chat GET where params = ${room}; since = ${sinceAsDate}`);
			sendChatMessages(handler, room, sinceAsDate);
		}
	} else if (request.method === 'POST') {
		let room = pathParams.id;
		handler.parsePostParams((params) => {
			let messageOptions = {
				username: 'Anonymous',
				body: params.body,
				room: pathParams.id,
				when: new Date(Date.now()).toISOString()
			};

			house.sendMessageToRoom(room, messageOptions);
			let oneHour = 1000 * 60 * 60;
			let since = new Date(Date.now() - oneHour);
			console.log(`Chat Post where params = ${room}; since = ${since}`);
			sendChatMessages(handler, room, since);
		});
	} else {
		handler.sendError(405, "Method '" + request.method + "' Not Allowed");
	}
}

function handleRoomAction(request, handler) {
	if (request.method === 'GET') {
		sendRoomList(handler);
	} else if (request.method === 'POST') {
		let params = handler.decodeParams(handler.url.query);

		house.roomWithId(params.room);
	} else {
		handler.sendError(405, "Method '" + request.method + "' Not Allowed");
	}
}

function sendRoomList(handler) {
	let rooms = house.allRoomIds();
	if (rooms.length === 0) {
		house.roomWithId('general');
		rooms = [ 'general' ];
	}
	let data = JSON.stringify(rooms);
	let contentType = 'text/json';
	handler.finishResponse(contentType, data);
}

function sendChatMessages(handler, roomId, since) {
	house.roomWithId(roomId).messagesSince(since, (messages) => {
		let data = JSON.stringify(messages);
		console.log('in messagesSince: ' + data);
		let contentType = 'text/json';
		handler.finishResponse(contentType, data);
	});
}

function parsePath(path) {
	console.log(path);
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
