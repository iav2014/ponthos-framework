let logger = require('../../logger/logger').logger(__filename);
let path = require('../../../config/config').rest.path;
let service = require('../../services/mobile/translator/service');

let middleware = (req, res) => {
	logger.debug('translator post method called');
	service.entry(req.body, (err, result) => {
		if (err) res.send(err);
		else {
			console.log(result);
			res.send(result);
		}
	});
}
exports.registerRoutes = function (app) {
	'use strict';
	app.post(path + 'translate', middleware);
	app.post(path + 'translate.route', middleware);
};
