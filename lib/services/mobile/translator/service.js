/*
 This is an example of service.
 this service translate a post message parameter using google translator a message from  (language) to (language)
 using ISO639-1 codes
 google translator facility.
 */
let logger = require('../../../../lib/logger/logger').logger(__filename);
let schema = require('../../../schemas/mobile/rosetta');
let methods = require('../../../commons/methods');
let config = require('../../../../config/config');

let async = require('async');
let request = require('request');
let _gtUrl = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=it&tl=';
/*
if you need to use mongodb pool connector you must include this lines
let mongoPool = require('../../../connectors/mongodb_pool');
let mongoUri = mongoPool.getUri(config.databases.test);
example with languages collection :  mongoPool.get(mongoUri).find(config.collections.languages,function (err, result) { .. });

let mongoPool = require('../../../connectors/mongodb_pool');
let mongoTestUri = mongoPool.getUri(config.nosql.test.uri);
let mongoTest2Uri = mongoPool.getUri(config.nosql.test2.uri);
*/
let getPostData = (post, callback) => {
	
	let postObj = {
		from: post.from,
		to: post.to,
		message: post.message
	}
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
			callback(null, result);
		}
	});
}

let translate = (postObj, callback) => {
	googleTranslator(postObj.message, postObj.from, postObj.to, (err, result) => {
		if (err) callback(err);
		else callback(null, result);
	})
}

let googleTranslator = (msg, from, to, callback) => {
	
	logger.debug('text:' + msg + ' from:' + from + ' to:' + to);
	request(_gtUrl + to + '&dt=t&q=' + msg
		, (error, response, body) => {
			if (!error && response.statusCode == 200) {
				console.log(body);
				let _arrayResponse = [];
				try {
					let _arrayResponse = JSON.parse(body);
					logger.debug(_arrayResponse[0][0][0]);
					logger.debug(_arrayResponse[0][0][1]);
				} catch (err) {
					_arrayResponse = err;
				}
				callback(null, _arrayResponse);
			}
		})
}
let adapter = (data, callback) => {
	logger.debug('adapter');
	callback(null, data);
	
}

let worker = (post, callback) => {
	let async = require('async');
	async.waterfall([
			async.apply(getPostData, post),
			checkSchema,
			translate,
			adapter
		],
		(err, result) => {
			if (err) callback(result)
			else callback(err, {source: post.message, target: result});
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

