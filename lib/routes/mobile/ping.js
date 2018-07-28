let logger = require('../../logger/logger').logger(__filename);
let path = require('../../../config/config').rest.path;
let service = require('../../services/mobile/ping/service');

let mcache = require('memory-cache');

let duration = 60;
let middleware_cache = (req, res) => {
	let body = req.body;
	let key = '__express__' + body;
	let cachedBody = mcache.get(key);
	if (cachedBody) {
		logger.debug('[get from cache] %s', new Date());
		res.send(cachedBody);
		return;
	} else {
		service.entry = (req.body, (err, result) => {
			if (err) res.send(err);
			else {
				mcache.put(key, result, duration * 1000);
				logger.debug('[content: %s store to cache] at:%s', JSON.stringify(result), new Date());
				res.send(result);
			}
		});
	}
}
let middleware = (req, res) => {
	logger.debug('ping post method called');
	service.entry(req.body, (err, result) => {
		if (err) res.send(err);
		else res.sendStatus(result);
	});
}

let middleware_get = (req, res) => {
	logger.debug('ping get method called');
	service.entry(req.query, (err, result) => {
		if (err) res.send(err);
		else res.sendStatus(result);
	});
}

exports.registerRoutes = (app) => {
	'use strict';
	app.post(path + 'ping.post', middleware_cache);
	app.get(path + 'ping.get', middleware_get);
	app.get(path + 'pong', middleware_get);
};