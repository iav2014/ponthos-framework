var logger = require('../../logger/logger').logger(__filename);
var path = require('../../../config/config').rest.path;
var service = require('../../services/mobile/translator/service');

function middleware(req, res) {
	logger.debug('translator post method called');
	service.entry(req.body, function (err, result) {
		if(err) res.send(err);
		else res.send(result);
	});
}
exports.registerRoutes = function (app) {
	'use strict';
	app.post(path+'translate', middleware);
	app.post(path+'translate.route',middleware);
};
