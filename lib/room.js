const MessageStore = require('./MessageStore');

module.exports = class Room {
  constructor(roomId, theName) {
    // todo: tighten up this guard clause
    if (!roomId || roomId === '') {
      throw 'room id required';
    }

    if (roomId.match(/^[a-z]+$/)) {
      this.id = roomId;
    } else {
      throw 'room id must contain only lowercase letters';
    }

    if (theName) {
      this.name = theName;
    } else {
      this.name = this.capitalize(this.id);
    }

    this.messageStore = new MessageStore();
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
    // todo: test to make sure message is a message objet
    
    this.messageStore.saveEntry(message);
  }

  messagesSince(time, callback) {
    this.messageStore.messagesSince(time, callback);

  }

};
