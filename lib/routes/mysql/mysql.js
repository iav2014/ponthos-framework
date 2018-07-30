let logger = require('../../logger/logger').logger(__filename);
let path = require('../../../config/config').rest.path;
let service = require('../../services/mysql/service');

const cache = require('../../middleware/cache');
const request = require('../../middleware/request');
const log = require('../../middleware/log');
exports.registerRoutes = function (app) {
	'use strict';
	// public same route at get .. post & post with cache,,,
	app.post(path + 'mysql.cache', log('mysql.cache'),cache.post(service));
	app.get(path + 'mysql', log('mysql.get'),request.get(service));
	app.post(path + 'mysql', log('mysql.post'),request.post(service));
};