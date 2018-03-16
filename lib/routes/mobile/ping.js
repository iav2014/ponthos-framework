var logger = require('../../logger/logger').logger(__filename);
var path = require('../../../config/config').rest.path;
var service = require('../../services/mobile/ping/service');

var mcache = require('memory-cache');

var duration=60;
function middleware_cache(req, res) {
	let body = req.body;
	let key = '__express__' + body;
	let cachedBody = mcache.get(key);
	if (cachedBody) {
		logger.debug('[get from cache] %s', new Date());
		res.send(cachedBody);
		return;
	} else {
		service.entry(req.body, function (err, result) {
			if (err) res.send(err);
			else {
				mcache.put(key, result, duration * 1000);
				logger.debug('[content: %s store to cache] at:%s', JSON.stringify(result), new Date());
				res.send(result);
			}
		});
	}
}
function middleware(req, res) {
	logger.debug('ping post method called');
	service.entry(req.body, function (err, result) {
		if(err) res.send(err);
		else res.sendStatus(result);
	});
}
function middleware_get(req, res) {
	logger.debug('ping get method called');
	service.entry(req.query, function (err, result) {
		if(err) res.send(err);
		else res.sendStatus(result);
	});
}
exports.registerRoutes = function (app) {
	'use strict';
	app.post(path+'ping.post', middleware_cache);
	app.get(path+'ping.get',middleware_get);
	app.get(path+'pong',middleware_get);
};