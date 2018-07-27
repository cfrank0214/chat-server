let chatForm = document.getElementById('chat-form');
let chatLog = document.getElementById('chat-log');
let getMessages = document.getElementById('getAllNow');
let params = new URLSearchParams();

chatForm.addEventListener('submit', (event) => {
	let inputElement = chatForm.querySelector('input[name=body]');
	let message = inputElement.value;
	params.append('body', message);
	fetch('/chat/dogs', {
		method: 'POST',
		body: params
	})
		.then((response) => response.json())
		.then((messages) => {
			console.log(messages);
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
	console.log(since);
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

function loadRoomDropDown() {
    fetch(`/room`, {
		method: 'GET'
	})
		.then((response) => response.json())
		.then((messages) => {
            console.log(messages)
			roomlist.innerHTML = messages.room
		});
}