let logger = require('../../logger/logger').logger(__filename);
let path = require('../../../config/config').rest.path;
let service = require('../../services/mobile/translator/service');
const request = require('../../middleware/request');
const log = require('../../middleware/log');

exports.registerRoutes = function (app) {
	'use strict';
	app.get(path + 'translate.get', log('translator'), request.get(service));
	app.post(path + 'translate.post', log('translator'), request.post(service));
};
