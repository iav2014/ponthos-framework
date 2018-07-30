let logger = require('../../logger/logger').logger(__filename);
let path = require('../../../config/config').rest.path;
let service = require('../../services/mobile/ping/service');
// const cache = require('../../middleware/cache');
const request = require('../../middleware/request');
const log = require('../../middleware/log');

exports.registerRoutes = (app) => {
	'use strict';
	app.get(path + 'ping.get',
		log('ping'),
		request.get(service));
};