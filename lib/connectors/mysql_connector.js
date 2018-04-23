var logger = require('../logger/logger').logger(__filename);
var mysql = require('mysql');
var mysqlPool = require('./pool');

function mysqlConnector(db, callback) {
	createClient(db, function (err, pool) {
		if (err) {
			logger.error(err);
			callback(err);
		} else {
			pool.query('SELECT 1+1', function (err, result) { // test pool ok
				if (err) callback(err);
				else {
					logger.debug('connected to database:' + JSON.stringify(db));
					mysqlPool.set(db, pool);
					callback(null, pool);
				}
			})
		}
	});
}

function createClient(db, callback) {
	try {
		var pool = mysql.createPool(db);
		logger.debug('create pool at:' + JSON.stringify(db));
		callback(null, pool);
	} catch (error) {
		logger.error(error);
		callback(error);
	}
}

module.exports = mysqlConnector;