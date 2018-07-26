module.exports = class Message {
	constructor(options ={}) {
		this.when = options.when || new Date();
		this.author = options.author || 'anonymous';
		this.body = options.body || '';
	}
	
};
