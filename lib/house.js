let Room = require('./room.js');

module.exports = class House {
	constructor() {
		this.allRooms = [];
	}

	sendMessageToRoom(roomId, message) {
		this.roomWithId(roomId).sendMessage(message);	
	}

	roomWithId(roomId) {
		let roomFound = this.allRooms.find((room) => {
			return room.id === roomId;
		});

		if (roomFound) {
			return roomFound;
		} else {
			let newRoom = new Room(roomId)
			this.allRooms.push(newRoom);
			return newRoom
		}
	}

	allRoomIds() {
		return this.allRooms.map(room => room.id) 
	}
};
