/*
This is an example service using postgreSQL database,
see : https://github.com/brianc/node-postgres/wiki/FAQ
for more query examples
*/

let logger = require('../../../lib/logger/logger').logger(__filename);
let methods = require('../../commons/methods');
let config = require('../../../config/config');
let schema = require('../../schemas/postgres/postgres');
let postgresPool = require('../../connectors/pool');

let postgresUri = postgresPool.getUri(config.sql.postgres.uri);

let async = require('async');

let getPostData = (post, callback) => {
	let postObj = {
		cid: post.cid,
	};
	callback(null, postObj);
}

let checkSchema = (postObj, callback) => {
	methods.validateRegister(postObj, schema, (err, result) => {
		logger.debug('in:' + JSON.stringify(result));
		if (!err.valid) {
			logger.error(JSON.stringify(err));
			callback(true, err);
		}
		else {
			return callback(null, postObj);
		}
	});
}

let postgresQuery = (data, callback) => {
	logger.debug('postgresQuery called!');
	postgresPool.get(postgresUri).query('SELECT * FROM "userWidget" LIMIT 100;', (err, result) => {
		if (err) {
			logger.error(err);
			return callback(err);
		} else {
			logger.debug('query ok!');
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
			postgresQuery,
			adapter
		],
		(err, result) => {
			if (err) callback(result)
			else callback(err, result);
		}
	);
}

let entry = (post, callback) => {
	async.parallelLimit([async.apply(worker, post)], config.rest.max_callers, (err, result) => {
		if (err) logger.error('out:' + JSON.stringify(err));
		else logger.debug('out:' + JSON.stringify(result[0]));
		callback(err, result[0]);
	});
}

module.exports.entry = entry;

