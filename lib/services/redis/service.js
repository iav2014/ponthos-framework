var logger = require('../../../lib/logger/logger').logger(__filename);
var methods = require('../../commons/methods');
var config = require('../../../config/config');
var schema = require('../../schemas/redis/redis');
var redisLoader = require('../../loader/redisLoader');
var async = require('async');
var redisPool = require('../../connectors/pool');
var redisUri = redisPool.getUri(config.redis.host+':'+config.redis.port+':'+config.redis.database);
console.log(redisUri);
function getPostData(post, callback) {
	var postObj = {
		key: post.key,
	};
	if (postObj.key != 'all') {
		callback(true, 'parameter key not to be all');
	} else {
		callback(null, postObj);
	}
	
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

function redisQuery(data, callback) {
	//var redisLink = redisLoader.getRedisLink();
	logger.debug('redis query called!');
	redisPool.get(redisUri).keys('*', function (err, keys) {
		if (err) {
			logger.error(err);
			callback(err);
		} else {
			console.log(keys);
			callback(null, keys);
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
			redisQuery,
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
		else logger.debug('out:' + JSON.stringify(result));
		callback(err, result[0]);
	});
}

module.exports.entry = entry;

