/*
This is an example service using mysql database,
see queries: https://github.com/mysqljs/mysql#performing-queries
*/

let logger = require('../../../lib/logger/logger').logger(__filename);
let methods = require('../../commons/methods');
let config = require('../../../config/config');
let schema = require('../../schemas/mysql/mysql');
let mysqlPool = require('../../connectors/pool');

let mysqlUri = mysqlPool.getUri(config.sql.mysql);

let async = require('async');

let getPostData = (post, callback) => {
	let postObj = {
		track_id: post.track_id,
	};
	callback(null, postObj);
}

let checkSchema = (postObj, callback) => {
	methods.validateRegister(postObj, schema, (err, result) => {
		logger.debug('in:' + JSON.stringify(result));
		if (!err.valid) {
			logger.error(JSON.stringify(err));
			callback(400, err);
		}
		else {
			return callback(null, postObj);
		}
	});
}

// example mysql query, if pool is  created using pool & release connection,
// see: https://github.com/mysqljs/mysql/blob/master/lib/Pool.js#L194-L207
let mysqlQuery = (data, callback) => {
	logger.debug('mysqlQuery called!');
	mysqlPool.get(mysqlUri).query('SELECT * FROM test.codes', (err, result) => {
		if (err) {
			logger.error(500, err);
			return callback(err);
		} else {
			logger.debug(`query ok! read:${result.length} rows`);
			callback(null, result);
		}
	});
}

let adapter = (data, callback) => {
	logger.debug('adapter:' + data);
	callback(null, data);
}

let worker = (post, callback) => {
	let async = require('async');
	async.waterfall([
			async.apply(getPostData, post),
			checkSchema,
			mysqlQuery,
			adapter
		],
		(err, result) => {
			callback(err, result);
		}
	);
}

let entry = (post, callback) => {
	async.parallelLimit([async.apply(worker, post)], config.rest.max_callers, (err, result) => {
		callback(err, result[0]);
	});
}

module.exports.entry = entry;

