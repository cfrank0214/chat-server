let chatForm = document.getElementById('chat-form');
let roomForm = document.getElementById('room-form');
let chatLog = document.getElementById('chat-log');
let getMessages = document.getElementById('getAllNow');
let getRooms = document.getElementById('getAllRooms');
let params = new URLSearchParams();

chatForm.addEventListener('submit', (event) => {
	let inputElement = chatForm.querySelector('input[name=body]');
	let message = inputElement.value;
	params.append('body', message);
	fetch('/chat', {
		method: 'POST',
		body: params
	})
		.then((response) => response.json())
		.then((messages) => {
			for (let message of messages) {
				localStorage.setItem('username', message.username);
				localStorage.setItem('body', message.body);
				localStorage.setItem('when', message.when);
			}
			chatLog.innerHTML = messages.map((message) => message.body).join('<br>');
		});
	event.preventDefault();
});

getMessages.addEventListener('click', (event) => {
	let since = localStorage.getItem('when');
	if (!since) {
		since = '2010-07-15T19:02:00.787Z';
	}
	params.append('since', since);
	fetch(`/chat/?since=${since}`, {
		method: 'GET'
	})
		.then((response) => response.json())
		.then((messages) => {
			chatLog.innerHTML = messages.map((message) => message.body).join('<br>');
		});
});

roomForm.addEventListener('submit', (event) => {
	let inputElement = roomForm.querySelector('input[name=body]');
	let room = inputElement.value;
	fetch(`/room/?room=${room}`, {
		method: 'POST'
	})
		.then((response) => response.json())
		.then((messages) => {
			console.log(`Created room with name ${messages}`);
		});
	event.preventDefault();
});

getRooms.addEventListener('click', (event) => {
	fetch(`/room`, {
		method: 'GET'
	})
		.then((response) => response.json())
		.then((messages) => {
			messages.forEach(function(rooms) {
				roomlist.innerHTML = rooms;
			});
			console.log(`Got list of rooms on drop-down click = ${messages}`);
		});
});

function loadRoomDropDown() {
	fetch(`/room`, {
		method: 'GET'
	})
		.then((response) => response.json())
		.then((messages) => {
			console.log(`Got list of rooms on page load = ${messages}`);
			messages.forEach(function(rooms) {
				roomlist.innerHTML = rooms;
			});
		});
}
