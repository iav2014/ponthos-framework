var logger = require('../../logger/logger').logger(__filename);
var path = require('../../../config/config').rest.path;
var service = require('../../services/redis/service');

var mcache = require('memory-cache');
var duration = 10;

function middleware_cache(req, res) {
	logger.debug('redis.query.cache method used!');
	logger.debug(`cache expiry at:${duration} seconds,,,`);
	let body = req.body;
	let key = '__express__' + JSON.stringify(body);
	let cachedBody = mcache.get(key);
	if (cachedBody) {
		let str = `[get from cache: ${JSON.stringify(cachedBody)}]`;
		logger.debug(str);
		res.send(cachedBody);
		return;
	} else {
		service.entry(req.body, function (err, result) {
			if (err) res.send(err);
			else {
				mcache.put(key, result, duration * 1000);
				let str = `[content: ${JSON.stringify(result)} store to cache at: ${new Date()}]`;
				logger.debug(str);
				res.send(result);
			}
		});
	}
}

function middleware_post(req, res) {
	logger.debug('redis.find post method called');
	service.entry(req.body, function (err, result) {
		if (err) res.send(err);
		else res.send(result);
	});
}

function middleware_get(req, res) {
	logger.debug('redis.query get method called');
	service.entry(req.query, function (err, result) {
		if (err) res.send(err);
		else res.send(result);
	});
}

exports.registerRoutes = function (app) {
	'use strict';
	// public same route at get .. post & post with cache,,,
	app.post(path + 'redis.query.cache', middleware_cache);
};