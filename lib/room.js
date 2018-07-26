module.exports = class Room {
	constructor(options, theName) {
		if (!options) {
			throw 'room id required';
		}
		if (options === '') {
			throw 'room id required';
		}

		if (options.match(/^[a-z]+$/)) {
			this.id = options;
		} else {
			throw 'room id must contain only lowercase letters';
		}
		if (theName) {
			this.name = theName;
		} else {
            this.name = this.capitalize(this.id);
            
		}
		this.messages = [];
	}
	capitalize(name) {
		let nameClean = name.toString().trim();
		let capitalName = nameClean[0].toUpperCase() + nameClean.slice(1, nameClean.length);
		return capitalName;
	}

	messageCount() {
		return this.messages.length;
	}

	sendMessage(message) {
		// test to make sure message is a message objet
		this.messages.push(message);
	}
	messagesSince(time) {
        return this.messages.filter(message => new Date(message.when) > time);
	}
};
