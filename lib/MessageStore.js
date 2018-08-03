#!/usr/bin/env node
'use strict';
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

module.exports = class MessageStore {
	constructor(collectionName) {
		this.url = process.env.MONGODB_URI || 'mongodb://localhost:27017';
		this.dbName = 'chat';
		this.collectionName = collectionName;
	}


	// do something with the database
	// the caller must pass a callback, which we will call with the db and collection;
	// then the caller must call *another* callback to close the database connection
	connectAnd(callback) {
		MongoClient.connect(this.url, { useNewUrlParser: true }, (err, client) => {
			assert.equal(null, err);
			// console.log("Connected successfully to database");
			const db = client.db(this.dbName);
			const collection = db.collection(this.collectionName);

			callback(db, collection, () => {
				client.close();
			});
		});
	}
	saveEntry(entry) {
		console.log(this)
		this.connectAnd((db, collection, finishUp) => {
			collection.insertOne(entry, (err, r) => {
				assert.equal(null, err);
				assert.equal(1, r.insertedCount);
				finishUp();
			});
		});
	}
};
