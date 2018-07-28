let logger = require('../../logger/logger').logger(__filename);
let path = require('../../../config/config').rest.path;
let service = require('../../services/postgres/service');

let mcache = require('memory-cache');
let duration = 10;

let middleware_cache = (req, res) => {
	logger.debug('postgres.cache  method used!');
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
		service.entry(req.body, (err, result) => {
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

let middleware_post = (req, res) => {
	logger.debug('postgres post method called');
	service.entry(req.body, (err, result) => {
		if (err) res.send(err);
		else res.send(result);
	});
}

let middleware_get = (req, res) => {
	logger.debug('postgres get method called');
	service.entry(req.query, (err, result) => {
		if (err) res.send(err);
		else res.send(result);
	});
}

exports.registerRoutes = function (app) {
	'use strict';
	// public same route at get .. post & post with cache,,,
	app.post(path + 'postgres.cache', middleware_cache);
	app.get(path + 'postgres', middleware_get);
	app.post(path + 'postgres', middleware_post);
};