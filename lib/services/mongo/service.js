var logger = require('../../../lib/logger/logger').logger(__filename);
var methods = require('../../commons/methods');
var config = require('../../../config/config');
var schema = require('../../schemas/mongo/mongo');
var mongoPool = require('../../connectors/pool');

var mongoTestUri = mongoPool.getUri(config.nosql.test.uri);

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
function mongoFind(data,callback){
	logger.debug('mongoFind called!');
	mongoPool.get(mongoTestUri).countWithOptions('million', {cid:data.cid}, function (err, result) {
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

function adapter(data, callback) {
	logger.debug('adapter:' + data);
	var json={
		collection:'millon',
		operation:'count',
		value:data
	}
	callback(null, json);
}

function worker(post, callback) {
	var async = require('async');
	async.waterfall([
			async.apply(getPostData, post),
			checkSchema,
			mongoFind,
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

