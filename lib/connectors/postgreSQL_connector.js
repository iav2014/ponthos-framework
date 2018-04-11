var logger = require('../logger/logger').logger(__filename);
var pg = require('pg');
var postgreSQLPool = require('./pool');

function postgreConnector(db, callback) {
	createClient(db, function (err, pool) {
		if (err) {
			logger.error(err);
			callback(err);
		} else {
			logger.debug('connected to database:' + db.uri);
			postgreSQLPool.set(db.uri, pool);
			callback(null, pool);
		}
	});
}

function createClient(db, callback) {
	var pool = new pg.Pool(db);
	pool.connect(function (err, client, done) {
		if (err) {
			return callback(err);
		} else {
			return callback(null, pool);
		}
	});
}

module.exports = postgreConnector;