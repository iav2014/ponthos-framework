let logger = require('../../../../lib/logger/logger').logger(__filename);
let schema = require('../../../schemas/mobile/ping');
let methods = require('../../../commons/methods');
let config = require('../../../../config/config');

let async = require('async');

let getPostData = (post, callback) => {
	let postObj = {
		to: post.to,
	};
	callback(null, postObj);
}
let tracking = (data, callback) => {
	//.. mongo db..
	callback(null, data);
}
let checkSchema = (postObj, callback) => {
	methods.validateRegister(postObj, schema, (err, result) => {
		if (!err.valid) {
			logger.error(JSON.stringify(err));
			callback(400, err);
		}
		else {
			return callback(null, postObj);
		}
	});
}
let adapter = (data, callback) => {
	logger.debug('adapter:' + data);
	
	callback(null, 200);
}
let worker = (post, callback) => {
	let async = require('async');
	async.waterfall([
			async.apply(getPostData, post),
			checkSchema,
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

