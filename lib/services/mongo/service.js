let logger = require('../../../lib/logger/logger').logger(__filename);
let methods = require('../../commons/methods');
let config = require('../../../config/config');
let schema = require('../../schemas/mongo/mongo');
let mongoPool = require('../../connectors/pool');

let mongoTestUri = mongoPool.getUri(config.nosql.test.uri);

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
let mongoFind = (data, callback) => {
	logger.debug('mongoFind called!');
	mongoPool.get(mongoTestUri).countWithOptions('million', {cid: data.cid}, (err, result) => {
		if (err) {
			logger.error(err);
			return callback(err);
		} else {
			logger.debug('million find ok!');
			console.log(result);
			callback(null, result);
		}
	});
}

let adapter = (data, callback) => {
	logger.debug('adapter:' + data);
	let json = {
		collection: 'millon',
		operation: 'count',
		value: data
	}
	callback(null, json);
}

let worker = (post, callback) => {
	let async = require('async');
	async.waterfall([
			async.apply(getPostData, post),
			checkSchema,
			mongoFind,
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

