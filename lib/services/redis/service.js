let logger = require('../../../lib/logger/logger').logger(__filename);
let methods = require('../../commons/methods');
let config = require('../../../config/config');
let schema = require('../../schemas/redis/redis');
let redisLoader = require('../../loader/redisLoader');
let async = require('async');
let redisPool = require('../../connectors/pool');
let redisUri = redisPool.getUri(config.redis.host + ':' + config.redis.port + ':' + config.redis.database);

let getPostData = (post, callback) => {
	let postObj = {
		key: post.key,
	};
	if (postObj.key != 'all') {
		callback(true, 'parameter key not to be all');
	} else {
		callback(null, postObj);
	}
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

let redisQuery = (data, callback) => {
	//let redisLink = redisLoader.getRedisLink();
	logger.debug('redis query called!');
	redisPool.get(redisUri).keys('*', (err, keys) => {
		if (err) {
			logger.error(err);
			callback(500, err);
		} else {
			console.log(keys);
			callback(null, keys);
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
			redisQuery,
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

