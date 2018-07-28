let Mongo = require('mongodb');
let retry = 1, config;
let mongoPool = require('./pool');
let log, policy;

function MongoConnector(logger, retrying, dbConfig) {
	log = logger;
	policy = retry = retrying;
	config = dbConfig;
	this.client = null;
}

MongoConnector.prototype = {
	init: function (callback) {
		'use strict';
		let self = this;
		if (retry-- < 0) return callback(new Error().statusCode = -1, null);
		
		let url = config.uri;
		
		
		Mongo.connect(url, config.options, function (err, db) {
			if (err) {
				log.error(err);
				return self.init(callback);
			}
			else {
				self.client = db.db(db.s.databaseName||db.s.options.dbName);
				retry = config.retry;
				mongoPool.set(url, self);
				callback(null, db);
			}
			db.on('close', function () {
				log.error('Close event received at:' + JSON.stringify(config));
				mongoPool.remove(url);
				retry = policy;
				return self.init(callback);
			});
		});
	},
	findOne: function (collectionName, data, callback) {
		'use strict';
		let collection = this.client.collection(collectionName);
		collection.findOne(data, function (err, result) {
			callback(err, result);
		});
	},
	find: function (collectionName, data, options, callback) {
		'use strict';
		if (typeof  options == 'function') {
			callback = options;
			options = {};
		}
		let collection = this.client.collection(collectionName);
		collection.find(data, options).toArray(function (err, result) {
			if (err) {
				callback(err);
			}
			else {
				callback(null, [].slice.call(result));
			}
		});
	},
	insert: function (collectionName, data, callback) {
		'use strict';
		let collection = this.client.collection(collectionName);
		collection.insert(data, function (err, result) {
			callback(err, result);
		});
	},
	count: function (collectionName, callback) {
		'use strict';
		this.client.collection(collectionName, function (err, coll) {
			coll.find({}, {}).count(function (err, count) {
				callback(err, count);
			});
		});
	},
	countWithOptions: function (collectionName, options, callback) {
		'use strict';
		this.client.collection(collectionName, function (err, coll) {
			coll.find(options, {}).count(function (err, count) {
				callback(err, count);
			});
		});
	},
	new: function (collectionName, callback) {
		'use strict';
		let options = {
			'limit': -1,
			sort: {id: -1}
		}
		this.client.collection(collectionName, function (err, coll) {
			coll.find({}, options).toArray(function (err, count) {
				callback(err, ++count[0].id);
			});
		});
	},
	max: function (collection, field, callback) {
		let sort = {}
		sort[field] = -1
		let options = {
			'limit': -1,
			'sort': sort
		}
		this.client.collection(collection, function (err, coll) {
			coll.find({}, options).toArray(function (err, count) {
				callback(err, count[0][field]);
			});
		});
	},
	recno: function (collectionName, callback) {
		'use strict';
		this.client.collection(collectionName, function (err, coll) {
			coll.count(function (err, count) {
				callback(null, count);
			})
		});
	},
	update: function (collectionName, query, data, options, callback) {
		'use strict';
		let collection = this.client.collection(collectionName);
		collection.update(query, data, options, function (err, result) {
			callback(err, result);
		});
	},
	remove: function (collectionName, query, callback) {
		'use strict';
		let collection = this.client.collection(collectionName);
		collection.remove(query, function (err, result) {
			callback(err, result);
		});
	},
	delete: function (collectionName, callback) {
		'use strict';
		let collection = this.client.collection(collectionName);
		collection.remove({}, function (err, result) {
			callback(err, result);
		});
	},
	findAndUpdate: function (collectionName, query, data, callback) {
		'use strict';
		let collection = this.client.collection(collectionName);
		collection.update(query, data, function (err, result) {
			callback(err, result);
		});
	},
	rename: function (collectionName, newCollectionName, callback) {
		'use strict';
		let collection = this.client.collection(collectionName);
		collection.rename(newCollectionName, {dropTarget: true}, function (err, result) {
			callback(err, result);
		});
	},
	drop: function (collectionName, callback) {
		'use strict';
		let collection = this.client.collection(collectionName);
		collection.drop(function (err, result) {
			callback(err, result);
		});
	},
	aggregate: function (collectionName, match, group, callback) {
		'use strict';
		let collection = this.client.collection(collectionName);
		collection.aggregate(match, group, function (err, result) {
			callback(err, result);
		});
	},
	distinct: function (collectionName, qs, callback) {
		'use strict';
		let collection = this.client.collection(collectionName);
		collection.distinct(qs, function (err, result) {
			callback(err, result);
		});
	},
	findAndModify: function (collectionName, query, so, replacement, options, callback) {
		'use strict';
		let collection = this.client.collection(collectionName);
		collection.findAndModify(query, so, replacement, options, function (err, result) {
			
			//callback(err, result);
			collection.findOne(query, function (err, item) {
				callback(err, item);
			});
		});
	},
	insertMany: function (collectionName, data, callback) {
		'use strict';
		let collection = this.client.collection(collectionName);
		collection.insertMany(data, function (err, result) {
			callback(err, result);
		});
	}
}
module.exports = MongoConnector;









