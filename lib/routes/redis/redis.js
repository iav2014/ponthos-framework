var logger = require('../../logger/logger').logger(__filename);
var path = require('../../../config/config').rest.path;
var service = require('../../services/redis/service');
const cache = require('../../middleware/cache');
//const request = require('../../middleware/request');
const log = require('../../middleware/log');


exports.registerRoutes = function (app) {
	'use strict';
	// public same route at get .. post & post with cache,,,
	app.post(path + 'redis.query.cache', log('redis.cache'),cache.post(service));
};