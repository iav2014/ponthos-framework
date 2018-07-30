let logger = require('../../logger/logger').logger(__filename);
let path = require('../../../config/config').rest.path;
let service = require('../../services/mongo/service');
const cache = require('../../middleware/cache');
const request = require('../../middleware/request');
const log = require('../../middleware/log');


exports.registerRoutes = function (app) {
	'use strict';
	// public same route at get .. post & post with cache,,,
	app.post(path + 'mongo.count.cache', log('mongo'),cache.post(service));
	app.get(path + 'mongo.count', log('mongo'),request.get(service));
	app.post(path + 'mongo.count', log('mongo'),request.post(service));
};