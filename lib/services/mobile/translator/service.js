/*
 This is an example of service.
 this service translate a post message parameter using google translator a message from  (language) to (language)
 using ISO639-1 codes
 google translator facility.
 */
var logger = require('../../../../lib/logger/logger').logger(__filename);
var validator = require('../../../utils/validator');
var schema = require('../../../schemas/mobile/rosetta');
var methods = require('../../../commons/methods');
var config = require('../../../../config/config');

var async = require('async');
var request = require('request');
var _gtUrl = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=it&tl=';
/*
if you need to use mongodb pool connector you must include this lines
var mongoPool = require('../../../connectors/mongodb_pool');
var mongoUri = mongoPool.getUri(config.databases.test);
example with languages collection :  mongoPool.get(mongoUri).find(config.collections.languages,function (err, result) { .. });
 */
var mongoPool = require('../../../connectors/mongodb_pool');
var mongoTestUri = mongoPool.getUri(config.nosql.test.uri);
var mongoTest2Uri = mongoPool.getUri(config.nosql.test2.uri);

function getPostData(post, callback) {
	
	var postObj = {
		from: post.from,
		to: post.to,
		message: post.message
	}
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
			callback(null, result);
		}
	});
}

function translate(postObj, callback) {
	googleTranslator(postObj.message, postObj.from, postObj.to, function (err, result) {
		if (err) callback(err);
		else callback(null, result);
	})
}

var toType = function (obj) {
	return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

function googleTranslator(msg, from, to, callback) {
	
	logger.debug('text:' + msg + ' from:' + from + ' to:' + to);
	request(_gtUrl + to + '&dt=t&q=' + msg
		, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(body);
				var _arrayResponse = [];
				try {
					var _arrayResponse = JSON.parse(body);
					logger.debug(_arrayResponse[0][0][0]);
					logger.debug(_arrayResponse[0][0][1]);
				} catch (err) {
					_arrayResponse = err;
				}
				callback(null, _arrayResponse);
			}
		})
}

function worker(post, callback) {
	var async = require('async');
	async.waterfall([
			async.apply(getPostData, post),
			checkSchema,
			translate
		],
		function (err, result) {
			if (err) callback(result)
			else callback(err, {source: post.message, target: result});
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

