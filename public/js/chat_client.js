let chatForm = document.getElementById('chat-form');
let roomForm = document.getElementById('room-form');
let chatLog = document.getElementById('chat-log');

let roomlist = document.getElementById('dropdown-menu');

let getMessages = document.getElementById('getAllNow');
let getRooms = document.getElementById('getAllRooms');
let params = new URLSearchParams();

chatForm.addEventListener('submit', (event) => {
	let chatMessage = chatForm.querySelector('input[name=body]');
	let message = chatMessage.value;
	let room = localStorage.getItem('room');
	
	params.append('body', message);
	
	fetch(`/chat/${room}`, {
		method: 'POST',
		body: params
	})
		.then((response) => response.json())
		.then((messages) => {
			console.log(` messages = ${messages[0].body}`)
			chatLog.innerHTML = messages.map((message) => message.body).join('<br>');
		});
	event.preventDefault();
});

getMessages.addEventListener('click', (event) => {
	let since = localStorage.getItem('when');
	let room = localStorage.getItem('room');
	if (!since) {
		since = '2010-07-15T19:02:00.787Z';
	}
	params.append('since', since);
	fetch(`/chat/${room}?since=${since}`, {
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
		.then((rooms) => {
			roomlist.innerHTML = ''
			
			if (rooms.length > 1) {
				let roomArray = []
				for (let room of rooms) {
					room = `<a class="dropdown-item" onclick='enterRoom("${room}")'><div>` + room + "</div></a>"
					roomArray.push(room)
				}
				roomlist.innerHTML += roomArray.join('')
			} else {
				console.log(`Got list of rooms on drop-down click = ${rooms}`);
				rooms[0] = `<a class="dropdown-item" onclick='enterRoom("${rooms[0]}")'><div>` + rooms[0] + "</div></a>"
				roomlist.innerHTML += rooms.join('')
			}
				
			
		});
});

function enterRoom(room) {
	localStorage.setItem('room', room);
	
	let dropdown = document.getElementById('dropdown')
	dropdown.style = 'display: none;'
	let roomInput = document.getElementById('form-input-room')
	roomInput.style = 'display: none;'
	let messageInput = document.getElementById('hide-on-load')
	messageInput.style = 'display: block;'
	let messageSubmitBTN = document.getElementById('roomInput')
	messageSubmitBTN.style = 'display: block;'
	fetch(`/chat/${room}`, {
		method: 'GET'
	})
		.then((response) => response.json())
		.then((messages) => {
			console.log(`Enter room = ${room} with messages = ${messages}`)
			if(messages){
				chatLog.innerHTML = `Welcome to the ${room} chat room`
			} else {
				chatLog.innerHTML = messages.map((message) => message.body).join('<br>');
			}
			
			
		});
		
}
