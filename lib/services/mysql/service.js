/*
This is an example service using mysql database,
see queries: https://github.com/mysqljs/mysql#performing-queries
*/

var logger = require('../../../lib/logger/logger').logger(__filename);
var methods = require('../../commons/methods');
var config = require('../../../config/config');
var schema = require('../../schemas/mysql/mysql');
var mysqlPool = require('../../connectors/pool');

var mysqlUri = mysqlPool.getUri(config.sql.mysql);

var async = require('async');

function getPostData(post, callback) {
	var postObj = {
		track_id: post.track_id,
	};
	callback(null, postObj);
}

function checkSchema(postObj, callback) {
	methods.validateRegister(postObj, schema, function (err, result) {
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

// example mysql query, if pool is  created using pool & release connection,
// see: https://github.com/mysqljs/mysql/blob/master/lib/Pool.js#L194-L207
function mysqlQuery(data, callback) {
	logger.debug('mysqlQuery called!');
	mysqlPool.get(mysqlUri).query('SELECT * FROM test.codes', function (err, result) {
		if (err) {
			logger.error(err);
			return callback(err);
		} else {
			logger.debug('query ok!');
			callback(null, result);
		}
	});
}

function adapter(data, callback) {
	logger.debug('adapter:' + data);
	callback(null, data);
}

function worker(post, callback) {
	var async = require('async');
	async.waterfall([
			async.apply(getPostData, post),
			checkSchema,
			mysqlQuery,
			adapter
		],
		function (err, result) {
			if (err) callback(result)
			else callback(err, result);
		}
	);
}

function entry(post, callback) {
	async.parallelLimit([async.apply(worker, post)], config.rest.max_callers, function (err, result) {
		if (err) logger.error('out:' + JSON.stringify(err));
		else logger.debug('out:' + JSON.stringify(result[0]));
		callback(err, result[0]);
	});
}

module.exports.entry = entry;

