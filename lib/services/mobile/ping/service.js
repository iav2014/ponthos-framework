var logger = require('../../../../lib/logger/logger').logger(__filename);
var schema = require('../../../schemas/mobile/ping');
var methods = require('../../../commons/methods');
var config = require('../../../../config/config');

var async = require('async');

function getPostData(post, callback) {
	var postObj = {
		to: post.to,
	};
	callback(null, postObj);
}
function tracking(data,callback){
	//.. mongo db..
	callback(null,data);
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
function adapter(data,callback){
	logger.debug('adapter:'+data);
	
	callback(null,200);
}
function worker(post, callback) {
	var async = require('async');
	async.waterfall([
			async.apply(getPostData, post),
			checkSchema,
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

