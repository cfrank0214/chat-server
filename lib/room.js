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
			this.name = this.capitalization(this.id);
		}
		this.messages = [];
	}
	capitalization(name) {
		let nameClean = name.toString().trim();
		let capitalName = nameClean[0].toUpperCase() + nameClean.slice(1, nameClean.length);
		return capitalName;
	}

	messageCount() {
		return this.messages.length;
	}

	sendMessage(message) {
		this.messages.push(message);
	}
	messagesSince(time) {
		let messageSince = [];
		for (let message of this.messages) {
			if (message.when > time) {
				messageSince.push(message);
			}
		}
		return messageSince;
	}
};
