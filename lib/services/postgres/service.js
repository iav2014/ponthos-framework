/*
This is an example service using postgreSQL database,
see : https://github.com/brianc/node-postgres/wiki/FAQ
for more query examples
*/

var logger = require('../../../lib/logger/logger').logger(__filename);
var methods = require('../../commons/methods');
var config = require('../../../config/config');
var schema = require('../../schemas/postgres/postgres');
var postgresPool = require('../../connectors/pool');

var postgresUri = postgresPool.getUri(config.sql.test.uri);

var async = require('async');

function getPostData(post, callback) {
	var postObj = {
		cid: post.cid,
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
function postgresQuery(data,callback){
	logger.debug('postgresQuery called!');
	postgresPool.get(postgresUri).query('SELECT * FROM "userWidget" LIMIT 100;',  function (err, result) {
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
			postgresQuery,
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

