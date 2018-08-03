#!/usr/bin/env node
'use strict';
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

module.exports = class MessageStore {
  constructor(collectionName) {
    this.url = process.env.MONGODB_URI || 'mongodb://localhost:27017';
    this.dbName = 'chat';

    // todo: make one collection for all messages, not one per room
    this.collectionName = collectionName;

    this.openConnection(); // danger: async
  }

  openConnection() { // danger: async
    MongoClient.connect(this.url, { useNewUrlParser: true }, (err, client) => {
      console.log("connected to " + this.url)
      this.client = client;
      this.db = client.db(this.dbName);
      this._collection = this.db.collection(this.collectionName);
    });
  }

  closeConnection() {
    client.close();
  }

  connectionIsOpen() {
    return !!(this.client);
  }

  get collection() {
    // if we try to get the collection before it's there, fail fast
    assert.equal(true, this.connectionIsOpen());
    return this._collection;
  }

  saveEntry(entry) {
    console.log(this)
    this.collection.insertOne(entry, (err, r) => {
      assert.equal(null, err);
      assert.equal(1, r.insertedCount);
    });
  }

  messagesSince(time, callback) {
    let cursor = this.collection.find({ "when": { $gt: new Date(time).toISOString() } })
    let results = []
    cursor.forEach((entry) => {
      results.push(entry);
    },
      (err) => {
        assert.equal(err, null);
        callback(results);
      });
  }
};
